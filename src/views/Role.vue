<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table :data="roleList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="primary" @click="handleOpenPermission(scope.row)"
              >设置权限</el-button
            >
            <el-button type="danger" @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        :total="pager.total"
        :current-page="pager.pageNum"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
      ></el-pagination>
    </div>
    <!-- 角色新增/编辑/删除 -->
    <el-dialog title="角色新增" v-model="showModal">
      <el-form
        ref="dialogForm"
        :model="roleForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="roleForm.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 设置权限 -->
    <el-dialog title="角色新增" v-model="showPermission">
      <el-form
        ref="dialogFormPermission"
        :model="roleForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <span>{{ curRoleName }}</span>
        </el-form-item>
        <el-form-item label="权限列表" prop="roleType">
          <el-tree
            ref="permissionTree"
            :data="menuList"
            show-checkbox
            default-expand-all
            node-key="_id"
            :props="{ label: 'menuName' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmitPermission"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from "../utils/utils";
export default {
  name: "role",
  data() {
    return {
      queryForm: {
        roleName: "",
      },
      roleList: [],
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
          width: 150,
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",
          formatter: (row, column, value) => {
            let names = [];
            let list = value.halfCheckedKeys || [];
            list.map((key) => {
              let name = this.actionMap[key];
              if (key && name) names.push(name);
            });
            return names.join(",");
          },
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
        total: 0,
      },
      showModal: false,
      roleForm: {},
      action: "",
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
      // 设置权限
      showPermission: false,
      curRoleId: "",
      curRoleName: "",
      menuList: [],
      // 菜单映射
      actionMap: {},
    };
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    async handleSubmitPermission() {
      let nodes = this.$refs.permissionTree.getCheckedNodes();
      let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys();
      let checkedKeys = [];
      let parentKeys = [];
      nodes.map((v) => {
        if (!v.children) {
          checkedKeys.push(v._id);
        } else {
          parentKeys.push(v._id);
        }
      });
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys),
        },
      };
      await this.$api.updatePermission(params);
      this.showPermission = false;
      this.$message.success("设置成功");
      this.getRoleList();
    },
    handleOpenPermission(row) {
      this.curRoleId = row._id;
      this.curRoleName = row.roleName;
      this.showPermission = true;
      let { checkedKeys } = row.permissionList || { checkedKeys: [] };
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys(checkedKeys);
      });
    },
    async getMenuList() {
      try {
        let list = await this.$api.getMenuList();
        this.menuList = list;
        this.getActionMap(list);
      } catch (error) {
        throw new Error(error);
      }
    },
    getActionMap(list) {
      let actionMap = {};
      const deep = (arr) => {
        while (arr.length) {
          let item = arr.pop();
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName;
          }
          if (item.children && !item.action) {
            deep(item.children);
          }
        }
      };
      deep(JSON.parse(JSON.stringify(list)));
      this.actionMap = actionMap;
    },
    // 角色列表初始化
    async getRoleList() {
      try {
        let params = { ...this.queryForm, ...this.pager };
        let { list, page } = await this.$api.getRoleList(params);
        this.roleList = list;
        this.pager.total = page.total;
      } catch (e) {
        throw new Error(e);
      }
    },
    // 表单重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    // 角色新增
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "create";
    },
    // 角色编辑
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      this.$nextTick(() => {
        // Object.assign(this.roleForm, row);
        this.roleForm = {
          _id: row._id,
          roleName: row.roleName,
          remark: row.remark,
        };
      });
    },
    // 角色删除
    async handleDel(_id) {
      await this.$api.roleOperate({ _id, action: "delete" });
      this.$message.success("删除成功");
      this.getRoleList();
    },
    // 弹框关闭
    handleClose() {
      this.handleReset("dialogForm");
      this.showModal = false;
    },
    // 角色提交
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { action, roleForm } = this;
          let params = { ...roleForm, action };
          await this.$api.roleOperate(params);
          this.showModal = false;
          this.$message.success("操作成功");
          this.handleReset("dialogForm");
          this.getRoleList();
        }
      });
    },
    handleCurrentChange(current) {
      this.pager.pageNum = current;
      this.getRoleList();
    },
  },
};
</script>

<style>
</style>