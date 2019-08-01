import { IFileInfo, IFileSummary } from '../types';

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

export const extractSummaryFromFileInfo = (fi: IFileInfo): IFileSummary => {
  return {
    fid: fi.fid,
    filename: fi.filename,
    size: fi.size,
  };
};

/**
 * Promise 排队
 */
export const queue = async <T> (ps: (() => Promise<T>)[], progress?: (now: number, all: number) => void) => {
  let now = 0;
  const length = ps.length;
  const next = async () => {
    if (progress) {
      progress(++now, length);
    }
    const first = ps.shift();
    const res: T[] = [];
    if (first) {
      res.push(await first());
      res.push(...await next());
    }

    return res;
  };

  return await next();
};
