<!-- 显示频道内的文章列表 -->

<template>
  <div>
    <h1>Subscribe New Channel (´,,•ω•,,)♡</h1>
    <div class="setsumei">
      You need to provide Channel ID(cid) so as to subscribe a channel. <br>
      Name cound be whatever you want.
    </div>
    <input
      v-model="cid"
      type="text"
      placeholder="Channel ID (cid)"
      class="input-text"
      :disabled="disable"
    >
    <input
      v-model="cname"
      type="text"
      placeholder="Channel Name"
      class="input-text"
      :disabled="disable"
    >
    <div
      class="error"
      v-text="error"
    />
    <button
      :disabled="disable"
      @click="addChannel()"
    >
      <i class="icon">add</i>
      Add Channel
    </button>
  </div>
</template>

<script lang="ts">
import { subscribeChannel, getSubscribedChannelList } from '../backend';
import Vue from 'vue';

export default Vue.extend({
  name: 'SubscribeChan',
  data() {
    return {
      error: '',
      cid: '',
      cname: '',
      disable: false,
    };
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
        }
        await subscribeChannel(cid, cname);
        // success
        window.location.href = `/#/chan/${cid}`;
      } catch (e) {
        this.error = e.message;
        this.disable = false;
        console.error(e);
      }
    }
  }
});
</script>

<style>
.error {
  color: red;
  height: 20px;
}
</style>
