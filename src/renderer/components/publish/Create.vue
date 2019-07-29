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
import Vue from 'vue';
import * as Encrypt from '../../core/encrypt';
import * as Channels from '../../core/posts/Channels';

export default Vue.extend({
  name: 'CreateChan',
  data() {
    return {
      error: '',
      cid: '',
      keypair: null as Encrypt.IKeyPair | null,
      cname: '',
    };
  },
  async mounted() {
    try {
      this.keypair = await Encrypt.generateKeyPair();
      this.cid = Encrypt.generateChannelID(Encrypt.key2string(this.keypair.publicKey));
    } catch (e) {
      this.error = e.message;
    }
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

        await Channels.registerPublicKey(Encrypt.key2string(this.keypair.publicKey));
        await Channels.registerPrivateKey(this.cid, Encrypt.key2string(this.keypair.privateKey));
        await Channels.subscribe(this.cid, this.cname);

        window.location.href = `/#/chan/${this.cid}`;
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
