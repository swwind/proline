// 管理文件操作 (+fid)

import Store from 'configstore';
import { promises as fs } from 'fs';
import path from 'path';
import * as R from 'ramda';
import { IFileInfo, RequestType } from '../types';
import Peers from '../peers/Peers';
import * as Channels from './Channels';
import { verifySignature } from '../encrypt';

const store = new Store('proline-files', {
  filepath: { }, // 文件本地地址 [cid][fid]
  pieces: { }, // 下载片段情况 [cid][fid]: boolean[] | true
  fileinfo: { }, // 文件信息（种子） [cid][fid]
});

export const publishFile = async (cid: string, fileinfo: IFileInfo, filepath: string) => {
  store.set(`fileinfo.${cid}.${fileinfo.fid}`, fileinfo);
  store.set(`filepath.${cid}.${fileinfo.fid}`, filepath);
};

/**
 * 获取文章详细信息，如果没有则从 p2p 中获取。
 * @param {string} cid 频道 id
 * @param {string} fid 文章 id
 * @param {RequestType} online 获取方式
 * @returns {IFileInfo} 结果
 */
export const getFileInfo = async (cid: string, fid: string, online: RequestType = 'both') => {
  const localData: IFileInfo = store.get(`fileinfo.${cid}.${fid}`);

  if (online === 'offline' || online === 'both' && localData) {
    return localData;
  }

  const fres = await Peers.each((pr) => pr.queryFileInfo(cid, fid));
  const publickey = await Channels.getPublicKey(cid, online);
  if (!publickey) {
    throw new Error('Public key not found');
  }

  const result = R.find(verifySignature(publickey), fres);
  if (result) {
    store.set(`fileinfo.${cid}.${fid}`, result);
  }

  return result;
};

/**
 * 是否完成
 */
export const finished = (cid: string, fid: string) => {
  const result = store.get(`pieces.${cid}.${fid}`);

  return result === true;
};

/**
 * 是否在下载中
 */
export const started = (cid: string, fid: string) => {
  const result = store.get(`pieces.${cid}.${fid}`);

  return Array.isArray(result);
};

/**
 * 创建空白文件
 */
const alloc = async (filepath: string, filesize: number) => {

  const handle = await fs.open(filepath, 'w');
  await handle.truncate(filesize);
  await handle.close();

};

/**
 * 开始下载文件。
 * 下载逻辑：选择 10 个受(うけ)，榨干(しぼり干す)他们，然后可以获得成就：榨汁姬（2333
 */
export const startDownload = async (cid: string, fid: string, savedir: string) => {
  const fileinfo = await getFileInfo(cid, fid);
  if (!fileinfo) {
    throw new Error('File info not found');
  }

  if (finished(cid, fid)) {
    throw new Error('Task finished');
  }

  if (started(cid, fid)) {
    throw new Error('Task already started, please use `continueDownload`');
  }

  const savepath = path.join(savedir, fileinfo.filename);
  store.set(`filepath.${cid}.${fid}`, savepath);

  await alloc(savepath, fileinfo.size);

  // TODO

};
