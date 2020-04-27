<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-date-picker
        v-model="query.registeredDate"
        type="daterange"
        range-separator="-"
        start-placeholder="添加时间"
        end-placeholder="至"
      ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>

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
      <el-table-column label="账号" width="210" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template slot-scope="scope">{{ scope.row.pageviews }}</template>
      </el-table-column>
      <el-table-column label="是否显示" width="110" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.creationDate" @change="handleDisable(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="显示顺序" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.creationDate }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.creationDate }}</template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button @click="handleDisable(scope.row)" type="text" size="small">删除</el-button>
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
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.info.account" placeholder="账号"/>
        </el-form-item>
        <el-form-item label="昵称" prop="account">
          <el-input v-model="form.info.account" placeholder="昵称"/>
        </el-form-item>
        <el-form-item label="显示顺序" prop="account">
          <el-input-number v-model="form.info.account" :min="1" :max="100" placeholder="显示顺序"></el-input-number>
        </el-form-item>
        <el-form-item label="注册时间" prop="account">
          <el-switch v-model="form.info.visible" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="创建人"></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间"></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="修改人"></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修改时间"></el-form-item>
          </el-col>
        </el-row>
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
        name: null,
        registeredDate: null,
        registeredEndDate: null
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
          account: "",
          password: ""
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
      this.form.dialogEditTitle = "添加";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //修改
    handleUpdate(row) {
      this.form.info = Object.assign({}, row); // copy obj
      this.form.dialogEditVisible = true;
      this.form.dialogEditStatus = "update";
      this.form.dialogEditTitle = "修改";
    },
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
    //查看
    handleView(row) {
      alert("查看");
    }
  }
};
</script>
<style>
</style>

