import { AxiosInstance } from 'axios';
import client from '../network/client';
import { IPostInfo, IPostSummary, IFileInfo } from '../types';

// TODO: 记录回复，推测订阅的和没有订阅的

export default class Peer {
  public address: string;
  public port: number;
  public axios: AxiosInstance;

  public constructor(address: string, port: number) {
    this.address = address;
    this.port = port;

    this.axios = client(this.address, this.port);
  }

  /**
   * 发送消息
   */
  public message(message: string) {
    return this.axios.post('/message', { message });
  }

  /**
   * 询问文件信息（种子）
   */
  public async queryFileInfo(cid: string, fid: string): Promise<IFileInfo> {
    const result = await this.axios.get('/fileinfo', { params: { cid, fid } });

    return result.data;
  }

  /**
   * 询问频道内文章列表
   */
  public async queryPostList(cid: string): Promise<IPostSummary[]> {
    const result = await this.axios.get(`/postlist?cid=${cid}`);

    return result.data;
  }

  /**
   * 获取文章内容，没有验证签名
   */
  public async queryPostInfo(cid: string, pid: string): Promise<IPostInfo> {
    const result = await this.axios.get(`/postinfo?cid=${cid}&pid=${pid}`);

    return result.data;
  }

  /**
   * 获取公钥，没有验证签名
   */
  public async queryPublicKey(cid: string): Promise<string> {
    const result = await this.axios.get(`/publickey?cid=${cid}`);

    return result.data;
  }

  /**
   * 推送更新
   */
  public pushUpdate(cid: string, post: IPostInfo) {
    return this.axios.post('/pushpost', { cid, post });
  }

}
