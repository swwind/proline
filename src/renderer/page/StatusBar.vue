<template>
  <div class="status">
    <div class="left">
      <div class="item">DHC: 2333</div>
      <div class="item">ping: 200ms</div>
    </div>
    <div class="right">
      <div class="item">port: 25565</div>
      <div class="item">Connected: 2</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'status-bar'
}
</script>

<style lang="less" scoped>

.status {
  background-color: var(--main-color-darken-80);
  height: 100%;
  padding: 0 5px;
  font-size: 13px;
  transform: translateY(20px);
  animation: slide-up .3s;
  animation-fill-mode: forwards;

  .left {
    float: left;
  }

  .right {
    float: right;
  }

  .item {
    display: inline-block;
    padding: 0 5px;
    margin: 0 5px;
    cursor: pointer;

    &:hover {
      background-color: var(--main-color-darken-90);
    }
  }
}

@keyframes slide-up {
  to {
    transform: none;
  }
}

</style>