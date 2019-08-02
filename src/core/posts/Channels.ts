// 管理频道和秘钥 (+cid)

import Store from 'configstore';
import * as R from 'ramda';
import { generateChannelID, verifyPublicKey } from '../../encrypt';
import { RequestType, IPostSummary } from '../../types';
import * as Peers from '../peers/Peers';
import ObjectHash from 'object-hash';

const store = new Store('proline-channel', {
  cname: { }, // 频道名 [cid]
  subscribed: [ ], // 订阅频道列表
  publish: [ ], // 创建的频道 [cid]
  publickey: { }, // 公钥
  privatekey: { }, // 私钥 [cid]
  postlist: { }, // 文章列表
});

/**
 * 注册公钥
 * @param {string} publickey 公钥
 */
export const registerPublicKey = (publickey: string) => {
  const cid = generateChannelID(publickey);
  store.set(`publickey.${cid}`, publickey);
};

/**
 * 获取公钥，如果没有则从 p2p 中获取。
 * @param {string} cid 频道 id
 * @param {RequestType} online 获取方式
 */
export const getPublicKey = async (cid: string, online: RequestType = 'both') => {
  const keystr = store.get(`publickey.${cid}`) as string | undefined;

  if (online === 'offline' || online === 'both' && keystr) {
    return keystr;
  }

  const fres = await Peers.each((pr) => pr.queryPublicKey(cid));

  const result = R.find(verifyPublicKey(cid), fres);
  if (result) {
    store.set(`publickey.${cid}`, result);
  }

  return result;
};

/**
 * 订阅列表
 */
export const getSubscribedList = (): string[] => {
  return store.get('subscribed');
};

/**
 * 订阅频道
 * @param {string} cid 频道 id
 */
export const subscribe = async (cid: string, cname: string) => {
  const publickey = await getPublicKey(cid);
  if (!publickey) {
    throw new Error('Failed to fetch public key');
  }

  const subscribed = getSubscribedList();
  const set = new Set(subscribed).add(cid);
  store.set('subscribed', Array.from(set));
  store.set(`cname.${cid}`, cname);
};

/**
 * 取消订阅
 * @param {string} cid 频道 id
 */
export const unsubscribe = async (cid: string) => {
  const subscribed = getSubscribedList();
  const set = new Set(subscribed);
  set.delete(cid);
  store.set('subscribed', Array.from(set));
};

/**
 * 是否订阅
 * @param {string} cid 频道 id
 */
export const subscribed = (cid: string) => {
  const subscribed: string[] = store.get('subscribed');

  return R.contains(cid, subscribed);
};

/**
 * 获取文章列表，如果没有则从 p2p 中获取
 * FIXME: 无法判断列表是否伪造
 * @param {String} cid 频道 id
 * @param {boolean} online 是否离线
 * @return {IPostSummary[]} 结果
 */
export const getPostList = async (cid: string, online: RequestType = 'both') => {
  const localData: IPostSummary[] = store.get(`postlist.${cid}`);

  if (online === 'offline') {
    return localData;
  }

  const fres = await Peers.each((pr) => pr.queryPostList(cid));
  fres.push(localData);
  const result: IPostSummary[] = R.uniqBy(ObjectHash, R.flatten(fres.filter(Boolean)));
  result.sort((a, b) => b.pubtime - a.pubtime);
  store.set(`postlist.${cid}`, result);

  return result;
};

/**
 * 修改文章列表
 * @param {string} cid 频道 id
 * @param {Function} fn 操作
 */
export const modifyPostList = (cid: string, fn: (t: IPostSummary[]) => IPostSummary[]) => {
  const data: IPostSummary[] = store.get(`postlist.${cid}`);
  const result = fn(data);
  store.set(`postlist.${cid}`, result);
};

/**
 * 获取频道名称
 */
export const getChannelName = (cid: string): string => {
  return store.get(`cname.${cid}`) || 'Unnamed Channel';
};

/**
 * 获取发布频道列表
 */
export const getCreatedChannelList = (): string[] => {
  return store.get('publish');
};

/**
 * 注册新的私钥
 */
export const registerPrivateKey = (cid: string, privateKey: string) => {
  store.set(`privatekey.${cid}`, privateKey);
  const publish = store.get('publish') as string[];
  publish.push(cid);
  store.set('publish', publish);
};

/**
 * 获取私钥
 */
export const getPrivateKey = (cid: string): string | undefined => {
  return store.get(`privatekey.${cid}`);
};
