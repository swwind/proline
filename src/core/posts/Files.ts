// 管理文件操作 (+fid)

import Store from 'configstore';
import { promises as fs, constants as fsconst } from 'fs';
import path from 'path';
import * as R from 'ramda';
import { IFileInfo, RequestType, FileStatus } from '../../types';
import * as Peers from '../peers/Peers';
import * as Channels from './Channels';
import { verifySignature, randomBuffer, filePieceHash, string2pubkey } from '../../encrypt';
import DiskWriter from '../utils/DiskWriter';
import Peer from '../peers/Peer';
import log from 'electron-log';

const store = new Store('proline-files', {
  filepath: { }, // 文件本地地址 [cid][fid]
  pieces: { }, // 下载片段情况 [cid][fid]: boolean[] | true
  fileinfo: { }, // 文件信息（种子） [cid][fid]
});

/**
 * 保存正在下载的文件列表
 */
const downloadMap = new Map<string, DiskWriter>();

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
 * 发布文件，需要本地文件
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
export const getFileInfo = async (cid: string, fid: string, online: RequestType = 'both'): Promise<IFileInfo | undefined> => {
  const localData = sgetFileInfo(cid, fid);

  if (online === 'offline' || online === 'both' && localData) {
    return localData;
  }

  const fres = await Peers.each((pr) => pr.queryFileInfo(cid, fid));
  const publickey = string2pubkey(await Channels.getPublicKey(cid, online));
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
};

/**
 * 获取文件状态
 */
export const getFileStatus = async (cid: string, fid: string): Promise<FileStatus> => {
  if (finished(cid, fid) && await hasFile(cid, fid)) {
    return 'FINISHED';
  }
  if (downloadMap.has(cid + fid)) {
    return 'DOWNLOADING';
  }
  if (started(cid, fid)) {
    return 'PAUSED';
  }

  return 'NOTSTARTED';
};

/**
 * 获取文件下载进度
 */
export const getFileDownloadProgress = async (cid: string, fid: string) => {
  const fileState = await getFileStatus(cid, fid);
  const fileinfo = await getFileInfo(cid, fid);
  if (!fileinfo) {
    return 0;
  }
  if (fileState === 'FINISHED') {
    return fileinfo.pieces.length;
  }
  if (fileState === 'DOWNLOADING' || fileState === 'PAUSED') {
    const piece = await sgetPieceStatus(cid, fid);

    if (Array.isArray(piece)) {
      return R.sum(R.map(Number, piece));
    }

    return piece === true ? fileinfo.pieces.length : 0;
  }

  return 0;
};

/**
 * 获取文件片段，应该检查过 hasFile
 */
export const getFilePiece = async (cid: string, fid: string, index: number) => {
  const filepath = sgetFilePath(cid, fid);
  const fileinfo = sgetFileInfo(cid, fid);
  const piece = sgetPieceStatus(cid, fid);
  if (!filepath || !fileinfo || !piece) {
    throw new Error('Lack infomations');
  }

  if (Array.isArray(piece) && !piece[index]) {
    // 还没有下载到
    throw new Error('Piece Not Found');
  }

  const fh = await fs.open(filepath, 'r');
  const length = index === fileinfo.pieces.length - 1
    ? fileinfo.size - fileinfo.psize * index
    : fileinfo.psize;
  const buffer = Buffer.alloc(length);
  await fh.read(buffer, 0, length, fileinfo.psize * index);
  await fh.close();

  return buffer;
};

/**
 * 返回文件保存路径
 */
export const getFilePath = (cid: string, fid: string) => {
  return sgetFilePath(cid, fid);
};

/**
 * 对某个 Peer 进行下载
 */
const download = async (cid: string, fid: string, pr: Peer) => {
  const status = sgetPieceStatus(cid, fid);
  const fileinfo = sgetFileInfo(cid, fid);
  if (status === true || !downloadMap.has(cid + fid)) {
    return;
  }

  if (!fileinfo) {
    throw new Error('File info missing');
  }
  if (!status) {
    throw new Error('Piece state missing???');
  }

  const lack = status
    .map((a, index): [boolean, number] => [a, index])
    .filter(([a]) => !a)
    .map(([, i]) => i);

  if (!lack.length) {
    // 这里判断 finish 事件
    ssetPieceStatus(cid, fid, true);
    const dw = downloadMap.get(cid + fid);
    if (dw) {
      await dw.close();
      downloadMap.delete(cid + fid);
    }

    return;
  }

  // 下载
  const piece = lack[Math.floor(Math.random() * lack.length)];
  try {
    log.log(`Downloading piece ${piece} from ${pr.address}`);

    const buffer = await pr.queryFilePiece(cid, fid, piece);
    if (finished(cid, fid)) {
      return;
    }
    if (filePieceHash(buffer) !== fileinfo.pieces[piece]) {
      throw new Error(`Piece failed hash check: ${cid}/${fid}[${piece}]`);
    }
    const dw = downloadMap.get(cid + fid);
    if (!dw) {
      // task finished
      return;
    }
    await dw.write(buffer, fileinfo.psize * piece);
    const oldpiecestate = sgetPieceStatus(cid, fid) as boolean[];
    oldpiecestate[piece] = true;
    ssetPieceStatus(cid, fid, oldpiecestate);
  } catch (e) {
    log.error(`Error while downloading piece ${cid}/${fid}[${piece}]`);
    log.error(e);
  }

  download(cid, fid, pr);
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

  if (finished(cid, fid) && await hasFile(cid, fid)) {
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

  log.log(`${prs.length} peers is working...`);

  if (prs.length) {
    downloadMap.set(cid + fid, dw);
    prs.forEach((pr) => download(cid, fid, pr));
  } else {
    await dw.close();
  }

};

/**
 * 继续下载
 */
export const continueDownload = async (cid: string, fid: string) => {
  const filepath = sgetFilePath(cid, fid);
  const fileinfo = sgetFileInfo(cid, fid);

  if (!filepath || !fileinfo) {
    throw new Error('Unable to continue download: data not found');
  }

  const dw = new DiskWriter();
  await dw.open(filepath, fileinfo.size);
  const prs = await Peers.haveFile(cid, fid);

  log.log(`${prs.length} peers is working...`);

  if (prs.length) {
    downloadMap.set(cid + fid, dw);
    prs.forEach((pr) => download(cid, fid, pr));
  } else {
    await dw.close();
  }

};

/**
 * 暂停下载
 */
export const pauseDownload = async (cid: string, fid: string) => {
  const dw = downloadMap.get(cid + fid);
  if (dw) {
    await dw.close();
    downloadMap.delete(cid + fid);
  }
};

/**
 * 暂停下载
 */
export const pauseAllDownloads = async () => {
  for (const dw of downloadMap.values()) {
    await dw.close();
  }
  downloadMap.clear();
};

/**
 * 解析文件作为种子，没有签名
 */
export const parseFile = async (filepath): Promise<IFileInfo> => {
  const stat = await fs.lstat(filepath);
  if (!stat.isFile()) {
    throw new Error('Directory or SymbolicLink is not supported');
  }

  const size = stat.size;
  const psize = size > 1024 * 1024 * 1024
    ? 4 * 1024 * 1024 // 4MB   if > 1G
    : 256 * 1024; // 256KB if < 1G
  const filename = path.basename(filepath);
  const fid = randomBuffer(16);

  // 计算每一段的 hash
  const length = Math.floor((size - 1) / psize) + 1;
  const pieces = new Array(length);
  const fh = await fs.open(filepath, 'r');
  const fileBuffer = Buffer.alloc(psize);

  for (let index = 0; index < length - 1; ++index) {
    await fh.read(fileBuffer, 0, psize, psize * index);
    pieces[index] = filePieceHash(fileBuffer);
  }
  const lastlen = size - (length - 1) * psize;
  const lastBuffer = Buffer.alloc(lastlen);
  await fh.read(lastBuffer, 0, lastlen, (length - 1) * psize);
  pieces[length - 1] = filePieceHash(lastBuffer);

  await fh.close();

  return {
    fid,
    filename,
    size,
    psize,
    pieces,
    signature: '',
  };
};
