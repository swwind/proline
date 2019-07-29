import Peers from "./Peers";

const prmap: Map<string, Set<string>> = new Map();

export const updatePeers = (partition: string, ips: Set<string>) => {
  const old = prmap.get(partition) || new Set();

  for (const ip of ips) {
    if (!old.has(ip)) {
      // 新人
      Peers.addPeer(ip);
    }
  }
  for (const ip of old) {
    if (!ips.has(ip)) {
      // 离开
      Peers.removePeer(ip);
    }
  }

  prmap.set(partition, ips);
}
