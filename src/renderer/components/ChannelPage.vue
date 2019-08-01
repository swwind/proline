<!-- 显示频道内的文章列表 -->

<template>
  <div class="chan">
    <h1 v-text="title" />
    <div
      v-if="error"
      class="loading"
      v-text="error"
    />
    <div v-if="!error && posts">
      <div
        class="id"
        v-text="cid"
      />
      <div class="post list">
        <div
          v-if="!posts.length"
          class="nothing"
        >
          No posts published
        </div>
        <router-link
          v-for="(post, index) in posts"
          :key="index"
          class="item"
          :class="{ unread: !post.read }"
          :to="'/post/' + cid + '/' + post.pid"
        >
          <span
            class="title h3"
            v-text="post.title"
          />
          <span
            class="right"
            v-text="(new Date(post.pubtime)).toLocaleDateString()"
          />
          <div
            class="content"
            v-text="post.content"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { main } from '../backend';
const { Channels, Posts } = main;
import Vue from 'vue';

interface IPostSimpleInfo {
  read: boolean;
  pid: string;
  title: string;
  pubtime: number;
}

export default Vue.extend({
  name: 'ChanPage',
  data() {
    const cid = this.$route.params.cid;

    return {
      cid,
      error: 'Loading...',
      title: Channels.getChannelName(cid),
      posts: [] as IPostSimpleInfo[],
    };
  },
  async mounted() {
    const cid = this.$route.params.cid;
    const originPost = await Channels.getPostList(cid);
    if (!originPost) {
      this.error = 'An Error occurred';

      return;
    }

    const posts = originPost.map((post) => {
      return {
        ...post,
        read: Posts.isPostRead(cid, post.pid),
      };
    });

    this.error = '';
    this.posts = posts;
  }
});
</script>

<style>
.post .unread .title {
  font-weight: bold;
}
.post .content {
  margin-top: 20px;
}
</style>
