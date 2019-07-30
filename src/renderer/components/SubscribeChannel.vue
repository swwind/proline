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
import * as Channels from '../core/posts/Channels';
import Vue from 'vue';
import * as R from 'ramda';

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
        const chanlist = Channels.getSubscribedList();
        if (R.contains(cid, chanlist)) {
          throw new Error('Channel Already Subscribed');
        }
        await Channels.subscribe(cid, cname);
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
  color: var(--red-color);
  height: 20px;
}
</style>
