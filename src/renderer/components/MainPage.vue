<!-- 显示所有频道 -->

<template>
  <div class="channels incontainer">
    <h1>Proline (ﾉ&gt;ω&lt;)ﾉ</h1>
    <div
      v-if="error"
      class="loading"
      v-text="error"
    />
    <div v-if="!error && chans">
      <div class="setsumei">
        Here are the channels you subscribed.
      </div>
      <div class="main list">
        <div
          v-if="!chans.length"
          class="nothing"
        >
          No channels subscribed
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
        to="/subscribe-chan"
        class="real-button"
      >
        <i class="icon">add</i>
        Subscribe Channel
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { main } from '../backend';
const { Channels } = main;
import Vue from 'vue';

interface IChannelSimpleInfo {
  cid: string;
  cname: string;
}

export default Vue.extend({
  name: 'MainPage',
  data() {
    return {
      error: 'Loading...',
      chans: [] as IChannelSimpleInfo[],
    };
  },
  async mounted() {
    try {
      const cids = Channels.getSubscribedList();
      const chans = cids.map((cid) => {
        return {
          cid,
          cname: Channels.getChannelName(cid)
        };
      });
      this.error = '';
      this.chans = chans;
    } catch (e) {
      this.error = e.toString();
      console.error(e);
    }
  }
});
</script>

<style lang="scss">

.channels {
  .time, .id {
    color: var(--level-2-color);
  }
}

</style>
