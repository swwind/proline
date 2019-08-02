import Peer from './Peer';
import log from 'electron-log';

const prs: Set<Peer> = new Set();
const map: Map<string, Peer> = new Map();

export const addPeer = (ip: string) => {
  log.log(`Add Peer???: ${ip}`);
  const peer = new Peer(ip, 25468);
  prs.add(peer);
  map.set(ip, peer);
};

export const removePeer = (ip: string) => {
  log.log(`Remove Peer: ${ip}`);
  const peer = map.get(ip);
  if (!peer) {
    return;
  }
  prs.delete(peer);
  map.delete(ip);
};

/**
 * 全部执行，忽略 ERROR
 */
export const each = <T>(fn: (pr: Peer) => Promise<T>) => {
  const ps = Array.from(prs).map((pr) => {
    return new Promise<T>((resolve) => {
      // resolve undefined if error
      fn(pr).then(resolve, () => resolve());
    });
  });

  return Promise.all(ps);
};

/**
 * 筛选出符合条件的 Peer
 */
export const filter = async (fn: (pr: Peer) => Promise<boolean>) => {
  const ps = await Promise.all(Array.from(prs).map(fn));

  return Array.from(prs).filter((_, index) => ps[index]);
};

/**
 * 获取拥有文件的 Peer
 */
export const haveFile = (cid: string, fid: string) => {
  return filter((pr) => pr.hasFile(cid, fid));
};

const prmap: Map<string, Set<string>> = new Map();

/**
 * 更新 Peer（从不同的源
 */
export const updatePeers = (partition: string, ips: string[]) => {
  const old = prmap.get(partition) || new Set();
  const ipset = new Set(ips);

  for (const ip of ipset) {
    if (!old.has(ip)) {
      // 新人
      addPeer(ip);
    }
  }
  for (const ip of old) {
    if (!ipset.has(ip)) {
      // 离开
      removePeer(ip);
    }
  }

  prmap.set(partition, ipset);
};

export const peerNumbers = () => {
  return prs.size;
};
