<template>
  <div class="post">
    <h1 v-text="post.title"></h1>
    <div v-text="(new Date(post.pubtime)).toLocaleDateString()" class="time"></div>
    <div class="content" v-text="post.content"></div>

    <div class="space"></div>
    <h2>Files</h2>
    <div class="file list">
      <div v-if="!files.length" class="nothing">No files mounted</div>
      <router-link v-for="(file, index) in files" class="item" :key="index"
          :to="'/down/' + file.cid + '/' + file.fid">
        <span v-text="file.title"></span>
        <span v-if="file.started" title="Downloaded">[*]</span>
        <span v-text="toSize(file.size)" class="right"></span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getPostInfo, getFileStatus } from '../backend';
import { toSize } from '../utils';
export default {
  name: 'post-page',
  data() {
    const { cid, pubtime } = this.$route.params;
    const post = getPostInfo(cid, Number(pubtime));

    return { post, files: post.files.map(getFileStatus.bind(null, cid)) };
  },
  methods: { toSize }
}
</script>

<style>
.space {
  height: 100px;
}
</style>
