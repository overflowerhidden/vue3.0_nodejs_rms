<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "app",
  mounted() {
    this.$storage.setItem("info", { name: "zhaopeng", age: 27 });
    // console.log("info=>", this.$storage.getItem("info"));
    // this.$storage.clearItem("age");
    this.$storage.clearAll();
  },
};
</script>

<style>
</style>