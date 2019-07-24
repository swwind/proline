<!-- 显示频道内的文章列表 -->

<template>
  <div>
    <h1>Subscribe New Channel</h1>
    <input v-model="cid" type="text" placeholder="Channel ID (cid)" class="input-text">
    <input v-model="cname" type="text" placeholder="Channel Name" class="input-text">
    <div class="error" v-text="error"></div>
    <button @click="addChannel()">
      <i class="icon">add</i>
      Add Channel
    </button>
  </div>
</template>

<script>
import { subscribeChannel, getSubscribedChannelList } from '../backend';
export default {
  name: 'subscribe-chan',
  data() {
    return {
      error: '',
      cid: '',
      cname: '',
    }
  },
  methods: {
    async addChannel() {
      const cid = this.cid;
      const cname = this.cname;
      if (!cid || !cname) {
        this.error = 'Please fill in the blanks';
        return;
      }

      try {
        const chanlist = await getSubscribedChannelList();
        if (chanlist.indexOf(cid) > -1) {
          this.error = 'Channel Already Subscribed';
          return;
        }
        const success = await subscribeChannel(cid, cname);
        if (typeof success === 'string') {
          throw new Error(success);
        } else {
          // success
          window.location.href = '/#/';
        }
      } catch (e) {
        this.error = e.toString();
        console.error(e);
      }
    }
  }
}
</script>

<style>
.error {
  color: red;
}
</style>
