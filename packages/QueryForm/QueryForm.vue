<template>
  <el-form ref="queryForm" :inline="true" :model="queryModel">
    <template v-for="(item, index) in form" :key="index">
      <FormItem :item="item" v-bind="item" v-model="queryModel[item.model]" />
    </template>
    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleReset('form')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, getCurrentInstance } from "vue";
import FormItem from "./FormItem.vue";
export default {
  name: "QueryForm",
  props: ["modelValue", "form"],
  emits: ["update:modelValue", "handleQuery"],
  components: { FormItem },
  setup(props, context) {
    const ctx = getCurrentInstance();
    const form = props.form;
    const queryModel = reactive({
      ...props.modelValue,
    });

    const handleReset = () => {
      ctx.refs.queryForm.resetFields();
    };
    const handleQuery = () => {
      context.emit("update:modelValue", queryModel);
      context.emit("handleQuery", queryModel);
    };

    return {
      form,
      queryModel,
      handleReset,
      handleQuery,
    };
  },
};
</script>