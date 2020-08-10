<template>
  <div class="under-construction">
    <div class="content">
      <p class="building">This feature is still under construction...</p>
      <p class="back" @click="handleBack">back</p>
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

    .building {
      font-size: 2em;
    }

    .back {
      cursor: pointer;
    }
  }
}

</style>