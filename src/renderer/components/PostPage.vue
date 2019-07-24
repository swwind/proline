<!-- 显示文章内容 post info -->

<template>
  <div class="post">
    <div class="loading" v-if="error" v-text="error"></div>
    <div v-if="!error && post">
      <h1 v-text="post.title"></h1>
      <div v-text="(new Date(post.pubtime)).toLocaleDateString()" class="time"></div>
      <div class="content" v-text="post.content"></div>
      <h2>Files</h2>
      <!-- <div class="file list">
        <div v-if="!files.length" class="nothing">No files mounted</div>
        <router-link v-for="(file, index) in files" class="item" :key="index"
            :to="'/down/' + file.cid + '/' + file.fid">
          <span v-text="file.title"></span>
          <span v-if="file.started" title="Downloaded">[*]</span>
          <span v-text="toReadableSize(file.size)" class="right"></span>
        </router-link>
      </div> -->
    </div>
  </div>
</template>

<script>
import { getPostInfo } from '../backend';
import { toReadableSize } from '../utils';

import Vue from 'vue';

export default Vue.extend({
  name: 'post-page',
  data() {
    const { cid, pid } = this.$route.params;
    getPostInfo(cid, pid).then((post) => {
      if (!post) {
        this.error = 'Failed to Load';
      } else {
        this.error = null;
        this.post = post;
      }
    });

    return {
      error: 'Loading...',
      post: null,
    };
  },
  methods: { toReadableSize }
});

</script>

<style>
.space {
  height: 100px;
}

.content {
  margin-bottom: 50px;
}
</style>
