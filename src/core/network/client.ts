import axios from 'axios';
import { isIPv6 } from 'net';

export default (address: string, port: number) => {

  const baseURL = isIPv6(address)
    ? `http://[${address}]:${port}/api/v1`
    : `http://${address}:${port}/api/v1`; // domain or ipv4

  // TODO: ipv4
  const axs = axios.create({
    baseURL,
    timeout: 2000,
    maxRedirects: 0,
    validateStatus(status) {
      return status === 200;
    }
  });

  // 下面的真的需要吗？
  // let token = '';
  // axs.interceptors.request.use((config) => {
  // if (token) {
  // if (!config.headers) {
  // config.headers = {};
  // }
  // config.headers['Authorization'] = token;
  // }
  // return config;
  // });
  return axs;
};
