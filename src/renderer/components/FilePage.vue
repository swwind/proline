<template>
  <div class="download">
    <div
      v-if="loading"
      class="loading"
    >
      Loading...
    </div>
    <div v-if="!loading">
      <h1 v-text="file.filename" />
      <div
        class="id"
        v-text="fid"
      />
      <button>
        <i class="icon">open_in_new</i>
        View in File Manager
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getFileInfo } from '../backend';
import { IFileInfo } from '../../core/types';

export default Vue.extend({
  name: 'FilePage',
  data() {
    const { cid, fid } = this.$route.params;

    return {
      cid,
      fid,
      loading: true,
      file: null as IFileInfo | null,
      state: 'not-started',
    };
  },
  async mounted() {
    const fileinfo = await getFileInfo(this.cid, this.fid);
    this.file = fileinfo;
    this.loading = false;
  }
});
</script>

<style>
</style>
