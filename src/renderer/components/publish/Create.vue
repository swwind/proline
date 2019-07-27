<!-- 创建频道 -->

<template>
  <div>
    <h1>Create New Channel (๑• ω •๑)</h1>
    <div v-if="!keypair">
      Generating Key Pair...
    </div>
    <div v-if="keypair">
      New Channel ID: {{ cid }}
    </div>
    <input
      v-model="cname"
      type="text"
      placeholder="Channel Name"
      class="input-text"
    >
    <div
      class="error"
      v-text="error"
    />
    <button @click="createChannel()">
      <i class="icon">check</i>
      Create Channel
    </button>
  </div>
</template>

<script lang="ts">
import { subscribeChannel, generateNewKey, registerPublicKey, registerPrivateKey, IKeyPair } from '../../backend';
import md5 from 'md5';
import Vue from 'vue';

export default Vue.extend({
  name: 'CreateChan',
  data() {
    return {
      error: '',
      cid: '',
      keypair: null as IKeyPair | null,
      cname: '',
    };
  },
  async mounted() {
    const keypair = await generateNewKey();
    if (!keypair) {
      this.error = 'Failed to generate a random key pair';

      return;
    }
    this.keypair = keypair;
    this.cid = md5(Buffer.from(keypair.publicKey, 'hex'));
  },
  methods: {
    async createChannel() {
      try {
        if (!this.cname) {
          throw new Error('Please give your channel a name');
        }

        if (!this.keypair) {
          throw new Error('Please wait while key pair generated');
        }

        await registerPublicKey(this.keypair.publicKey);
        await registerPrivateKey(this.cid, this.keypair.privateKey);
        subscribeChannel(this.cid, this.cname);

        window.location.href = '/#/publish-home';
      } catch (e) {
        this.error = e.toString();
      }
    }
  }
});
</script>

<style>
.error {
  color: red;
}
</style>
