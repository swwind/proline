<!-- 显示所有频道 -->

<template>
  <div>
    <h1>Channels</h1>
    <div class="loading" v-if="error" v-text="error"></div>
    <div v-if="!error && chans">
      <router-link to="/subscribe-chan" class="real-button">
        <i class="icon">add</i>
        Add Channel
      </router-link>
      <div class="main list">
        <div v-if="!chans.length" class="nothing">No channels subscribed</div>
        <router-link v-for="(chan, index) in chans" class="item" :key="index" :to="'/chan/' + chan.cid">
          <span class="chan-title" v-text="chan.title"></span>
          <!-- <span class="right" v-text="chan.newpost"></span> -->
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getSubscribedChannelList, getChannelName } from '../backend';
export default {
  name: 'main-page',
  data() {
    return {
      error: 'Loading...',
      chans: null,
    }
  },
  async mounted() {
    try {
      const cids = await getSubscribedChannelList();
      const chans = cids.map((cid) => {
        return {
          cid,
          cname: getChannelName(cid)
        }
      });
      this.error = null;
      this.chans = chans;
    } catch (e) {
      this.error = e.toString();
      console.error(e);
    }
  }
}
</script>

<style>

.time, .id {
  color: #666666;
}

</style>
