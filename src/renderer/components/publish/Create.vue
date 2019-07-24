<!-- 创建频道 -->

<template>
  <div>
    <h1>Create New Channel (๑• ω •๑)</h1>
    <div v-if="!genkey">Generating Key Pair...</div>
    <div v-if="genkey">New Channel ID: {{ cid }}</div>
    <input v-model="cname" type="text" placeholder="Channel Name" class="input-text">
    <div class="error" v-text="error"></div>
    <button @click="createChannel()">
      <i class="icon">check</i>
      Create Channel
    </button>
  </div>
</template>

<script>
import { subscribeChannel, getSubscribedChannelList, generateNewKey, registerPublicKey, registerPrivateKey } from '../../backend';
import md5 from 'md5';

export default {
  name: 'create-chan',
  data() {
    return {
      error: '',
      genkey: false,
      cid: '',
      keypair: null,
      cname: '',
    }
  },
  async mounted() {
    const keypair = await generateNewKey();
    if (!keypair) {
      this.error = 'Failed to generate a random key pair';
      return;
    }
    this.keypair = keypair;
    this.genkey = true;
    this.cid = md5(Buffer.from(keypair.publicKey, 'hex'));
  },
  methods: {
    async createChannel() {
      if (!this.cname) {
        this.error = 'Please give your channel a name';
        return;
      }

      if (!this.genkey) {
        this.error = 'Please wait while key pair generated';
        return;
      }

      try {
        await registerPublicKey(this.keypair.publicKey);
        await registerPrivateKey(this.cid, this.keypair.privateKey);
        subscribeChannel(this.cid, this.cname);

        window.location.href = '/#/publish-home';
      } catch (e) {
        this.error = e.toString();
      }
    }
  }
}
</script>

<style>
.error {
  color: red;
}
</style>
