<template>
  <div class="filepage incontainer">
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
          @click="startDownload()"
        >
          <i class="icon">arrow_downward</i>
          Download
        </button>
      </div>
      <div v-if="state === 'PAUSED'">
        <button @click="continueDownload()">
          <i class="icon">play_arrow</i>
          Continue
        </button>
      </div>
      <div v-if="state === 'DOWNLOADING'">
        <div class="progress">
          <div
            class="progress-bar"
            :style="{ width: (progress / file.pieces.length) * 100 + '%' }"
          >
            {{ progress }} / {{ file.pieces.length }}
          </div>
        </div>
        <button @click="pauseDownload()">
          <i class="icon">pause</i>
          Pause
        </button>
      </div>
      <div v-if="state === 'FINISHED'">
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
        <button @click="openFile()">
          <i class="icon">open_in_new</i>
          Open file
        </button>
        <button @click="viewFile()">
          <i class="icon">open_in_new</i>
          View in File Manager
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { main } from '../backend';
const { Files } = main;
import { IFileInfo, FileStatus } from '../../types';
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
      state: '' as FileStatus,
      videourl: false as string | boolean,
      imageurl: false,
      savepath: '',
      folder: 'Choose a folder...',
      downloadok: false,
      progress: 0, // 已经下载的 piece 数量
      intervalid: null as NodeJS.Timer | null,
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

    this.intervalid = setInterval(async () => {
      if (this.state === 'DOWNLOADING') {
        this.progress = await Files.getFileDownloadProgress(this.cid, this.fid);

        if (this.file && this.progress === this.file.pieces.length) {
          this.state = 'FINISHED';
        }
      }
    }, 1000);
    this.loading = '';
  },
  async destroyed() {
    if (this.intervalid) {
      clearInterval(this.intervalid);
    }
  },
  methods: {
    openFile() {
      shell.openItem(this.filepath);
    },
    viewFile() {
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
    startDownload() {
      Files.startDownload(this.cid, this.fid, this.folder);
      this.filepath = Files.getFilePath(this.cid, this.fid) || '';
      this.state = 'DOWNLOADING';
    },
    continueDownload() {
      Files.continueDownload(this.cid, this.fid);
      this.state = 'DOWNLOADING';
    },
    pauseDownload() {
      Files.pauseDownload(this.cid, this.fid);
      this.state = 'PAUSED';
    }
  }
});

</script>

<style lang="scss">

.filepage {
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

  .progress {
    display: block;
    border-radius: 5px;
    background-color: var(--level-3-color);
    height: 25px;

    .progress-bar {
      font-size: 18px;
      line-height: 25px;
      float: left;
      height: 100%;
      border-radius: 5px;
      text-align: center;
      background-color: var(--dark-green-color);
      white-space: nowrap;
      box-sizing: border-box;
      transition: width .3s;
    }
  }
}
</style>
