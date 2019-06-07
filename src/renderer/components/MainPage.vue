<template>
  <div>
    <h1>Channels</h1>
    <div class="main list">
      <div v-if="!chans.length" class="nothing">No channels subscribed</div>
      <router-link v-for="(chan, index) in chans" class="item" :key="index" :to="'/chan/' + chan.chanid">
        <span class="chan-title" v-text="chan.title"></span>
        <span class="right" v-text="chan.newpost"></span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getChannelList } from '../backend';
export default {
  name: 'main-page',
  data() {
    return { chans: getChannelList() }
  }
}
</script>

<style>

.time, .id {
  color: #666666;
}

</style>
