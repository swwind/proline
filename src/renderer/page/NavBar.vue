<template>
  <div class="navbar">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item now">3</div>
    <div class="item">4</div>
  </div>
</template>

<script>
export default {
  name: 'navbar'
}
</script>

<style lang="less" scoped>

.set-delay(@x) when (@x > 0) {
  &:nth-child(@{x}) {
    animation-delay: calc(@x * .1s);
  }
  .set-delay((@x - 1));
}

.navbar {
  background-color: var(--main-color);
  height: 100%;
  counter-reset: index;

  .item {
    display: block;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: white;
    cursor: pointer;
    counter-increment: index;

    animation: upside-in .5s;
    animation-fill-mode: forwards;

    transform: translateY(-20px);
    opacity: 0;

    &:hover {
      background-color: var(--main-color-darken-80);
    }

    &.now {
      cursor: default;
      background-color: var(--main-color-darken-60);
    }

    .set-delay(4);
  }
}

@keyframes upside-in {
  to {
    transform: none;
    opacity: 1;
  }
}

</style>