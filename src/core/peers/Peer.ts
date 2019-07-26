import { AxiosInstance } from 'axios';
import client from '../network/client';
import { IPostInfo, IPostSummary } from '../types';

export default class Peer {
  public ipv6: string;
  public port: number;
  public axios: AxiosInstance;

  public constructor(ipv6: string, port: number) {
    this.ipv6 = ipv6;
    this.port = port;

    this.axios = client(this.ipv6, this.port);
  }

  /**
   * 发送消息
   */
  public message(message: string) {
    return this.axios.post('/message', { message });
  }

  /**
   * 询问可供下载的文件列表
   */
  public async queryFileList() {
    return (await this.axios.get('/filelist')).data as { cid: string; fid: string }[];
  }

  /**
   * 询问频道内文章列表
   */
  public async queryPostList(cid: string) {
    return (await this.axios.get(`/postlist?cid=${cid}`)).data as IPostSummary[];
  }

  /**
   * 获取文章内容，没有验证签名
   */
  public async queryPostInfo(cid: string, pid: string) {
    return (await this.axios.get(`/postinfo?cid=${cid}&pid=${pid}`)).data as IPostInfo;
  }

  /**
   * 获取公钥，没有验证签名
   */
  public async queryPublicKey(cid: string) {
    return (await this.axios.get(`/publickey?cid=${cid}`)).data as string;
  }

  /**
   * 推送更新
   */
  public pushUpdate(cid: string, post: IPostInfo) {
    this.axios.post('/pushpost', { cid, post });
  }

}
