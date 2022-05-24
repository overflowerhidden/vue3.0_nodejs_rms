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
        <el-button type="primary" @click="handleApply">申请休假</el-button>
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
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">查看</el-button>
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

  <el-dialog title="申请休假" v-model="showModal">
    <el-form
      ref="dialogForm"
      :model="leaveForm"
      label-width="120px"
      :rules="rules"
    >
      <el-form-item label="休假类型" prop="applyType">
        <el-select v-model="leaveForm.applyType">
          <el-option label="事假" :value="1"></el-option>
          <el-option label="调休" :value="2"></el-option>
          <el-option label="年假" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="休假日期" prop="startAndEndTime">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="startTime" required>
              <el-date-picker
                v-model="leaveForm.startTime"
                type="date"
                placeholder="选择开始日期"
                @change="(val) => handleDateChange('startTime', val)"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="text-align: center"> - </el-col>
          <el-col :span="8">
            <el-form-item prop="endTime" required>
              <el-date-picker
                v-model="leaveForm.endTime"
                type="date"
                placeholder="选择结束日期"
                @change="(val) => handleDateChange('endTime', val)"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="休假时长"> {{ leaveForm.leaveTime }} </el-form-item>
      <el-form-item label="休假原因" prop="reasons">
        <el-input
          type="textarea"
          :row="3"
          placeholder="请输入休假原因"
          v-model="leaveForm.reasons"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
import utils from "../utils/utils";
export default {
  name: "leave",
  setup() {
    // 获取Composition API 上下文对象
    const { ctx, proxy } = getCurrentInstance();
    // 初始化表单对象
    const queryForm = reactive({
      applyState: "",
    });
    // 申请列表
    const applyList = ref([]);
    // 分页
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    });
    // 定义表单校验规则
    const rules = {
      startTime: [
        {
          type: "date",
          required: true,
          message: "请选择开始日期",
          trigger: "change",
        },
      ],
      endTime: [
        {
          type: "date",
          required: true,
          message: "请选择开始日期",
          trigger: "change",
        },
      ],
      reasons: [
        {
          required: true,
          message: "请输入休假原因",
          trigger: ["blur", "change"],
        },
      ],
    };
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
        label: "休假原因",
        prop: "reasons",
      },
      {
        label: "申请时间",
        prop: "createTime",
        width: 180,
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value));
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

    const action = ref("create");
    const showModal = ref(false);
    // 创建休假弹框表单
    const leaveForm = reactive({
      applyType: 1,
      startTime: "",
      endTime: "",
      leaveTime: "0天",
      reasons: "",
    });
    onMounted(() => {
      getApplyList();
    });

    const getApplyList = async () => {
      let params = { ...queryForm, ...pager };
      let { list, page } = await proxy.$api.getApplyList(params);
      applyList.value = list;
    };

    const handleApply = () => {
      showModal.value = true;
      action.value = "create";
    };

    const handleQuery = () => {};
    const handleEdit = (row) => {};
    const handleDateChange = (key, val) => {
      let { startTime, endTime } = leaveForm;
      if (!startTime || !endTime) return;
      if (startTime > endTime) {
        proxy.$message.error("开始日期不能晚于结束日期");
        leaveForm.leaveTime = "0天";
        setTimeout(() => {
          leaveForm[key] = "";
        }, 0);
      } else {
        leaveForm.leaveTime =
          (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + "天";
      }
    };
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = {
            ...leaveForm,
            action: action.value,
          };
          await proxy.$api.leaveSubmit(params);
          proxy.$message.success("操作成功");
          handleClose();
        }
      });
    };
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
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
      showModal,
      leaveForm,
      handleReset,
      handleQuery,
      handleEdit,
      handleApply,
      handleSubmit,
      handleClose,
      handleDateChange,
    };
  },
};
</script>

<style>
</style>