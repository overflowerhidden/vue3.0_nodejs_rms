<template>
  <h1>欢迎来到登录界面</h1>
  <el-button @click="goHome">回首页</el-button>
</template>

// <script setup>
// import { defineProps, reactive } from "vue";
// import { useRouter } from "vue-router";
// defineProps({
//   msg: String,
// });

// const state = reactive({ count: 0 });

// const router = useRouter();
// const goHome = () => {
//   router.push("/welcome");
// };
//
// </script>

<script>
export default {
  name: "Login",
  methods: {
    goHome() {
      this.$router.push("/welcome");
    },
  },
};
</script>


<style>
</style>
