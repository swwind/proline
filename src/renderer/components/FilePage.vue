<template>
  <div class="download">
    <h1 v-text="file.title"></h1>
    <div class="id" v-text="file.fid + '(from ' + chan.title + ')'"></div>

    <div class="progressbar">
      <span class="back-title">{{ toSize(file.downloaded) }} / {{ toSize(file.size) }}</span>
      <div class="progress" :style="'width:' + (file.downloaded / file.size * 100) + '%'">
        <span class="front-title">{{ toSize(file.downloaded) }} / {{ toSize(file.size) }}</span>
      </div>
    </div>

    <button @click="openFile(file.localpath)" v-if="file.downloaded === file.size">
      <i class="icon">open_in_new</i>
      View in file manager
    </button>
  </div>
</template>

<script>
import { getFileStatus, getChannelInfo } from '../backend';
import { toSize } from '../utils';
import { shell } from 'electron';
export default {
  name: 'file-page',
  data() {
    const { cid, fid } = this.$route.params;

    return { file: getFileStatus(cid, fid), chan: getChannelInfo(cid) };
  },
  methods: {
    toSize,
    openFile(path) {
      shell.showItemInFolder(path);
    }
  }
}
</script>

<style>
.progressbar {
  margin: 20px 0;
  border: 2px solid #1479f7;
  position: relative;
  height: 50px;
  border-radius: 5px;
}
.progressbar .back-title, .progressbar .front-title {
  font-size: 30px;
  line-height: 50px;
  margin-left: 10px;
  position: absolute;
  display: block;
  top: 0;
  left: 0;
}
.progressbar .back-title {
  color: #1479f7;
}
.progressbar .front-title {
  color: white;
  white-space: nowrap;
}
.progressbar .progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 50px;
  overflow: hidden;
  background-color: #1479f7;
}
</style>
