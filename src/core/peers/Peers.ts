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
   * 全部执行
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

  public static updateIPs(ips: Set<string>) {
    for (const ip of ips) {
      if (!this.map.has(ip)) {
        // 新人
        this.addPeer(ip);
      }
    }
    for (const ip of this.map.keys()) {
      if (!ips.has(ip)) {
        // 离开
        this.removePeer(ip);
      }
    }
  }

}
