import axios from 'axios';

export default (ipv6: string, port: number) => {

  // TODO: ipv4
  const axs = axios.create({
    baseURL: `http://${ipv6}:${port}/api/v1`,
    timeout: 1000,
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
