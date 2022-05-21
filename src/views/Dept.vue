<template>
  <div class="dept-manager">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="action == 'create' ? '部门新增' : '部门编辑'"
      v-model="showModal"
    >
      <el-form
        ref="dialogForm"
        :model="deptForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="deptForm.parentId"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            placeholder="请选择上级部门"
          />
          <span>不选，则直接创建一级部门</span>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptForm.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select
            v-model="deptForm.user"
            @change="handleUser"
            placeholder="请选择负责人"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input v-model="deptForm.userEmail" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from "../utils/utils";
export default {
  name: "dept",
  data() {
    return {
      queryForm: {
        deptName: "",
      },
      deptList: [],
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
          width: 150,
        },
        {
          label: "负责人",
          prop: "userName",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      pager: {
        pageNum: 1,
        pageSize: 10,
      },
      showModal: false,
      action: "create",
      deptForm: {
        parentId: [null],
      },
      userList: [],
      rules: {
        parentId: {
          required: true,
          message: "请选择上级部门",
          trigger: "blur",
        },
        deptName: {
          required: true,
          message: "请输入部门名称",
          trigger: "blur",
        },
        user: {
          required: true,
          message: "请选择负责人",
          trigger: "blur",
        },
      },
    };
  },
  mounted() {
    this.getDeptList();
    this.getAllUserList();
  },
  methods: {
    // 部门列表初始化
    async getDeptList() {
      try {
        let list = await this.$api.getDeptList(this.queryForm);
        this.deptList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    // 获取所有用户列表
    async getAllUserList() {
      try {
        const list = await this.$api.getAllUserList();
        this.userList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    // 表单重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleAdd() {
      this.showModal = true;
      this.action = "create";
    },
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.deptForm, row, {
          user: `${row.userId}/${row.userName}/${row.userEmail}`,
        });
      });
    },
    async handleDel(_id) {
      this.action = "delete";
      await this.$api.deptOperate({ _id, action: this.action });
      this.$message.success("删除成功");
      this.getDeptList();
    },
    handleUser(val) {
      const [userId, userName, userEmail] = val.split("/");
      Object.assign(this.deptForm, { userId, userName, userEmail });
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { action, deptForm } = this;
          let params = { ...deptForm, action };
          delete params.user;
          let res = await this.$api.deptOperate(params);

          this.$message.success("操作成功");
          this.handleClose();
          this.getDeptList();
        }
      });
    },
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
  },
};
</script>

<style>
</style>