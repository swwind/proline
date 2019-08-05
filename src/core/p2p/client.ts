import axios from 'axios';
import { isIPv6 } from 'net';

export default (address: string, port: number) => {

  const baseURL = isIPv6(address)
    ? `http://[${address}]:${port}/api/v1`
    : `http://${address}:${port}/api/v1`; // domain or ipv4

  const axs = axios.create({
    baseURL,
    timeout: 4000,
    maxRedirects: 0,
    validateStatus: () => true,
  });

  return axs;
};
