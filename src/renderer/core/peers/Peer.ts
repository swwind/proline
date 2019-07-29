import { AxiosInstance } from 'axios';
import client from '../p2p/client';
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
  public async message(message: string) {
    const response = await this.axios.post('/message', { message });

    if (response.status !== 200) {
      throw new Error(response.data);
    }
  }

  /**
   * 询问文件信息（种子）
   */
  public async queryFileInfo(cid: string, fid: string): Promise<IFileInfo> {
    const result = await this.axios.get('/fileinfo', { params: { cid, fid } });

    if (result.status === 200) {
      return result.data;
    }
    throw new Error(result.data);

  }

  /**
   * 询问频道内文章列表
   */
  public async queryPostList(cid: string): Promise<IPostSummary[]> {
    const result = await this.axios.get(`/postlist?cid=${cid}`);

    if (result.status === 200) {
      return result.data;
    }
    throw new Error(result.data);

  }

  /**
   * 获取文章内容，没有验证签名
   */
  public async queryPostInfo(cid: string, pid: string): Promise<IPostInfo> {
    const result = await this.axios.get(`/postinfo?cid=${cid}&pid=${pid}`);

    if (result.status === 200) {
      return result.data;
    }
    throw new Error(result.data);

  }

  /**
   * 获取公钥，没有验证签名
   */
  public async queryPublicKey(cid: string): Promise<string> {
    const result = await this.axios.get(`/publickey?cid=${cid}`);

    if (result.status === 200) {
      return result.data;
    }
    throw new Error(result.data);

  }

  /**
   * 推送更新
   */
  public async pushUpdate(cid: string, post: IPostInfo) {
    const response = await this.axios.post('/pushpost', { cid, post });

    if (response.status !== 200) {
      throw new Error(response.data);
    }
  }

  /**
   * 询问是否有文件，不抛出异常
   */
  public async hasFile(cid: string, fid: string) {
    const response = await this.axios.get('/hasfile', { params: { cid, fid } });

    return response.status === 200;
  }


  /**
   * 获取文件片段，不做检查
   */
  public async queryFilePiece(cid: string, fid: string, index: number): Promise<Buffer> {
    const result = await this.axios.get('/file-piece', { params: { cid, fid, index } });

    if (result.status === 200) {
      return result.data;
    }
    throw new Error(result.data);

  }

}
