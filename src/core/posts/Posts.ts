import * as Store from 'configstore';
import { IPostInfo, IPostSummary } from '../types';
import Peers from '../peers/Peers';
import { string2pubkey, verifyPostInfo, verifyPublicKey } from '../encrypt';
import * as hash from 'object-hash';
import * as R from 'ramda';

const store = new Store('proline-core', {
  postlist: { }, // postlist[cid]
  postinfo: { }, // postinfo[cid][pid]
  publickey: { }, // publickey[cid]
  subscribed: [] // [subscribed]
});

type RequestType = 'local-only' | 'online-only' | 'both';

/**
 * 管理文章以及秘钥
 */
export default class Posts {

  /**
   * 获取公钥，如果没有则从 p2p 中获取。
   * @param {KeyObject} 公钥
   */
  public static async getPublicKey(cid: string, online: RequestType = 'both') {
    const storepath = ['publickey', cid].join('.');
    const keystr = store.get(storepath) as string;

    if (online === 'local-only' || online === 'both' && keystr) {
      return keystr ? string2pubkey(keystr) : null;
    }

    const fres = await Peers.each((pr) => pr.queryPublicKey(cid));

    const result = fres.filter(verifyPublicKey.bind(null, cid))[0];
    if (result) {
      store.set(storepath, result);
    }

    return result ? string2pubkey(result) : null;
  }

  /**
   * 订阅频道
   */
  public static async subscribe(cid: string) {
    const publickey = await this.getPublicKey(cid);
    if (!publickey) {
      return 'Failed to fetch public key';
    }
    const subscribed = store.get('subscribed') as string[];
    const set = new Set(subscribed).add(cid);
    store.set('subscribed', Array.from(set));

    return null;
  }

  /**
   * 取消订阅
   */
  public static async unsubscribe(cid: string) {
    const subscribed = store.get('subscribed') as string[];
    const set = new Set(subscribed);
    const result = set.delete(cid);
    store.set('subscribed', Array.from(set));

    return result;
  }

  /**
   * 是否订阅
   */
  public static isSubscribed(cid: string) {
    const subscribed = store.get('subscribed') as string[];

    return R.contains(cid, subscribed);
  }

  /**
   * 订阅列表
   */
  public static subscribedList() {
    return store.get('subscribed') as string[];
  }

  /**
   * 获取文章详细信息，如果没有则从 p2p 中获取。
   * @param {boolean} online 是否离线
   * @returns {IPostInfo} 结果
   */
  public static async getPostInfo(cid: string, pid: string, online: RequestType = 'both') {
    const storepath = ['postinfo', cid, pid].join('.');
    const localData = store.get(storepath) as IPostInfo || null;

    if (online === 'local-only' || online === 'both' && localData) {
      return localData;
    }

    const fres = await Peers.each((pr) => pr.queryPostInfo(cid, pid));
    const publickey = await this.getPublicKey(cid, online);

    const result = fres.filter(verifyPostInfo.bind(null, publickey))[0] || null;
    if (result) {
      store.set(storepath, result);
    }

    return result;
  }

  /**
   * 获取文章列表，如果没有则从 p2p 中获取
   * TODO: 无法判断列表是否伪造
   * @param {String} cid 频道 id
   * @param {boolean} online 是否离线
   */
  public static async getPostList(cid: string, online: RequestType = 'both') {
    const storepath = ['postlist', cid].join('.');
    const localData = store.get(storepath) as IPostSummary[];

    if (online === 'local-only') {
      return localData;
    }

    const fres = await Peers.each((pr) => pr.queryPostList(cid));
    if (localData) {
      fres.push(localData);
    }
    const result = R.uniqBy(hash, R.flatten(fres.filter((c) => c !== null))) as IPostSummary[];
    result.sort((a, b) => a.pubtime - b.pubtime);
    store.set(storepath, result);

    return result;
  }

  /**
   * 添加文章，需要预验证
   */
  public static addPost(cid: string, post: IPostInfo) {
    const storepath = ['postinfo', cid, post.pid].join('.');
    store.set(storepath, post);
  }
}
