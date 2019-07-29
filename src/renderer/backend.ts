// 与 src/main/backend.ts 进行交互

import axios from 'axios';
import Store from 'configstore';
import { IPostSummary, IPostInfo, ISignObject, IFileInfo } from '../core/types';

const store = new Store('proline-frontend', {
  cname: { }, // 频道名 [cid]
  read: { }, // 是否已经阅读 [cid][pid]
  publish: [ ], // 创建的频道 [cid]
  privatekey: { }, // 私钥 [cid]
});

const axs = axios.create({
  baseURL: 'http://[::1]:15884',
  maxRedirects: 0,
  validateStatus: () => true,
});

/**
 * 获取文章列表，会抛出异常
 * @param {string} cid 频道
 */
export const getPostList = async (cid: string): Promise<IPostSummary[]> => {
  const response = await axs.get('/postlist', { params: { cid } });

  if (response.status !== 200) {
    throw new Error(response.data);
  } else {
    return response.data;
  }
};

/**
 * 获取文章信息
 * @param {string} cid 频道
 * @param {string} pid 文章
 * @returns {IPostInfo} 结果
 */
export const getPostInfo = async (cid: string, pid: string): Promise<IPostInfo> => {
  const response = await axs.get('/postinfo', { params: { cid, pid } });

  if (response.status !== 200) {
    throw new Error(response.data);
  } else {
    return response.data;
  }
};

/**
 * 获取文件信息
 * @param {string} cid 频道
 * @param {string} fid 文章
 * @returns {IPostInfo} 结果
 */
export const getFileInfo = async (cid: string, fid: string): Promise<IFileInfo> => {
  const response = await axs.get('/fileinfo', { params: { cid, fid } });

  if (response.status !== 200) {
    throw new Error(response.data);
  } else {
    return response.data;
  }
};

type FileStatus = 'downloading' | 'not-started' | 'finished' | 'paused';

// 获取文章下载情况
export const getFileStatus = async (cid: string, fid: string): Promise<FileStatus> => {
  const response = await axs.get('/filestatus', { params: { cid, fid } });

  if (response.status !== 200) {
    throw new Error(response.data);
  } else {
    return response.data;
  }
};

// FIXME: 未完成的 API
export const getFileDownloadStatus = async (cid: string, fid: string): Promise<number> => {
  const response = await axs.get('/fileprogress', { params: { cid, fid } });

  if (response.status !== 200) {
    throw new Error(response.data);
  } else {
    return Number(response.data);
  }
};

// FIXME: 未完成的 API
export const downloadFile = async (cid: string, fid: string, path: string) => {
  const response = await axs.get('/download', { params: { cid, fid, path } });
  if (response.status !== 200) {
    throw new Error(response.data);
  }
};

// FIXME: 未完成的 API
export const stopDownloadFile = async (cid: string, fid: string) => {
  const response = await axs.get('/stop-download', { params: { cid, fid } });
  if (response.status !== 200) {
    throw new Error(response.data);
  }
};

// FIXME: 未完成的 API
export const continueDownloadFile = async (cid: string, fid: string) => {
  const response = await axs.get('/continue', { params: { cid, fid } });
  if (response.status !== 200) {
    throw new Error(response.data);
  }
};

/**
 * 订阅频道
 * @param {string} cid 频道
 */
export const subscribeChannel = async (cid: string, cname: string) => {
  store.set(`cname.${cid}`, cname);
  const response = await axs.get('/subscribe', { params: { cid } });

  if (response.status !== 200) {
    throw new Error(response.data);
  }
};

/**
 * 取消订阅频道，没有异常说明成功
 * @param {string} cid 频道
 */
export const unsubscribeChannel = async (cid: string) => {
  const response = await axs.get('/unsubscribe', { params: { cid } });

  if (response.status !== 200) {
    throw new Error(response.data);
  }
};

/**
 * 获取频道名称
 */
export const getChannelName = (cid: string): string => {
  return store.get(`cname.${cid}`) || 'Unnamed Channel';
};

/**
 * 获取文章阅读情况
 */
export const isPostRead = (cid: string, pid: string) => {
  return Boolean(store.get(`read.${cid}.${pid}`));
};

/**
 * 标记为已阅读
 */
export const markPostRead = (cid: string, pid: string) => {
  store.set(`read.${cid}.${pid}`, true);
};

/**
 * 获取订阅列表
 */
export const getSubscribedChannelList = async (): Promise<string[]> => {
  const response = await axs.get('/sublist');

  if (response.status !== 200) {
    throw new Error(response.data);
  } else {
    return response.data;
  }
};

export interface IKeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * 创建一对秘钥
 */
export const generateNewKey = async (): Promise<IKeyPair> => {
  const response = await axs.get('/generatekey');

  if (response.status !== 200) {
    throw new Error(response.data);
  } else {
    return response.data;
  }
};

/**
 * 获取发布频道列表
 */
export const getCreatedChannelList = (): string[] => {
  return store.get('publish');
};

/**
 * 注册公钥
 */
export const registerPublicKey = async (publicKey: string) => {
  const response = await axs.post('/regester-publickey', { publicKey });
  if (response.status !== 200) {
    throw new Error(response.data);
  }
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
export const getPrivateKey = (cid: string): string => {
  return store.get(`privatekey.${cid}`);
};

/**
 * 给东西签名
 */
export const signPost = async <T extends ISignObject> (post: T, privateKey: string): Promise<T> => {
  const response = await axs.post('/signpost', { post, privateKey });

  if (response.status !== 200) {
    throw new Error(response.data);
  } else {
    return response.data;
  }
};

/**
 * 发布文章
 */
export const publishPost = async (cid: string, post: IPostInfo) => {
  const response = await axs.post('/publish-post', { cid, post });

  if (response.status !== 200) {
    throw new Error(response.data);
  }
};

/**
 * 发布文件，需要本地文件的地址
 */
export const publishFile = async (cid: string, file: IFileInfo, path: string) => {
  const response = await axs.post('/publish-file', { cid, file, path });

  if (response.status !== 200) {
    throw new Error(response.data);
  }
};
