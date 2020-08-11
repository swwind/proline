<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
@import './colors.less';
@import './transition.less';

html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--back-color);
  color: var(--fore-color);
  user-select: none;
  font-family: Roboto, 'Noto Sans', 'Segoe UI', 'Noto Sans CJK SC',
    'Source Han Sans CN', 'WenQuanYi Micro Hei', 'WenQuanYi Zen Hei',
    'Droid Sans Fallback', 'PingFang SC', 'Microsoft Yahei', sans-serif;
}

.app {
  height: 100%;
  width: 100%;

  > div {
    height: 100%;
    width: 100%;
  }
}
</style>