<template>
  <el-input :modelValue="userName" @update:modelValue="handleInput"></el-input>
  <el-button @click="handleSubmit">提交测试</el-button>
</template>

<script>
import { ref } from "vue";
export default {
  name: "v-input",
  props: ["modelValue", "title"],
  setup(props, context) {
    let userName = ref(props.modelValue);
    // 方法1
    const handleInput = (val) => {
      userName.value = val;
      context.emit("update:modelValue", val);
    };
    // 方法2
    const handleSubmit = (val) => {
      context.emit("handleSubmit", userName);
    };

    return {
      userName,
      handleInput,
      handleSubmit,
    };
  },
};
</script>

<style>
</style>