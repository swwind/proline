import Peer from './Peer';

/**
 * 集中管理 Peer
 */
export default class Peers {
  private static prs: Set<Peer> = new Set();

  public static addPeer(pr: Peer) {
    this.prs.add(pr);
  }

  public static removePeer(pr: Peer) {
    return this.prs.delete(pr);
  }

  /**
   * 全部执行
   */
  public static each<T>(fn: (pr: Peer) => Promise<T>) {
    const ps = Array.from(this.prs.values()).map((pr) => {
      return new Promise<T>((resolve) => {
        fn(pr).then(resolve, () => resolve());
      });
    });

    return Promise.all(ps);
  }

}
