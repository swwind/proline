// 文件信息，包含文件本身信息以及下载片段的信息
export interface IFileInfo {
  fid: string;
  filename: string;
  size: number; // 文件大小
  psize: number; // 每一片段的大小
  pieces: string[]; // 每一片段的哈希值
}

// 文章类型，包含内容以及文件
export interface IPostInfo {
  pid: string;
  title: string;
  pubtime: number; // 发布时间
  content: string; // 文章内容
  files: IFileInfo[]; // 文件
  signature: string; // 除了这个属性之外的所有属性进行 hash
}

// 文章简介
// TODO: 无法验证真伪
export interface IPostSummary {
  pid: string;
  title: string;
  pubtime: number;
}
