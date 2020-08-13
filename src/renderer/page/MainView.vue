<template>
  <div class="mainview">
    <div class="left">
      <NavBar></NavBar>
    </div>
    <div class="right">
      <transition name="fade-up">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue';
import StatusBar from './StatusBar.vue';

export default {
  name: 'main-view',
  components: {
    NavBar,
    StatusBar
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
    padding: 0 30px;
  }
}

</style>