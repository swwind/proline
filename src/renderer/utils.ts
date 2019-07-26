
import { promises as fs } from 'fs';
import { basename } from 'path';
import crypto from 'crypto';
import { IFileInfo } from '../core/types';

export const toReadableSize = (size) => {
  const b = size;
  const kb = b / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;
  const tb = gb / 1024;
  const pb = tb / 1024;

  if (pb > 0.9) {
    return `${pb.toFixed(2)} PB`;
  }
  if (tb > 0.9) {
    return `${tb.toFixed(2)} TB`;
  }
  if (gb > 0.9) {
    return `${gb.toFixed(2)} GB`;
  }
  if (mb > 0.9) {
    return `${mb.toFixed(2)} MB`;
  }
  if (kb > 0.9) {
    return `${kb.toFixed(2)} KB`;
  }

  return `${b} B`;
};

const piecehash = (buffer: Buffer) => {
  return crypto.createHash('md5').update(buffer)
    .digest('hex')
    .slice(0, 16);
};

/**
 * 解析文件作为种子
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
  const filename = basename(filepath);
  const fid = crypto.randomBytes(16).toString('hex');

  // 计算每一段的 hash
  const length = Math.floor((size - 1) / psize) + 1;
  const filebuffer = await fs.readFile(filepath);
  const pieces = await Promise.all(new Array(length).fill(0)
    .map(async (_, index) => {
      return piecehash(filebuffer.slice(index * psize, (index + 1) * psize));
    }));

  return {
    fid,
    filename,
    size,
    psize,
    pieces,
  };
};
