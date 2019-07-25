<!-- 显示频道内的文章列表 -->

<template>
  <div>
    <h1>Subscribe New Channel</h1>
    <div class="setsumei">
      You need to provide Channel ID(cid) so as to subscribe a channel.
      Name cound be whatever you want.
    </div>
    <input v-model="cid" type="text" placeholder="Channel ID (cid)" class="input-text" :disabled="disable">
    <input v-model="cname" type="text" placeholder="Channel Name" class="input-text" :disabled="disable">
    <div class="error" v-text="error"></div>
    <button @click="addChannel()" :disabled="disable">
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
      disable: false,
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

      this.error = 'Searching channel...';
      this.disable = true;

      try {
        const chanlist = await getSubscribedChannelList();
        if (chanlist.indexOf(cid) > -1) {
          throw new Error('Channel Already Subscribed');
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
        this.disable = false;
        console.error(e);
      }
    }
  }
}
</script>

<style>
.error {
  color: red;
  height: 20px;
}
</style>
