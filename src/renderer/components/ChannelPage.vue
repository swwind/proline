<template>
  <div class="chan">
    <h1 v-text="info.title"></h1>
    <div v-text="info.cid" class="id"></div>
    <div class="post list">
      <div v-if="!posts.length" class="nothing">No posts published</div>
      <router-link v-for="(post, index) in posts" class="item" :class="{ unread: !post.read }" :key="index"
          :to="'/post/' + info.cid + '/' + post.pubtime">
        <span class="title h3" v-text="post.title"></span>
        <span class="right" v-text="(new Date(post.pubtime)).toLocaleDateString()"></span>
        <div class="content" v-text="post.content"></div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getChannelInfo, getPostList } from '../backend';
export default {
  name: 'chan-page',
  data() {
    const cid = this.$route.params.cid;

    return {
      info: getChannelInfo(cid),
      posts: getPostList(cid)
    }
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
