import * as Store from 'configstore';
import { IPostInfo, IPostSummary } from '../types';
import Peers from '../peers/Peers';
import { string2pubkey, verifyPostInfo, verifyPublicKey, generateChannelID } from '../encrypt';
import * as hash from 'object-hash';
import * as R from 'ramda';
import log from 'electron-log';

const store = new Store('proline-core', {
  postlist: { }, // postlist[cid]
  postinfo: { }, // postinfo[cid][pid]
  publickey: { }, // publickey[cid]
  subscribed: [] // [subscribed]
});

type RequestType = 'local-only' | 'online-only' | 'both';

/**
 * 管理文章以及秘钥
 * **注意：P2P 返回的结果可能是 null | undefined，一定要判断这种情况！！！**
 */
export default class Posts {

  /**
   * 获取公钥，如果没有则从 p2p 中获取。
   * @param {KeyObject} 公钥
   */
  public static async getPublicKey(cid: string, online: RequestType = 'both') {
    const keystr = store.get(`publickey.${cid}`) as string;

    if (online === 'local-only' || online === 'both' && keystr) {
      return keystr ? string2pubkey(keystr) : null;
    }

    const fres = await Peers.each((pr) => pr.queryPublicKey(cid));

    const result = fres.filter(verifyPublicKey.bind(null, cid))[0];
    if (result) {
      store.set(`publickey.${cid}`, result);
    }

    return result ? string2pubkey(result) : null;
  }

  /**
   * 获取文章详细信息，如果没有则从 p2p 中获取。
   * @param {boolean} online 是否离线
   * @returns {IPostInfo} 结果
   */
  public static async getPostInfo(cid: string, pid: string, online: RequestType = 'both') {
    const localData = store.get(`postinfo.${cid}.${pid}`) as IPostInfo || null;

    if (online === 'local-only' || online === 'both' && localData) {
      return localData;
    }

    log.log('Get Post Info Step[1]');
    const fres = await Peers.each((pr) => pr.queryPostInfo(cid, pid));
    log.log('Get Post Info Step[2]');
    const publickey = await this.getPublicKey(cid, online);
    log.log('Get Post Info Step[3]');

    const result = fres.filter(verifyPostInfo.bind(null, publickey))[0] || null;
    if (result) {
      store.set(`postinfo.${cid}.${pid}`, result);
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
    const localData = store.get(`postlist.${cid}`) as IPostSummary[];

    if (online === 'local-only') {
      return localData;
    }

    const fres = await Peers.each((pr) => pr.queryPostList(cid));
    if (localData) {
      fres.push(localData);
    }
    const result = R.uniqBy(hash, R.flatten(fres.filter(Boolean))) as IPostSummary[];
    result.sort((a, b) => a.pubtime - b.pubtime);
    store.set(`postlist.${cid}`, result);

    return result;
  }

  // ============= 以下不需要(直接)使用 P2P =============

  /**
   * 添加文章，需要预验证
   */
  public static addPost(cid: string, post: IPostInfo) {
    store.set(`postinfo.${cid}.${post.pid}`, post);

    // 保存到 summary 到 list

    const summary: IPostSummary = {
      pid: post.pid,
      title: post.title,
      pubtime: post.pubtime,
    };

    const list: IPostSummary[] = store.get(`postlist.${cid}`) || [];
    list.push(summary);
    store.set(`postlist.${cid}`, list);
  }

  /**
   * 注册公钥
   */
  public static registerPublicKey(publicKey: string) {
    const cid = generateChannelID(publicKey);
    store.set(`publickey.${cid}`, publicKey);
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
}
