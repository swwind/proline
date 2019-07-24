// 与 src/main/backend/index.js 进行交互

import axios from 'axios';
import Store from 'configstore';
const store = new Store('proline-frontend', {
  cname: { }, // Channel name
});

const axs = axios.create({
  baseURL: 'http://localhost:15884',
  maxRedirects: 0,
  validateStatus: () => true
});

/**
 * 获取文章列表
 * @param {string} cid 频道
 * @returns {[IPostSummary] | false} 结果
 */
export const getPostList = async (cid: string) => {
  const response = await axs.get('/postlist', { params: { cid } });

  return response.status === 200 && response.data;
};

/**
 * 获取文章信息
 * @param {string} cid 频道
 * @param {string} pid 文章
 * @returns {IPostInfo | false} 结果
 */
export const getPostInfo = async (cid: string, pid: string) => {
  const response = await axs.get('/postinfo', { params: { cid, pid } });

  return response.status === 200 && response.data;
};

/**
 * 订阅频道
 * @param {string} cid 频道
 * @returns {true | string} 成功或者异常
 */
export const subscribeChannel = async (cid: string, cname: string) => {
  store.set(`cname.${cid}`, cname);
  const response = await axs.get('/subscribe', { params: { cid } });

  return response.status === 200 || response.data as string;
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

export const getChannelName = (cid: string) => {
  return store.get(`cname.${cid}`) as string;
};

/**
 * 获取订阅列表
 * @returns {string[]} 一个列表
 */
export const getSubscribedChannelList = async () => {
  const response = await axs.get('/sublist');

  return response.status === 200 && response.data;
};
