<template>
  <div class="base-table">
    <div class="action">
      <slot name="action"></slot>
    </div>
    <el-table v-bind="$attrs">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          type="selection"
          width="55"
          v-if="item.type == 'selection'"
          key="selection"
        />
        <el-table-column v-bind="item" v-else-if="!item.type">
        </el-table-column>
        <el-table-column v-bind="item" v-if="item.type == 'action'">
          <template #default="scope">
            <template v-for="(btn, index) in item.list" :key="index">
              <el-button
                :type="btn.type || 'text'"
                @click="handleAction(index, scope.row)"
                v-if="btn.visible"
                >{{ btn.text }}</el-button
              >
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="pager.total"
      :page-size="pager.pageSize"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: "BaseTable",
  props: ["columns", "pager"],
  setup(props, { emit }) {
    const handleAction = (index, row) => {
      emit("handleAction", { index, row: { ...row } });
    };
    const handleCurrentChange = (pageNum) => {
      emit("handleCurrentChange", pageNum);
    };
    return {
      handleAction,
      handleCurrentChange
    };
  },
};
</script>

<style>
</style>