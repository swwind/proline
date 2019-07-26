<!-- 创建频道 -->

<template>
  <div @drop="alert(233)">
    <h1>Write New Post (*´∀`)~♥</h1>
    <div v-text="cerror" class="error"></div>
    <div v-if="!cerror">
      <div class="small-setsumei">
        Select channel:
      </div>
      <select class="select" v-model="select">
        <option v-for="(chan, index) of chans" :value="chan.cid" v-text="chan.cname" :key="index"></option>
      </select>
      <input type="text" v-model="title" placeholder="Title" class="input-text">
      <div class="markdown-editor">
        <textarea v-model="content"></textarea>
        <div class="preview" v-html="marked(content)"></div>
      </div>
      <div class="fileupload" @click="selectFile()">
        Click To Open
      </div>
      <div class="list">
        <div v-if="!files.length" class="nothing">No files</div>
        <div class="item" v-for="(file, index) in files"
            :key="index" @click="removeFile(file)">
          <span v-text="file.name"></span>
          <span v-text="file.size" class="right"></span>
        </div>
      </div>
      <div class="error" v-text="perror"></div>
      <button :disabled="waiting" class="green" @click="applyPost()">
        <i class="icon">check</i>
        Publish
      </button>
    </div>
  </div>
</template>

<script>
import { getCreatedChannelList, getChannelName, getPrivateKey, signPost, publishPost } from '../../backend';
import marked from 'marked';
import { toReadableSize } from '../../utils';
import { remote } from 'electron';
import { promises as fs } from 'fs';
import { basename } from 'path';
import md5 from 'md5';
import axios from 'axios';

export default {
  name: 'write-post',
  data() {
    const chans = getCreatedChannelList().map((cid) => ({ cid, cname: getChannelName(cid) }));
    return {
      cerror: '', // error on channel
      perror: '', // error on publish
      chans,
      content: '# hello proline',
      files: [],
      waiting: false,
      select: chans[0] && chans[0].cid,
      title: '',
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
        sanitize: true,
        silent: true,
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
    },
    async applyPost() {
      this.waiting = true;

      const cid = this.select;
      const content = this.content;
      const title = this.title;

      if (!title) {
        this.perror = 'You must provide title.';
        this.waiting = false;
        return;
      }

      const pid = md5(new Date().toISOString());
      const privateKey = getPrivateKey(cid);

      if (!privateKey) {
        this.perror = 'Error: Private Key Not Found';
        this.waiting = false;
        return;
      }

      const post = await signPost({
        pid,
        title,
        content,
        files: [], // TODO: FILE
        pubtime: Date.now(),
        signature: '',
      }, privateKey);

      if (!post) {
        this.perror = 'Error: Failed Sign Post';
        this.waiting = false;
        return;
      }

      const success = await publishPost(cid, post);

      if (!success) {
        this.perror = `Error: Client Rejected Post: ${response.status}`;
        this.waiting = false;
        return;
      }

      this.waiting = false;
      window.location.href = `/#/post/${cid}/${pid}`;
    }
  }
}
</script>

<style lang="scss">
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


.markdown-editor {
  margin: 20px 0;
  height: 500px;
  border: 2px solid #eeeeee;
  border-radius: 5px;
  color: #333;
  display: flex;

  textarea, .preview {
    flex: 1;
    padding: 0 20px;
    overflow: auto;
  }

  textarea {
    border: none;
    resize: none;
    outline: none;
    background-color: #f6f6f6;
    font-size: 16px;
    font-family: 'Monaco', courier, monospace;
    padding: 20px;
  }
}
</style>
