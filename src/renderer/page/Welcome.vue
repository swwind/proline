<template>
  <div class="welcome">
    <span class="title">Proline</span>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  mounted() {
    setTimeout(() => {
      this.$router.push('/app/index');
    }, 2000);
  }
}
</script>

<style lang="less" scoped>

.welcome {
  background-color: var(--main-color);
  display: grid;
  place-items: center;
  animation: welcome-out 1s;
  animation-delay: 1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;

  .title {
    color: white;
    display: inline-block;
    font-size: 4em;
  }
}

@keyframes welcome-out {
  to {
    transform: translateX(calc(-100vw + 50px));
  }
}

</style>