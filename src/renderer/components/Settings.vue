<!-- 设置界面 -->

<template>
  <div class="settings">
    <h1>Settings (๑¯∀¯๑)</h1>
    <div class="block">
      <h3>Add new Peer</h3>
      <div class="setsumei">Example: <code>http://10.176.20.251:23361</code></div>
      <textarea></textarea>
    </div>
    <div class="block"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Settings',
  data() {
    return {
    };
  },
  async mounted() {
    // do nothing
  },
  methods: {
  }
});

</script>

<style lang="scss">
.block {
  padding: 20px 0;
  border-bottom: 2px solid #eeeeee;

  &:last-child {
    border-bottom: none;
  }
}
textarea {
  width: 100%;
  height: 200px;
  padding: 10px;
  font-size: 18px;
  resize: none;
  box-sizing: border-box;
  background-color: #eeeeee;
  border-radius: 5px;
  border: 2px solid #eeeeee;
  outline: none;
  transition: all .3s;

  &:focus {
    border-color: #1479f7;
    background-color: white;
  }
}
</style>
