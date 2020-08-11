<template>
  <div class="mainview">
    <div class="up">
      <div class="left">
        <NavBar></NavBar>
      </div>
      <div class="right">
        <transition name="fade-up">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <div class="down">
      <StatusBar></StatusBar>
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
  flex-direction: column;
  .up {
    flex: 1;
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
  .down {
    height: 25px;
    line-height: 25px;
  }
}

</style>