// 管理文件操作 (+fid)

import Store from 'configstore';
import { promises as fs, constants as fsconst } from 'fs';
import path from 'path';
import * as R from 'ramda';
import { IFileInfo, RequestType } from '../types';
import Peers from '../peers/Peers';
import * as Channels from './Channels';
import { verifySignature, md5 } from '../encrypt';
import DiskWriter from '../utils/DiskWriter';
import Peer from '../peers/Peer';
import log from 'electron-log';

const store = new Store('proline-files', {
  filepath: { }, // 文件本地地址 [cid][fid]
  pieces: { }, // 下载片段情况 [cid][fid]: boolean[] | true
  fileinfo: { }, // 文件信息（种子） [cid][fid]
});

const sgetPieceStatus = (cid: string, fid: string): boolean[] | true | undefined => {
  return store.get(`pieces.${cid}.${fid}`);
};
const sgetFileInfo = (cid: string, fid: string): IFileInfo | undefined => {
  return store.get(`fileinfo.${cid}.${fid}`);
};
const sgetFilePath = (cid: string, fid: string): string | undefined => {
  return store.get(`filepath.${cid}.${fid}`);
};
const ssetPieceStatus = (cid: string, fid: string, data: boolean[] | true) => {
  return store.set(`pieces.${cid}.${fid}`, data);
};
const ssetFileInfo = (cid: string, fid: string, data: IFileInfo) => {
  return store.set(`fileinfo.${cid}.${fid}`, data);
};
const ssetFilePath = (cid: string, fid: string, data: string) => {
  return store.set(`filepath.${cid}.${fid}`, data);
};

/**
 * 发布文件
 */
export const publishFile = async (cid: string, fileinfo: IFileInfo, filepath: string) => {
  ssetFileInfo(cid, fileinfo.fid, fileinfo);
  ssetFilePath(cid, fileinfo.fid, filepath);
  ssetPieceStatus(cid, fileinfo.fid, true);
};

/**
 * 获取文章详细信息，如果没有则从 p2p 中获取。
 * @param {string} cid 频道 id
 * @param {string} fid 文章 id
 * @param {RequestType} online 获取方式
 * @returns {IFileInfo} 结果
 */
export const getFileInfo = async (cid: string, fid: string, online: RequestType = 'both') => {
  const localData = sgetFileInfo(cid, fid);

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
    ssetFileInfo(cid, fid, result);
  }

  return result;
};

/**
 * 是否完成
 */
export const finished = (cid: string, fid: string) => {
  const result = sgetPieceStatus(cid, fid);

  return result === true;
};

/**
 * 是否在下载中
 */
export const started = (cid: string, fid: string) => {
  const result = sgetPieceStatus(cid, fid);

  return Array.isArray(result);
};

/**
 * 文件是否可供下载
 */
export const hasFile = async (cid: string, fid: string) => {
  const filepath = sgetFilePath(cid, fid);

  if (!filepath) {
    return false;
  }

  try {
    await fs.access(filepath, fsconst.F_OK | fsconst.R_OK);
  } catch (e) {
    return false;
  }

  return true;
}

/**
 * 获取文件片段，应该检查过 hasFile
 */
export const getFilePiece = async (cid: string, fid: string, index: number) => {
  const filepath = sgetFilePath(cid, fid);
  const fileinfo = sgetFileInfo(cid, fid);
  const fh = await fs.open(filepath, 'r');
  const length = index === fileinfo.pieces.length - 1
    ? fileinfo.size - fileinfo.psize * index
    : fileinfo.psize;
  const buffer = Buffer.alloc(length);
  await fh.read(buffer, 0, length, fileinfo.psize * index);
  return buffer;
}

/**
 * 对某个 Peer 进行下载
 */
const download = async (cid: string, fid: string, pr: Peer, dw: DiskWriter) => {
  const status = sgetPieceStatus(cid, fid);
  const fileinfo = sgetFileInfo(cid, fid);
  if (status === true) {
    // finished
    return;
  }

  if (!fileinfo) {
    throw new Error('File info missing');
  }

  const lack = status
    .map((a, index): [boolean, number] => [a, index])
    .filter(([a, _]) => !a)
    .map(([_, i]) => i);

  if (!lack.length) {
    ssetPieceStatus(cid, fid, true);
    await dw.close();
    // TODO: Download finished
    return;
  }

  // 下载
  const piece = lack[Math.floor(Math.random() * lack.length)];
  try {
    const buffer = await pr.queryFilePiece(cid, fid, piece);
    if (finished(cid, fid)) {
      return;
    }
    if (md5(buffer).slice(0, 16) !== fileinfo.pieces[piece]) {
      throw new Error(`Piece failed hash check: ${cid}/${fid}[${piece}]`);
    }
    await dw.write(buffer, fileinfo.psize * piece);
  } catch (e) {
    log.error(`Error while downloading piece ${cid}/${fid}[${piece}]: ${e.message}`);
  }

  download(cid, fid, pr, dw);

}

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
  ssetFilePath(cid, fid, savepath);
  ssetPieceStatus(cid, fid, new Array(fileinfo.pieces.length).fill(false));

  const dw = new DiskWriter();
  await dw.open(savepath, fileinfo.size);

  const prs = await Peers.haveFile(cid, fid);
  prs.forEach((pr) => download(cid, fid, pr, dw));

  // TODO: flush peer

};
