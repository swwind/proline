<!-- 创建频道 -->

<template>
  <div class="create-channel incontainer">
    <h1>Write New Post (*´∀`)~♥</h1>
    <div
      v-if="cerror"
    >
      <div
        class="error"
        v-text="cerror"
      />
      <router-link
        to="/create-chan"
        class="real-button"
      >
        <i class="icon">add</i>
        Create A New Channel
      </router-link>
    </div>
    <div v-if="!cerror">
      <div class="small-setsumei">
        Select channel:
      </div>
      <select
        v-model="select"
        class="select"
      >
        <option
          v-for="(chan, index) of chans"
          :key="index"
          :value="chan.cid"
          v-text="chan.cname"
        />
      </select>
      <input
        v-model="title"
        type="text"
        placeholder="Title"
        class="input-text"
      >
      <div class="markdown-editor">
        <textarea v-model="content" />
        <div
          class="preview"
          v-html="marked(content)"
        />
      </div>
      <div
        class="fileupload"
        @click="selectFile()"
        @drop="handleDrop($event)"
      >
        Click To Open / Drop Files Here
      </div>
      <div class="list">
        <div
          v-if="!files.length"
          class="nothing"
        >
          No files
        </div>
        <div
          v-for="(file, index) in files"
          :key="index"
          class="item"
          @click="removeFile(file)"
        >
          <span v-text="file.name" />
          <span
            class="right"
            v-text="toReadableSize(file.size)"
          />
        </div>
      </div>
      <div
        class="error"
        v-text="perror"
      />
      <button
        :disabled="waiting"
        class="green"
        @click="applyPost()"
      >
        <i class="icon">check</i>
        Publish
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import * as Encrypt from '../../../encrypt';
import { main } from '../../backend';
const { Channels, Posts, Files } = main;

import marked from 'marked';
import { toReadableSize, extractSummaryFromFileInfo, queue } from '../../utils';
import { remote } from 'electron';
import { promises as fs } from 'fs';
import { basename } from 'path';
import Vue from 'vue';

interface ISimpleFileSummary {
  name: string;
  path: string;
  size: number;
}

export default Vue.extend({
  name: 'WritePost',
  data() {
    const chans = Channels.getCreatedChannelList()
      .map((cid) => ({ cid, cname: Channels.getChannelName(cid) }));

    return {
      cerror: chans.length
        ? ''
        : 'Please create a channel first.', // error on channel
      perror: '', // error on publish
      chans,
      content: '# hello proline\n\n**Markdown** is supported',
      files: [] as ISimpleFileSummary[],
      waiting: false,
      select: chans[0] && chans[0].cid,
      title: '',
    };
  },
  methods: {
    toReadableSize,
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
        size: file.size,
      });
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
    removeFile(file: ISimpleFileSummary) {
      const set = new Set(this.files);
      set.delete(file);
      this.files = Array.from(set);
    },
    // prepare to publish
    async applyPost() {
      this.waiting = true;

      try {

        const cid = this.select;
        const content = this.content;
        const title = this.title;

        if (!title) {
          throw new Error('You must provide title.');
        }

        const pid = Encrypt.randomBuffer(16);
        const privateKey = Encrypt.string2prvkey(Channels.getPrivateKey(cid));

        if (!privateKey) {
          throw new Error('Private key not found');
        }

        this.perror = 'Processing files, please wait...';

        const fileinfos = await queue(this.files.map((file) => async () => {
          const fileinfo = Encrypt.signObject(privateKey, await Files.parseFile(file.path));
          await Files.publishFile(cid, fileinfo, file.path);

          return fileinfo;
        }), (now, all) => {
          this.perror = `Processing files (${now}/${all})`;
        });

        const files = fileinfos.map(extractSummaryFromFileInfo);

        const postinfo = Encrypt.signObject(privateKey, {
          pid,
          title,
          content,
          files,
          pubtime: Date.now(),
          signature: '',
        });

        await Posts.addPost(cid, postinfo);

        // 跳转到文章页面
        this.$router.push({ path: `/post/${cid}/${pid}` });
      } catch (e) {
        this.perror = e.message;
        this.waiting = false;
      }

    },

    // 处理 drop 事件
    handleDrop(e: DragEvent) {
      e.preventDefault();
      if (!e.dataTransfer) {
        return;
      }
      if (e.dataTransfer.items) {
        Array.from(e.dataTransfer.items)
          .filter((item) => item.kind === 'file')
          .map((item) => item.getAsFile())
          .map(this.addFile.bind(this));
      } else {
        Array.from(e.dataTransfer.files)
          .map(this.addFile.bind(this));
      }
    },

    alert() {
      // do nothing...
      // it's a vue bug...???
    }
  }
});
</script>

<style lang="scss">

.create-channel {
  .error {
    color: var(--red-color);
    margin: 20px 0;
  }

  .fileupload {
    height: 200px;
    line-height: 200px;
    text-align: center;
    font-size: 25px;
    border: 2px dashed var(--level-2-color);
    color: var(--level-2-color);
    cursor: pointer;
    border-radius: 5px;
  }


  .markdown-editor {
    margin: 20px 0;
    height: 500px;
    border: 2px solid var(--level-3-color);
    border-radius: 5px;
    color: var(--main-color);
    display: flex;

    textarea, .preview {
      flex: 1;
      padding: 0 20px;
      overflow: auto;
    }

    textarea {
      color: var(--main-color);
      border: none;
      resize: none;
      outline: none;
      background-color: var(--level-3-color);
      font-size: 16px;
      font-family: 'Monaco', courier, monospace;
      padding: 20px;
    }
  }
}
</style>
