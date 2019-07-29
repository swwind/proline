// 保存文章内容以及文章的操作 (+pid)

import Store from 'configstore';
import { IPostInfo, IPostSummary, RequestType } from '../types';
import Peers from '../peers/Peers';
import { verifySignature } from '../encrypt';
import * as R from 'ramda';
import * as Channels from './Channels';

const store = new Store('proline-post', {
  postinfo: { }, // 文章内容
  read: { }, // 是否已经阅读 [cid][pid]
});

/**
 * 获取文章详细信息，如果没有则从 p2p 中获取。
 * @param {string} cid 频道 id
 * @param {string} pid 文章 id
 * @param {RequestType} online 获取方式
 * @returns {IPostInfo} 结果
 */
export const getPostInfo = async (cid: string, pid: string, online: RequestType = 'both'): Promise<IPostInfo | undefined> => {
  const localData: IPostInfo = store.get(`postinfo.${cid}.${pid}`);

  if (online === 'offline' || online === 'both' && localData) {
    return localData;
  }

  const fres = await Peers.each((pr) => pr.queryPostInfo(cid, pid));
  const publickey = await Channels.getPublicKey(cid, online);
  if (!publickey) {
    throw new Error('Public key not found');
  }

  const result = R.find(verifySignature(publickey), fres);
  if (result) {
    store.set(`postinfo.${cid}.${pid}`, result);
  }

  return result;
};


/**
 * 添加文章，自带验证
 * @param {string} cid 频道 id
 * @param {IPostInfo} post 文章 info
 */
export const addPost = async (cid: string, post: IPostInfo) => {
  const publickey = await Channels.getPublicKey(cid);
  if (!publickey) {
    throw new Error('Public key not found');
  }

  if (!verifySignature(publickey)(post)) {
    throw new Error('Failed verification');
  }

  store.set(`postinfo.${cid}.${post.pid}`, post);

  const summary: IPostSummary = {
    pid: post.pid,
    title: post.title,
    pubtime: post.pubtime,
  };

  Channels.modifyPostList(cid, (ps) => {
    ps.push(summary);

    return ps;
  });
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
