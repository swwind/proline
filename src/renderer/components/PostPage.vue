<!-- 显示文章内容 post info -->

<template>
  <div class="post incontainer">
    <h1 v-text="title" />
    <div
      v-if="error"
      class="loading"
      v-text="error"
    />
    <div v-if="!error && post">
      <div class="time">
        <span v-text="(new Date(post.pubtime)).toLocaleDateString()" />
      </div>
      <div
        class="content"
        v-html="marked(post.content)"
      />
      <h2>Files</h2>
      <div class="list">
        <div
          v-if="!post.files.length"
          class="nothing"
        >
          No files
        </div>
        <router-link
          v-for="(file, index) in post.files"
          :key="index"
          class="item"
          :title="file.fid"
          :to="`/file/${cid}/${file.fid}`"
        >
          <span v-text="file.filename" />
          <span
            class="right"
            v-text="toReadableSize(file.size)"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { main } from '../backend';
const { Posts } = main;
import marked from 'marked';
import { toReadableSize } from '../utils';

import Vue from 'vue';
import { IPostInfo } from '../../types';

export default Vue.extend({
  name: 'PostPage',
  data() {
    const { cid, pid } = this.$route.params;

    return {
      cid,
      pid,
      error: 'Loading...',
      title: 'Loading...',
      post: null as IPostInfo | null,
    };
  },
  async mounted() {
    const { cid, pid } = this.$route.params;
    const post = await Posts.getPostInfo(cid, pid);
    if (!post) {
      this.error = 'Please review this page a few moments later';
      this.title = 'Post not found';
    } else {
      this.error = '';
      this.post = post;
      this.title = post.title;

      Posts.markPostRead(cid, pid);
    }
  },
  methods: {
    marked(text) {
      return marked(text, {
        sanitize: true,
        silent: true,
      });
    },
    toReadableSize
  }
});

</script>

<style lang="scss">
.incontainer {
  .content {
    margin-bottom: 50px;
  }
}
</style>
