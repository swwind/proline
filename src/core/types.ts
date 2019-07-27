/**
 * 可签名物体
 */
export interface SignObject {
  signature: string;
}

/**
 * 文件信息，包含文件本身信息以及下载片段的信息
 */
export interface IFileInfo extends SignObject {
  fid: string;
  filename: string;
  size: number; // 文件大小
  psize: number; // 每一片段的大小
  pieces: string[]; // 每一片段的哈希值
}

/**
 * 文件的简介，只能用来展示数据，无法用来进行下载
 */
export interface IFileSummary {
  fid: string;
  filename: string;
  size: number;
}

/**
 * 文章类型，包含内容以及文件
 */
export interface IPostInfo extends SignObject {
  pid: string;
  title: string;
  pubtime: number; // 发布时间
  content: string; // 文章内容
  files: IFileSummary[]; // 文件
}

/**
 * 文章简介
 * TODO: 无法验证真伪
 */
export interface IPostSummary {
  pid: string;
  title: string;
  pubtime: number;
}

export type RequestType = 'offline' | 'online' | 'both';
