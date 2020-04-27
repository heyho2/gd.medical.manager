<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">刷新</el-button>

      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="名称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认会员等级?" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="计算等级积分" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="折扣" width="80">
        <template slot-scope="scope">{{ scope.row.pageviews }}</template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">{{ scope.row.organizationGuid }}</template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="handleUpdate(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />

    <el-dialog :title="form.dialogEditTitle" :visible.sync="form.dialogEditVisible">
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="名称" prop="account">
          <el-input v-model="form.info.account" placeholder="会员等级名称"/>
        </el-form-item>
        <el-form-item label="等级积分" prop="account">
          <el-input v-model="form.info.account" placeholder="计算等级积分"/>
        </el-form-item>
        <el-form-item label="折扣比例" prop="account">
          <el-input v-model="form.info.account" placeholder="会员折扣比例"/>
        </el-form-item>
        <el-form-item label="账户" prop="account">
          <el-input v-model="form.info.account" placeholder="用户账号"/>
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="form.info.enable" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.info.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.dialogEditVisible = false" icon="el-icon-close">关闭</el-button>
        <el-button type="primary" @click="handleSave" icon="iconfont icon-save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetAccountListAsync } from "@/api/User";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 20,
        account: null,
        phone: null
      },
      total: 0,
      list: [],
      listLoading: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: "添加",
        dialogEditStatus: "add",
        //表单数据
        info: {
          account: null,
          password: null,
          enable: 1
        },
        //表单验证
        rules: {
          account: [{ required: true, message: "账号必填", trigger: "change" }],
          password: [{ required: true, message: "密码必填", trigger: "change" }]
        }
      }
    };
  },
  watch: {},
  created() {
    this.handleFilter();
  },
  methods: {
    //加载表格数据
    handleFilter() {
      this.listLoading = true;
      GetAccountListAsync(this.query).then(response => {
        this.list = response.data.currentPage;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 200);
      });
    },
    //添加
    handleAdd() {
      this.form.info = {};
      this.form.dialogEditVisible = true;
      this.form.dialogEditStatus = "add";
      this.form.dialogEditTitle = "添加账号";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //修改
    handleUpdate(row) {
      this.form.info = Object.assign({}, row); // copy obj
      this.form.dialogEditVisible = true;
      this.form.dialogEditStatus = "update";
      this.form.dialogEditTitle = "修改账号";
    },
    //搜索
    handleSearch() {
      this.query.pageIndex = 1;
      this.handleFilter();
    },
    handleSave() {
      const tempData = Object.assign({}, this.form.info);
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$notify({
            title: "成功",
            message: JSON.stringify(tempData),
            type: "success",
            duration: 2000
          });
        }
      });
    },
    //禁用/启用
    handleDisable(row) {
      alert("禁用");
    },
    //删除
    handleDelete(row) {
      alert("删除");
    }
  }
};
</script>
<style>
</style>

