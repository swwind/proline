<template>
  <div class="navbar">
    <router-link
      v-for="route in routes"
      :key="route.path"
      :to="route.path"
      class="item"
      :class="{ now: route.path === path }"
      :title="route.title">
      <i class="icon">{{ route.icon }}</i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'navbar',
  data() {
    return {
      routes: [
        {
          path: '/',
          icon: 'home',
          title: 'Home'
        }, {
          path: '/app/overview',
          icon: 'subject',
          title: 'Overview'
        }, {
          path: '/app/settings',
          icon: 'settings',
          title: 'Settings'
        }, {
          path: '/app/files',
          icon: 'folder',
          title: 'Files'
        }
      ],
      path: '/',
    }
  },
  watch: {
    $route(to, from) {
      if (to && to.path) {
        this.path = to.path;
      }
    }
  }
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
    text-decoration: none;

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