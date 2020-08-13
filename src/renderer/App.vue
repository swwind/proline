<template>
  <div class="app">
    <div class="up">
      <router-view></router-view>
    </div>
    <div class="down">
      <StatusBar></StatusBar>
    </div>
  </div>
</template>

<script>
import StatusBar from './page/StatusBar.vue';

export default {
  name: 'app',
  components: {
    StatusBar
  }
}
</script>

<style lang="less">
@import './style.less';

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
  display: flex;
  flex-direction: column;

  .up {
    flex: 1;

    > div {
      height: 100%;
    }
  }
}


</style>