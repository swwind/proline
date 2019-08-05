<template>
  <div
    id="app"
    :data-theme="theme"
  >
    <div class="container">
      <transition name="slide-fade">
        <router-view />
      </transition>
    </div>
    <div class="leftnav">
      <div class="buttonset">
        <router-link
          v-if="!goback"
          to="/"
          class="button"
          title="Home"
        >
          <i class="icon">home</i>
        </router-link>
        <router-link
          v-if="goback"
          :to="goback"
          class="button"
          title="Back"
        >
          <i class="icon">chevron_left</i>
        </router-link>
        <router-link
          to="/download"
          class="button"
          title="Downloads"
        >
          <i class="icon">cloud_download</i>
        </router-link>
        <router-link
          to="/publish"
          class="button"
          title="Publish"
        >
          <i class="icon">create</i>
        </router-link>
        <router-link
          to="/settings"
          class="button"
          title="Settings"
        >
          <i class="icon">settings</i>
        </router-link>
      </div>
      <div class="downinfo">
        <div
          class="connects"
          title="Connected Peers"
        >
          <i class="icon">link</i>
          {{ connect }}
        </div>
      </div>
    </div>
    <div class="start-animation" />
    <div class="logo">
      Proline
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { main } from './backend';
const { Config, Peers } = main;
import { Route } from 'vue-router';

export default Vue.extend({
  name: 'ProlineFrontend',
  data() {
    const config = Config.getConfig();

    return {
      theme: config.darktheme ? 'dark' : 'light',
      connect: 0,
      goback: '',
    };
  },
  async mounted() {
    Config.handleUpdate((config) => {
      this.theme = config.darktheme ? 'dark' : 'light';
    });

    const checkBack = (to: Route, from?: Route, next?: Function) => {
      if ((/^\/post\//i).test(to.path)) {
        this.goback = `/chan/${to.params.cid}`;
      } else if ((/^\/file\//i).test(to.path)) {
        this.goback = from ? from.path : '';
      } else {
        this.goback = '';
      }

      if (typeof next === 'function') {
        next();
      }
    };

    this.$router.beforeResolve(checkBack);
    checkBack(this.$router.currentRoute);

    setInterval(() => {
      this.connect = Peers.peerNumbers();
    }, 1000);
  }
});
</script>

<style lang="scss">

@import './css/theme.scss';
@import './css/common.scss';

.leftnav {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 75px;
  background-color: var(--sidebar-color);

  .buttonset {
    flex: 1;

    .button {
      display: block;
      height: 75px;
      width: 75px;
      text-align: center;
      transition: background-color .5s;
      color: var(--sidebar-item-color);

      .icon {
        font-size: 40px;
        line-height: 75px;
      }

      &:hover {
        background-color: var(--half-transparent);
      }
    }
  }

  .downinfo {
    color: var(--sidebar-item-color);
    margin: 5px 10px;
  }
}

#app {
  display: block;
  height: 100vh;
  width: 100vw;
  background-color: var(--background-color);
  color: var(--main-color);
  overflow: hidden;
}

@keyframes start-animation {
  to {
    width: 0px;
  }
}
@keyframes fade-out {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

.start-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--sidebar-color);
  transition: background-color 1s;
  animation: start-animation 1s;
  animation-delay: 1s;
  animation-fill-mode: forwards;
}

.logo {
  position: fixed;
  top: 50%;
  left: 0;
  margin-top: -50px;
  height: 100px;
  width: 100%;
  line-height: 100px;
  color: var(--sidebar-item-color);
  text-align: center;
  font-size: 100px;
  animation: fade-out 1s;
  animation-delay: 1s;
  animation-fill-mode: forwards;
}

.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}

.container {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  padding-left: 75px;
  box-sizing: border-box;

  .incontainer {
    margin: 25px;
  }
}


</style>
