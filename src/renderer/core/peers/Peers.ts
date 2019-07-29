import Peer from './Peer';
import log from 'electron-log';

/**
 * 集中管理 Peer
 */
export default class Peers {
  private static prs: Set<Peer> = new Set();
  private static map: Map<string, Peer> = new Map();

  public static addPeer(ip: string) {
    log.log(`Add Peer: ${ip}`);
    const peer = new Peer(ip, 25468);
    this.prs.add(peer);
    this.map.set(ip, peer);
  }

  public static removePeer(ip: string) {
    log.log(`Remove Peer: ${ip}`);
    const peer = this.map.get(ip);
    if (!peer) {
      return;
    }
    this.prs.delete(peer);
    this.map.delete(ip);
  }

  /**
   * 全部执行，忽略 ERROR
   */
  public static each<T>(fn: (pr: Peer) => Promise<T>) {
    const ps = Array.from(this.prs).map((pr) => {
      return new Promise<T>((resolve) => {
        // resolve undefined if error
        fn(pr).then(resolve, () => resolve());
      });
    });

    return Promise.all(ps);
  }

  /**
   * 筛选出符合条件的 Peer
   */
  public static async filter(fn: (pr: Peer) => Promise<boolean>) {
    const ps = await Promise.all(Array.from(this.prs).map(fn));

    return Array.from(this.prs).filter((_, index) => ps[index]);
  }

  /**
   * 获取拥有文件的 Peer
   */
  public static haveFile(cid: string, fid: string) {
    return this.filter((pr) => pr.hasFile(cid, fid));
  }

  private static prmap: Map<string, Set<string>> = new Map();

  /**
   * 更新 Peer（从不同的源
   */
  public static updatePeers(partition: string, ips: Set<string>) {
    const old = this.prmap.get(partition) || new Set();

    for (const ip of ips) {
      if (!old.has(ip)) {
        // 新人
        this.addPeer(ip);
      }
    }
    for (const ip of old) {
      if (!ips.has(ip)) {
        // 离开
        this.removePeer(ip);
      }
    }

    this.prmap.set(partition, ips);
  }

}
