<!-- 显示文章内容 post info -->

<template>
  <div class="post">
    <h1 v-text="title"></h1>
    <div class="loading" v-if="error" v-text="error"></div>
    <div v-if="!error && post">
      <div v-text="(new Date(post.pubtime)).toLocaleDateString()" class="time"></div>
      <div class="content" v-text="post.content"></div>
      <h2>Files</h2>
      <div>TODO</div>
    </div>
  </div>
</template>

<script>
import { getPostInfo, markPostRead } from '../backend';

import Vue from 'vue';

export default Vue.extend({
  name: 'post-page',
  data() {
    const { cid, pid } = this.$route.params;
    return {
      error: 'Loading...',
      title: 'Fetching post infomations...',
      post: null,
    };
  },
  async mounted() {
    const { cid, pid } = this.$route.params;
    const post = await getPostInfo(cid, pid);
    if (!post) {
      this.error = null;
      this.title = 'There is nobody who can tell you anything about this post';
    } else {
      this.error = null;
      this.post = post;
      this.title = post.title;

      markPostRead(cid, pid);
    }
  }
});

</script>

<style>
.content {
  margin-bottom: 50px;
}
</style>
