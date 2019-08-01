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
      <div v-if="state === 'NOTSTARTED'">
        <div
          class="input-text folder"
          @click="chooseFolder()"
          v-text="folder"
        />
        <button
          :disabled="!downloadok"
          @click="download()"
        >
          <i class="icon">arrow_downward</i>
          Download
        </button>
      </div>
      <video
        v-if="videourl"
        id="video"
        class="video"
        controls="controls"
        :src="videourl"
      />
      <img
        v-if="imageurl"
        class="image"
        :src="`file://${filepath}`"
      >
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
import { main } from '../backend';
const { Files } = main;
import { IFileInfo } from '../../both/types';
import { shell, remote } from 'electron';
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
      imageurl: false,
      savepath: '',
      folder: 'Choose a folder...',
      downloadok: false,
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
      if ((/\.(jpe?g|png|gif)$/i).test(fileinfo.filename)) {
        this.imageurl = true;
      }
    }

    this.loading = '';
  },
  methods: {
    openFile() {
      shell.showItemInFolder(this.filepath);
    },
    chooseFolder() {
      const result = remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
      if (result) {
        this.folder = result[0];
        this.downloadok = true;
      }
    },
    download() {
      Files.startDownload(this.cid, this.fid, this.folder);
    }
  }
});
</script>

<style>
.video, .image {
  width: 100%;
  max-width: 1000px;
  display: block;
  margin: 20px 0;
  border: none;
  outline: none;
}

.folder {
  cursor: pointer;
  user-select: none;
  color: var(--level-1-color);
}
</style>
