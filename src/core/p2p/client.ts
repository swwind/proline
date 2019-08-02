import axios from 'axios';
import { isIPv6 } from 'net';
import { log } from 'electron-log';

export default (address: string, port: number) => {

  const baseURL = isIPv6(address)
    ? `http://[${address}]:${port}/api/v1`
    : `http://${address}:${port}/api/v1`; // domain or ipv4

  log('isipv6:', isIPv6(address));

  // TODO: ipv4
  const axs = axios.create({
    baseURL,
    timeout: 2000,
    maxRedirects: 0,
    validateStatus: () => true,
  });

  axs.interceptors.request.use((res) => {
    log(res.url);

    return res;
  }, (err) => {
    throw err;
  });

  return axs;
};