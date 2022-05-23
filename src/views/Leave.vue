<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="审批状态" prop="state">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">申请休假</el-button>
      </div>
      <el-table :data="applyList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-button>查看</el-button>
            <el-button type="danger">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
      />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
import utils from "../utils/utils";
export default {
  name: "leave",
  setup() {
    // 获取Composition API 上下文对象
    const { ctx, proxy } = getCurrentInstance();
    // 初始化用户表单对象
    const queryForm = reactive({
      applyState: "",
    });
    // 初始化用户列表数据
    const applyList = ref([]);
    // 初始化分页对象
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    });
    // 定义表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        { required: true, message: "请输入用户邮箱", trigger: "blur" },
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请选择部门",
          trigger: "change",
        },
      ],
    });
    // 定义动态表格-格式
    const columns = reactive([
      {
        label: "单号",
        prop: "orderNo",
        width: 150,
      },
      {
        label: "休假时间",
        prop: "leaveTimeLength",
        formatter: (row, column, value) => {
          return (
            utils.formateDate(new Date(row.startTime), "yyyy-MM-dd") +
            " 到 " +
            utils.formateDate(new Date(row.endTime), "yyyy-MM-dd")
          );
        },
      },
      {
        label: "休假时长",
        prop: "leaveTime",
      },
      {
        label: "休假类型",
        prop: "applyType",
        formatter: (row, column, value) => {
          return {
            1: "事假",
            2: "调休",
            3: "年假",
          }[value];
        },
      },
      {
        label: "审批人",
        prop: "auditUsers",
      },
      {
        label: "当前审批人",
        prop: "applyUser.userName",
      },
      {
        label: "审批状态",
        prop: "applyState",
        formatter: (row, column, value) => {
          return {
            1: "待审批",
            2: "审批中",
            3: "审批拒绝",
            4: "审批通过",
            5: "待审批",
          }[value];
        },
      },
    ]);
    onMounted(() => {
      getApplyList();
    });

    const getApplyList = async () => {
      let params = { ...queryForm, ...pager };
      let { list, page } = await proxy.$api.getApplyList(params);
      applyList.value = list;
    };

    const handleQuery = () => {};
    // 重置查询表单
    const handleReset = (form) => {
      ctx.$refs[form].resetFields();
    };
    return {
      queryForm,
      applyList,
      pager,
      columns,
      rules,
      handleReset,
    };
  },
};
</script>

<style>
</style>