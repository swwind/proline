<!-- 显示所有频道 -->

<template>
  <div class="publish-home incontainer">
    <h1>My Channels (,,・ω・,,)</h1>
    <div
      v-if="error"
      class="loading"
      v-text="error"
    />
    <div v-if="!error && chans">
      <div class="setsumei">
        Here are the channels you created.
      </div>
      <div class="main list">
        <div
          v-if="!chans.length"
          class="nothing"
        >
          No channels
        </div>
        <router-link
          v-for="(chan, index) in chans"
          :key="index"
          class="item"
          :to="'/chan/' + chan.cid"
        >
          <span
            class="chan-title"
            v-text="chan.cname"
          />
          <span
            class="right id"
            v-text="chan.cid"
          />
        </router-link>
      </div>
      <router-link
        to="/create-chan"
        class="real-button"
      >
        <i class="icon">add</i>
        Create A New Channel
      </router-link>
      <router-link
        to="/write-post"
        class="real-button"
      >
        <i class="icon">create</i>
        Write A New Post
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { main } from '../../backend';
const { Channels } = main;
import Vue from 'vue';

interface ISimpleChannelInfo {
  cid: string;
  cname: string;
}

export default Vue.extend({
  name: 'PublishHome',
  data() {
    return {
      error: 'Loading...',
      chans: [] as ISimpleChannelInfo[],
    };
  },
  async mounted() {
    const originChans = Channels.getCreatedChannelList();
    if (!originChans) {
      this.error = 'An Error occurred';

      return;
    }
    const chans = originChans.map((cid) => ({
      cid, cname: Channels.getChannelName(cid)
    }));

    this.error = '';
    this.chans = chans;
  }
});
</script>

<style>

</style>
