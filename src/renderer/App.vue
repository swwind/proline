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

button, .button {
  padding: 10px 30px;
  font-size: 1em;
  border-radius: 5px;
  border: none;
  outline: none;
  color: var(--fore-color);
  background-color: var(--back-color-lighten-90);
  transition: background-color .3s;

  &:hover {
    background-color: var(--back-color-lighten-80);
  }

  &:active {
    background-color: var(--back-color-lighten-70);
  }

  &.focus {
    background-color: var(--main-color-darken-60);

    &:hover {
      background-color: var(--main-color-darken-80);
    }
  }

  & + & {
    margin-left: 10px;
  }
}

</style>