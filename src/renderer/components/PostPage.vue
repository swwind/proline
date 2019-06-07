<template>
  <div class="post">
    <h1 v-text="post.title"></h1>
    <div v-text="(new Date(post.pubtime)).toLocaleDateString()" class="time"></div>
    <div class="content" v-text="post.content"></div>

    <div class="space"></div>
    <h2>Files</h2>
    <div class="file list">
      <div v-if="!post.files.length" class="nothing">No files mounted</div>
      <div v-for="(file, index) in post.files" class="item" :key="index">
        <span v-text="file.title"></span>
        <span v-text="toSize(file.size)" class="right"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { getPostInfo } from '../backend';
import { toSize } from '../utils';
export default {
  name: 'post-page',
  data() {
    const post = getPostInfo(this.$route.params.cid, Number(this.$route.params.pubtime));
    if (!post) {
      throw new Error(JSON.stringify(this.$route.params));
    }

    return { post };
  },
  methods: { toSize }
}
</script>

<style>
.space {
  height: 100px;
}
</style>
