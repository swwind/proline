<!-- 显示频道内的文章列表 -->

<template>
  <div class="chan">
    <h1 v-text="title"></h1>
    <div class="loading" v-if="error" v-text="error"></div>
    <div v-if="!error && posts">
      <div v-text="cid" class="id"></div>
      <div class="post list">
        <div v-if="!posts.length" class="nothing">No posts published</div>
        <router-link v-for="(post, index) in posts" class="item" :class="{ unread: !post.read }" :key="index"
            :to="'/post/' + cid + '/' + post.pid">
          <span class="title h3" v-text="post.title"></span>
          <span class="right" v-text="(new Date(post.pubtime)).toLocaleDateString()"></span>
          <div class="content" v-text="post.content"></div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getPostList, getChannelName, isPostRead } from '../backend';
export default {
  name: 'chan-page',
  data() {
    const cid = this.$route.params.cid;
    return {
      cid,
      error: 'Loading...',
      title: getChannelName(cid),
      posts: null,
    }
  },
  async mounted() {
    const cid = this.$route.params.cid;
    const originPost = await getPostList(cid);
    if (!originPost) {
      this.error = 'An Error occurred';
      return;
    }

    const posts = originPost.map((post) => {
      return {
        ...post,
        read: isPostRead(cid, post.pid),
      }
    });

    this.error = null;
    this.posts = posts;
  }
}
</script>

<style>
.post .unread .title {
  font-weight: bold;
}
.post .content {
  margin-top: 20px;
}
</style>
