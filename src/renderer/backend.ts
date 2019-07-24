// 与 src/main/backend/index.js 进行交互

import axios from 'axios';
import Store from 'configstore';
import { IPostSummary, IPostInfo } from '../core/types';

const store = new Store('proline-frontend', {
  cname: { }, // cname[cid]
  read: { }, // read[cid][pid]
  publish: [ ], // [cid]
  privatekey: { }, // privatekey[cid]
});

const axs = axios.create({
  baseURL: 'http://[::1]:15884',
  maxRedirects: 0,
  validateStatus: () => true,
});

/**
 * 获取文章列表
 * @param {string} cid 频道
 * @returns {[IPostSummary]} 结果
 */
export const getPostList = async (cid: string): Promise<IPostSummary[]> => {
  const response = await axs.get('/postlist', { params: { cid } });

  return response.status === 200 ? response.data : null;
};

/**
 * 获取文章信息
 * @param {string} cid 频道
 * @param {string} pid 文章
 * @returns {IPostInfo} 结果
 */
export const getPostInfo = async (cid: string, pid: string): Promise<IPostInfo> => {
  const response = await axs.get('/postinfo', { params: { cid, pid } });

  return response.status === 200 ? response.data : null;
};

/**
 * 订阅频道
 * @param {string} cid 频道
 * @returns {true | string} 成功或者异常
 */
export const subscribeChannel = async (cid: string, cname: string): Promise<string> => {
  store.set(`cname.${cid}`, cname);
  const response = await axs.get('/subscribe', { params: { cid } });

  return response.status === 200 ? null : response.data;
};

/**
 * 取消订阅频道
 * @param {string} cid 频道
 * @returns {boolean} 是否返回成功
 */
export const unsubscribeChannel = async (cid: string) => {
  const response = await axs.get('/unsubscribe', { params: { cid } });

  return response.status === 200;
};

/**
 * 获取频道名称
 */
export const getChannelName = (cid: string) => {
  return store.get(`cname.${cid}`) as string;
};

/**
 * 获取文章阅读情况
 */
export const isPostRead = (cid: string, pid: string) => {
  return store.get(`read.${cid}.${pid}`) as boolean;
};

/**
 * 标记为已阅读
 */
export const markPostRead = (cid: string, pid: string) => {
  return store.set(`read.${cid}.${pid}`, true);
};

/**
 * 获取订阅列表
 * @returns {string[]} 一个列表
 */
export const getSubscribedChannelList = async (): Promise<string> => {
  const response = await axs.get('/sublist');

  return response.status === 200 ? response.data : null;
};

declare interface IKeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * 创建一对秘钥
 */
export const generateNewKey = async (): Promise<IKeyPair> => {
  const response = await axs.get('/generatekey');

  return response.status === 200 ? response.data : null;
};

/**
 * 获取发布频道列表
 */
export const getCreatedChannelList = (): string[] => {
  return store.get('publish') as string[];
};

/**
 * 注册公钥
 */
export const registerPublicKey = async (publicKey: string) => {
  const response = await axs.post('/regester-publickey', { publicKey });

  return response.status === 200;
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
