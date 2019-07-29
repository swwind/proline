<!-- 设置界面 -->

<template>
  <div class="settings">
    <h1>Settings (๑¯∀¯๑)</h1>
    <div class="block">
      <h3>Add new Peer</h3>
      <div class="setsumei">
        Specify a peer you want to connect to one by one.
      </div>
      <textarea
        v-model="expeer"
        @input="save('expeer')"
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
          @change="save('darktheme')"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Store from 'configstore';

interface IConfig {
  expeer: string;
  darktheme: boolean;
}

const deft: IConfig = {
  expeer: '',
  darktheme: false,
};

const store = new Store('proline-settings', deft);

export default Vue.extend({
  name: 'Settings',
  data() {
    return Object.assign(deft, store.all as IConfig);
  },
  async mounted() {
    // do nothing
  },
  methods: {
    save(name: string) {
      store.set(name, this[name]);

      if (name === 'expeer') {
        const fuck = this.expeer;
        
      }
    }
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
