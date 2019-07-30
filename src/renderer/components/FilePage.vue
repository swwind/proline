<template>
  <div class="download">
    <div
      v-if="loading"
      class="loading"
      v-text="loading"
    />
    <div v-if="!loading && file">
      <h1 v-text="file.filename" />
      <div
        class="id"
        v-text="fid"
      />
      <div class="setsumei">
        State: {{ state }}
      </div>
      <video
        v-if="videourl"
        id="video"
        class="video"
        controls="controls"
        :src="videourl"
      />
      <button
        v-if="state === 'FINISHED'"
        @click="openFile()"
      >
        <i class="icon">open_in_new</i>
        View in File Manager
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as Files from '../core/posts/Files';
import { IFileInfo } from '../core/types';
import { shell } from 'electron';
import flvjs from 'flv.js';

export default Vue.extend({
  name: 'FilePage',
  data() {
    const { cid, fid } = this.$route.params;

    return {
      cid,
      fid,
      loading: 'Loading...',
      file: null as IFileInfo | null,
      filepath: '',
      state: '',
      videourl: false as string | boolean,
    };
  },
  async mounted() {
    const fileinfo = await Files.getFileInfo(this.cid, this.fid);
    if (!fileinfo) {
      this.loading = 'Error: File not found';

      return;
    }
    this.file = fileinfo;
    const filestate = await Files.getFileStatus(this.cid, this.fid);
    this.state = filestate;

    if (filestate !== 'NOTSTARTED') {
      this.filepath = Files.getFilePath(this.cid, this.fid) || '';
    }

    if (filestate === 'FINISHED') {
      if ((/\.mp4$/i).test(fileinfo.filename)) {
        this.videourl = `file://${this.filepath}`;
      }
      if ((/\.flv$/i).test(fileinfo.filename)) {
        this.videourl = true;
        setTimeout(() => {
          const videoElement = document.getElementById('video') as HTMLVideoElement;
          const flv = flvjs.createPlayer({
            type: 'flv',
            url: `file://${this.filepath}`,
          });
          flv.attachMediaElement(videoElement);
          flv.load();
        }, 0);
      }
    }

    this.loading = '';
  },
  methods: {
    openFile() {
      shell.showItemInFolder(this.filepath);
    }
  }
});
</script>

<style>
.video {
  width: 100%;
  max-width: 1000px;
  display: block;
  margin: 20px 0;
  border: none;
  outline: none;
}
</style>
