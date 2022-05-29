<template>
  <router-view></router-view>
  <!-- <v-input
    v-model:modelValue="userName"
    v-model:title="title"
    @handleSubmit="handleSubmit"
  ></v-input> -->
</template>

<script>
import { ref, watchEffect } from "vue";
import VInput from "./components/VInput.vue";
export default {
  name: "app",
  components: { VInput },
  setup() {
    let userName = ref("zhaopeng");
    let title = ref("vue3.0");
    const handleSubmit = (values) => {
      console.log("接受数据：", values);
      console.log("当前对象：", userName);
    };
    // 监听
    watchEffect(() => console.log(userName.value));
    return {
      userName,
      title,
      handleSubmit,
    };
  },
};
</script>

<style lang='scss'>
@import "./assets/style/reset.css";
@import "./assets/style/index.scss";
</style>