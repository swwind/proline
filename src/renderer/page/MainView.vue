<template>
  <div class="mainview">
    <div class="left">
      <NavBar></NavBar>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue';

export default {
  name: 'main-view',
  components: {
    NavBar,
  }
}
</script>

<style lang="less" scoped>

.mainview {
  display: flex;
  flex-direction: row;

  .left {
    width: 50px;
  }

  .right {
    flex: 1;
    padding: 20px 30px;
  }
}

</style>