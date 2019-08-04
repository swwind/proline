<!-- 设置界面 -->

<template>
  <div class="settings incontainer">
    <h1>Settings (๑¯∀¯๑)</h1>
    <div class="block">
      <h3>Add new Peer</h3>
      <div class="setsumei">
        Specify peers you want to connect to.
      </div>
      <textarea
        v-model="expeer"
        @change="saveExpeer()"
      />
    </div>
    <div class="block">
      <h3>Theme</h3>
      <div class="label">
        <span>Dark theme</span>
        <input
          v-model="darktheme"
          class="input-checkbox"
          type="checkbox"
          @change="saveTheme()"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { main } from '../backend';
const { Config } = main;

export default Vue.extend({
  name: 'Settings',
  data() {
    return Config.getConfig();
  },
  methods: {
    saveTheme() {
      Config.changeTheme(this.darktheme);
    },
    saveExpeer() {
      Config.updatePeers(this.expeer);
    }
  }
});

</script>

<style lang="scss">
.settings {

  .block {
    padding: 20px 0;
    border-bottom: 2px solid var(--level-2-color);

    &:last-child {
      border-bottom: none;
    }

    .label {
      display: block;
      height: 30px;

      span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
        font-size: 18px;
      }

      .input-checkbox {
        float: right;
        margin-right: 20px;
      }
    }

    textarea {
      width: 100%;
      height: 200px;
      padding: 10px;
      font-size: 18px;
      resize: none;
      box-sizing: border-box;
      background-color: var(--level-3-color);
      border-radius: 5px;
      border: 2px solid var(--level-3-color);
      outline: none;
      transition: all .3s;
      color: var(--main-color);

      &:focus {
        border-color: var(--theme-color);
        background-color: var(--background-color);
      }
    }
  }
}

</style>
