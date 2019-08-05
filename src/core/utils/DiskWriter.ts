
import { promises as fs, constants } from 'fs';

interface ITask {
  buffer: Buffer;
  offset: number;
  resolve: Function;
  reject: Function;
}

export default class DiskWriter {

  public filepath: string;
  public tasklist: ITask[] = [];
  public fh: fs.FileHandle;
  public downloading: boolean = false;
  public closed = false;

  public async open(filepath: string, filesize: number) {
    this.filepath = filepath;
    try {
      await fs.access(filepath, constants.F_OK | constants.R_OK | constants.W_OK);
    } catch (e) {
      await fs.writeFile(filepath, Buffer.alloc(0));
    }
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
    if (this.closed) {
      task.reject(new Error('File closed'));

      return;
    }
    await this.fh.write(task.buffer, 0, task.buffer.length, task.offset);
    this.doWrite();
    task.resolve();
  }

  public async write(buffer: Buffer, offset: number) {
    return new Promise((resolve, reject) => {
      this.tasklist.push({ buffer, offset, resolve, reject });
      if (!this.downloading) {
        this.doWrite();
      }
    });
  }

  public async close() {
    if (!this.closed) {
      this.closed = true;
      await this.fh.close();
    }
  }

}
