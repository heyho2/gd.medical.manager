<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input v-model="query.keyword" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.phone" placeholder="提问人/手机" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.rewardType" placeholder="按悬赏类型搜索" clearable>
          <el-option v-for="item in types" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          :loading="grid.listLoading"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_setting'"
          class="filter-item"
          type
          icon="el-icon-setting"
          @click="setting.dialogVisible=true"
        >设置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="grid.list" :border="false" fit highlight-current-row>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="问题" align="left">
        <template slot-scope="scope">
          <span class="beyond-hiding" :title=" scope.row.content ">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="悬赏" width="100" align="right">
        <template slot-scope="scope">
          <span
            v-if="scope.row.rewardType&&scope.row.rewardType.toLocaleLowerCase()=='intergral'"
          >{{ scope.row.rewardIntergral }}分</span>
          <span v-else>{{ scope.row.rewardIntergral? parseInt(scope.row.rewardIntergral) /100:0 }}元</span>
        </template>
      </el-table-column>
      <el-table-column label="提问人" width="120" align="center">
        <template slot-scope="scope">
          <span class="beyond-hiding" :title="scope.row.userName">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" width="110" align="right">
        <template slot-scope="scope">{{ scope.row.visitCount }}</template>
      </el-table-column>
      <el-table-column label="收藏量" width="110" align="right">
        <template slot-scope="scope">{{ scope.row.collectionCount }}</template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          {{ status[scope.row.status] }}
          <!-- <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{status[scope.row.status]}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item,index) in Object.keys(status)"
                :key="index"
                :command="{row:scope.row,status:item}"
              >{{status[item]}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">{{ toDateString(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="是否启用?" width="110" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      :total="grid.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :border="false"
      @pagination="handleFilter"
    />
    <setting :dialog-visible.sync="setting.dialogVisible" />
  </div>
</template>

<script>
import {
  SearchFaqsQuestionAsync,
  DeleteFaqsQuestionAsync,
  DisableEnableFaqsQuestionAsync,
  SetFaqsSettingStatusAsync
} from '@/api/Faqs'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import setting from './setting'
export default {
  components: { Pagination, setting },
  data() {
    return {
      query: {
        keyword: null,
        rewardType: null,
        phone: null,
        sortField: null,
        isAscending: true,
        pageIndex: 1,
        pageSize: 10
      },
      grid: {
        listLoading: false,
        list: [],
        total: 0
      },
      setting: { dialogVisible: false },
      types: [{ code: `1`, name: '积分' }, { code: `2`, name: '人民币' }],
      status: {
        Solving: '解决中',
        Solved: '已解决',
        End: '已结束',
        Pending: '待审核',
        Reject: '审核不通过',
        Adopt: '审核通过',
        Cancel: '已取消'
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    // 加载表格数据
    handleFilter() {
      this.grid.listLoading = true
      SearchFaqsQuestionAsync(this.query).then(
        response => {
          this.grid.list = response.data.currentPage
          this.grid.total = response.data.total
          setTimeout(() => {
            this.grid.listLoading = false
          }, 200)
        },
        err => {
          this.grid.listLoading = false
        }
      )
    },
    // 添加
    handleAdd() {
      const t = this
      t.form.info = {
        enable: true,
        sort: 1
      }
      t.form.dialogEditVisible = true
      t.form.dialogEditStatus = 'add'
      t.form.dialogEditTitle = '添加问题'
      t.$nextTick(() => {
        t.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      this.form.info = Object.assign({}, row) // copy obj
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'update'
      this.form.dialogEditTitle = '修改问题'
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableFaqsQuestionAsync({
        Guid: row.questionGuid,
        enable: row.enable
      }).then(response => {
        t.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      var t = this
      t.$confirm('此操作将永久删除该数据, 是否继续?', '确认删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteFaqsQuestionAsync({
            Guid: row.questionGuid
          }).then(response => {
            t.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            t.handleFilter()
          })
        })
        .catch(() => {
          t.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    toDateString(a) {
      return parseTime(new Date(a))
    },
    handleSetStatus(row, status) {
      var t = this
      SetFaqsSettingStatusAsync({
        questionGuid: row.questionGuid,
        status: status
      }).then(response => {
        t.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        row.status = status
        this.$set(row, `status`, status)
      })
    },
    handleCommand(command) {
      debugger
      this.handleSetStatus(command.row, command.status)
    }
  }
}
</script>
<style>
</style>

