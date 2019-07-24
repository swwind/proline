<!-- 显示所有频道 -->

<template>
  <div>
    <h1>My Channels (,,・ω・,,)</h1>
    <div class="loading" v-if="error" v-text="error"></div>
    <div v-if="!error && chans">
      <div class="main list">
        <div v-if="!chans.length" class="nothing">No channels</div>
        <router-link v-for="(chan, index) in chans" class="item" :key="index" :to="'/chan/' + chan.cid">
          <span class="chan-title" v-text="chan.cname"></span>
          <span class="right id" v-text="chan.cid"></span>
        </router-link>
      </div>
      <router-link to="/create-chan" class="radius-button">
        <i class="icon">add</i>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getCreatedChannelList, getChannelName } from '../../backend';
export default {
  name: 'publish-home',
  data() {
    return {
      error: 'Loading...',
      chans: null,
    }
  },
  async mounted() {
    const originChans = await getCreatedChannelList();
    if (!originChans) {
      this.error = 'An Error occurred';
      return;
    }
    const chans = originChans.map((cid) => ({
      cid, cname: getChannelName(cid)
    }));

    this.error = null;
    this.chans = chans;
  }
}
</script>

<style>

</style>
