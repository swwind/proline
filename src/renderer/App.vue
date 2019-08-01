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
      <router-link
        to="/"
        class="button"
        title="Home"
      >
        <i class="icon">home</i>
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
    <div class="start-animation" />
    <div class="logo">
      Proline
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { main } from './backend';
const { Config } = main;

export default Vue.extend({
  name: 'ProlineFrontend',
  data() {
    const config = Config.getConfig();

    return {
      theme: config.darktheme ? 'dark' : 'light',
    };
  },
  async mounted() {
    Config.handleUpdate((config) => {
      this.theme = config.darktheme ? 'dark' : 'light';
    });
  }
});
</script>

<style lang="scss">

@import url('./css/theme.scss');

body, html {
  margin: 0;
  padding: 0;
  font-family: 'WenQuanYi Micro Hei', 'WenQuanYi Zen Hei', 'Microsoft Yahei', sans-serif;
}

.leftnav .button {
  display: block;
  height: 75px;
  width: 75px;
  text-align: center;
  color: var(--sidebar-item-color);
  transition: background-color .5s;

  .icon {
    font-size: 40px;
    line-height: 75px;
  }

  &:hover {
    background-color: var(--half-transparent);
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

h1, h2, h3, .h1, .h2, .h3 {
  font-weight: normal;
}
h1, .h1 {
  font-size: 36px;
}
h2, .h2 {
  font-size: 30px;
}
h3, .h3 {
  font-size: 24px;
}

.leftnav {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 75px;
  background-color: var(--sidebar-color);
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

  padding: 25px;
  padding-left: 100px;
  box-sizing: border-box;
}

.list {
  margin: 50px 0;

  .nothing, .loading {
    text-align: center;
    color: var(--level-2-color);
  }

  .item {
    display: block;
    color: var(--main-color);
    text-decoration: none;
    padding: 20px;
    transition: background-color .2s;
    cursor: pointer;
    position: relative;
    margin-bottom: 5px;
    border-radius: 5px;

    &:hover {
      background-color: var(--level-3-color);
    }
  }

  .right {
    float: right;
  }
}

button, .real-button, .radius-button, .select {
  background-color: var(--level-3-color);
  padding: 10px 20px;
  border-radius: 5px;
  border: 2px solid var(--level-3-color);
  outline: none;
  display: inline-block;
  transition: all .3s, transform .1s;
  cursor: pointer;
  font-size: 18px;
  margin: 10px 20px 10px 0;
  text-decoration: none;
  color: var(--main-color);

  &:hover {
    color: var(--main-color);
    background-color: var(--background-color);
    border: 2px solid var(--theme-color);
  }

  &:focus {
    border: 2px solid var(--theme-color);
  }

  &:active {
    transform: translateY(3px);
  }

  &:disabled {
    color: var(--disable-color);
    border: 2px solid var(--level-3-color);
    background-color: var(--level-3-color);
    cursor: not-allowed;
  }

  &.green {
    color: var(--background-color);
    background-color: var(--green-color);
    border-color: var(--green-color);

    &:hover, &:focus {
      background-color: var(--level-3-color);
      color: var(--green-color);
    }
  }

  &.red {
    color: var(--background-color);
    background-color: var(--red-color);
    border-color: var(--red-color);

    &:hover, &:focus {
      background-color: var(--level-3-color);
      color: var(--red-color);
    }
  }

  &.green, &.red {
    &:disabled {
      color: var(--disable-color);
      border: 2px solid var(--level-3-color);
      background-color: var(--level-3-color);
      cursor: not-allowed;
    }
  }
}

.radius-button {
  padding: 10px;
  border-radius: 50%;
}

.input-text {
  display: block;
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid var(--level-3-color);
  outline: none;
  width: 100%;
  box-sizing: border-box;
  margin: 10px 0;
  transition: all .3s;
  background-color: var(--background-color);
  color: var(--main-color);

  &:hover {
    border-color: var(--level-1-color);
  }

  &:focus {
    border-color: var(--theme-color);
  }
}

.input-checkbox {
  all: unset;
  display: inline-block;
  background-color: var(--level-3-color);
  width: 50px;
  height: 20px;
  border-radius: 20px;
  position: relative;
  transition: all .3s;
  cursor: pointer;
  vertical-align: middle;

  &::after {
    content: "";
    display: inline-block;
    width: 25px;
    height: 25px;
    position: absolute;
    background-color: var(--level-1-color);
    border-radius: 20px;
    top: -2.5px;
    left: -2.5px;
    transition: all .2s;
  }

  &:checked {
    background-color: var(--green-color);

    &::after {
      left: 27.5px;
      background-color: var(--dark-green-color);
    }
  }
}

.setsumei {
  margin: 20px 0;
  font-size: 18px;
}
.small-setsumei {
  margin: 20px 0 10px;
  font-size: 18px;
}

</style>
