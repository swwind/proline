<!-- 创建频道 -->

<template>
  <div @drop="alert(233)">
    <h1>Write New Post (*´∀`)~♥</h1>
    <div v-if="error" v-text="error" class="error"></div>
    <div v-if="!error">
      <div class="small-setsumei">
        Please select a channel where to publish:
      </div>
      <select class="select">
        <option v-for="(chan, index) of chans" :value="chan.cid" v-text="chan.cname" :key="index"></option>
      </select>
      <div class="small-setsumei">
        Files:
      </div>
      <div class="fileupload" @click="selectFile()">
        Click To Open
      </div>
      <div class="small-setsumei">
        Click to remove
      </div>
      <div class="list">
        <div v-if="!files.length" class="nothing">No files</div>
        <div class="item" v-for="(file, index) in files"
            :key="index" @click="removeFile(file)">
          <span v-text="file.name"></span>
          <span v-text="file.size" class="right"></span>
        </div>
      </div>
      <div class="small-setsumei">
        Contents (Markdown only):
      </div>
      <div class="markdown-editor">
        <textarea v-model="content"></textarea>
        <div class="preview" v-html="marked(content)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCreatedChannelList, getChannelName } from '../../backend';
import marked from 'marked';
import { toReadableSize } from '../../utils';
import { remote } from 'electron';
import { promises as fs } from 'fs';
import { basename } from 'path';

export default {
  name: 'write-post',
  data() {
    return {
      error: '',
      chans: getCreatedChannelList().map((cid) => ({ cid, cname: getChannelName(cid) })),
      content: '# hello proline',
      files: [],
    }
  },
  methods: {
    async createChannel() {
      if (!this.chans.length) {
        this.error = 'Please create a channel first.';
      }
    },
    marked(text) {
      return marked(text, {
        sanitize: true
      });
    },
    addFile(file) {
      this.files.push({
        path: file.path,
        name: file.name,
        size: toReadableSize(file.size),
      })
    },
    async selectFile() {
      const filelist = remote.dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
      });
      if (!filelist) {
        return;
      }
      await Promise.all(filelist.map(async (path) => {
        const stat = await fs.lstat(path);
        this.addFile({
          path,
          name: basename(path),
          size: stat.size,
        });
      }));
    },
    removeFile(file) {
      const set = new Set(this.files);
      set.delete(file);
      this.files = Array.from(set);
    }
  }
}
</script>

<style>
.error {
  color: red;
}

.fileupload {
  height: 200px;
  line-height: 200px;
  text-align: center;
  font-size: 25px;
  border: 2px dashed #eeeeee;
  color: #666;
  cursor: pointer;
}
</style>
