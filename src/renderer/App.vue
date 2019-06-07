<template>
  <div id="app">
    <div class="container">
      <transition name="slide-fade">
        <router-view></router-view>
      </transition>
    </div>
    <div class="leftnav">
      <router-link to="/" class="button">
        <i class="icon">home</i>
      </router-link>
      <router-link to="/" class="button">
        <i class="icon">cloud_download</i>
      </router-link>
    </div>
    <div class="start-animation"></div>
    <div class="logo">Proline</div>
  </div>
</template>

<script>
  export default { name: 'proline-frontend' }
</script>

<style>
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
    color: white;
    transition: background-color .5s;
  }
  .leftnav .button .icon {
    font-size: 40px;
    line-height: 75px;
  }
  .leftnav .button:hover {
    background-color: rgba(255, 255, 255, .2);
  }

  #app {
    display: block;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  @keyframes start-animation {
    to {
      width: 0px;
    }
  }

  .start-animation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #1479f7;
    transition: background-color 1s;
    animation: start-animation 1s;
    animation-delay: 1s;
    animation-fill-mode: forwards;
  }
  @keyframes fade-out {
    to {
      opacity: 0;
      visibility: hidden;
    }
  }

  .logo {
    position: fixed;
    top: 50%;
    left: 0;
    margin-top: -50px;
    height: 100px;
    width: 100%;
    line-height: 100px;
    color: white;
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
    background-color: #1479f7;
  }

  .container {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;

    padding: 25px;
    padding-left: 100px;
    box-sizing: border-box;
  }

  .list {
    margin: 50px 0;
  }
  .list .nothing {
    text-align: center;
    color: grey;
  }
  .list .item {
    display: block;
    color: black;
    text-decoration: none;
    padding: 20px;
    transition: background-color .2s;
    cursor: pointer;
  }
  .list .item:hover {
    background-color: rgba(0, 0, 0, .05);
  }
  .list .right {
    float: right;
  }
</style>
