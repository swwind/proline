
import { promises as fs } from 'fs';

interface ITask {
  buffer: Buffer;
  offset: number;
  resolve: Function;
}

export default class DiskWriter {

  public filepath: string;
  public tasklist: ITask[] = [];
  public fh: fs.FileHandle;
  public downloading: boolean = false;

  public async open(filepath: string, filesize: number) {
    this.filepath = filepath;
    this.fh = await fs.open(filepath, 'r+');
    // 调整大小，不会删除现有的
    await this.fh.truncate(filesize);
  }

  private async doWrite() {
    this.downloading = true;
    const task = this.tasklist.shift();
    if (!task) {
      this.downloading = false;

      return;
    }

    await this.fh.write(task.buffer, 0, task.buffer.length, task.offset);
    task.resolve();
    this.doWrite();
  }

  public async write(buffer: Buffer, offset: number) {
    return new Promise((resolve) => {
      this.tasklist.push({ buffer, offset, resolve });
      if (!this.downloading) {
        this.doWrite();
      }
    });
  }

  public async close() {
    await this.fh.close();
  }

}
