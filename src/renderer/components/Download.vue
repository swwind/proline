<template>
  <div class="download">
    <h1>Downloads</h1>
    <!-- <div class="list">
      <div v-if="!fs.length" class="nothing">No downloaded files</div>
      <router-link v-for="(file, index) in fs" class="item" :key="index"
          :to="'/down/' + file.cid + '/' + file.fid">
        <span class="progbar" :class="{ finished: file.downloaded === file.size }"
            :style="'width:' + (file.downloaded / file.size * 100) + '%;'"></span>
        <span class="title" v-text="file.title"></span>
        <span v-if="file.downloaded < file.size" class="right"
            v-text="toSize(file.downloaded) + ' / ' + toSize(file.size)"></span>
        <span v-if="file.downloaded === file.size" class="right"
            v-text="toSize(file.size)"></span>
      </router-link>
    </div> -->
  </div>
</template>

<script>
/*
import { getDownloadList } from '../backend';
import { toSize } from '../utils';
export default {
  name: 'download-page',
  data() {
    return { fs: getDownloadList() };
  },
  methods: { toSize }
}
*/
</script>

<style>
.progbar {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #e6ff18;
  z-index: -1;
  border-radius: 5px;
  transition: background-color .5s;
}
.progbar.finished {
  background-color: #13ff0f;
}
</style>
