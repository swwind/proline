<template>
  <div class="under-construction">
    <div class="content">
      <p class="text">This feature is still under construction...</p>
      <button class="back" @click="handleBack">back</button>
      <button class="back" @click="handleBack">back</button>
      <button class="back" @click="handleBack">back</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'under-construction',
  methods: {
    handleBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="less" scoped>

.under-construction {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;

  .content {
    text-align: center;

    .text {
      font-size: 2em;
    }
  }
}

</style>