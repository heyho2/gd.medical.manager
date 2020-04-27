<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="query.keyWord" placeholder="请输入会员名/手机号" clearable style="width:300px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          type
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >新增用户</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          type="warning"
          icon="el-icon-connection"
          @click="handleBatchBand"
        >批量绑定用户</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="list.listLoading"
      :data="list.currentPage"
      element-loading-text="Loading"
      :border="false"
      fit
      highlight-current-row
      :row-class-name="tableRowClassName"
    >
      <el-table-column align="center" type="index" label="序列" width="60" />

      <el-table-column align="center" label="会员名">
        <template slot-scope="scope">{{ scope.row.name || '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">{{ scope.row.phone || '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">{{ scope.row.gender=='M'?'男':'女' }}</template>
      </el-table-column>
      <el-table-column align="center" label="年龄">
        <template slot-scope="scope">{{ scope.row.age >= 0? scope.row.age : '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="最近更新">
        <template
          slot-scope="scope"
        >{{ scope.row.updatedDate? parseTime(scope.row.updatedDate): '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="健康管理师">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.managerGuid"
            size="mini"
            type="text"
            icon="el-icon-sort"
            @click="handleBind(scope.row)"
          >{{ scope.row.managerName }}({{ scope.row.managerPhone }})</el-button>
          <el-button v-else size="mini" type="warning" @click="handleBind(scope.row)">绑定</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="420">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            style="background:rgba(102, 102, 255, 1);color:#fff;border-color:rgba(102, 102, 255, 1);"
            @click="handleFollow(scope.row)"
          >随访记录</el-button>
          <el-button size="mini" type="primary" @click="openDialog(scope.row,'info')">个人信息</el-button>
          <el-button
            size="mini"
            style="background:#32cf74;color:#fff;border-color:#32cf74"
            @click="openDialog(scope.row,'question')"
          >问卷管理</el-button>
          <el-button
            size="mini"
            style="background:#fc5d5d;color:#fff;border-color:#fc5d5d"
            @click="openDialog(scope.row,'test')"
          >检验报告</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="list.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :border="false"
      @pagination="search"
    />
    <AddMember
      :dialog-visible.sync="add.dialogVisible"
      dialog-title="添加用户"
      @onSuccess="handleOnSuccess"
    />
    <BatchBand :dialog-visible.sync="batchBand.dialogVisible" @onSuccess="handleOnSuccess" />
    <HealthManagerBand
      :dialog-visible.sync="healthManagerBand.dialogVisible"
      :consumer-guid="healthManagerBand.consumerGuid"
      @onSuccess="search"
    />
    <FollowRecord :dialog-visible.sync="follow.dialogVisible" :consumer-guid="follow.consumerGuid" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import { GetConsumersPageList } from '@/api/HealthDocumentation/Member'
import AddMember from './addMember'
import BatchBand from './batchBand'
import HealthManagerBand from './healthManagerBand'
import FollowRecord from './followRecord'

import { parseTime } from '@/utils'
export default {
  components: { AddMember, BatchBand, HealthManagerBand, FollowRecord },
  data() {
    return {
      list: {
        currentPage: [],
        listLoading: false,
        total: 0
      },
      query: {
        keyWord: '',
        pageIndex: 1,
        pageSize: 10
      },
      add: {
        dialogVisible: false
      },
      batchBand: {
        dialogVisible: false
      },
      healthManagerBand: {
        dialogVisible: false,
        consumerGuid: null
      },
      follow: {
        dialogVisible: false,
        consumerGuid: null
      }
    }
  },
  computed: {
    ...mapGetters({
      isShow: 'get_member_dialog'
    })
  },
  created() {
    this.search()
  },
  methods: {
    // 弹窗上下文显示开关
    ...mapMutations({
      set_dialog_show: 'SET_MEMBER_DIALOG_SHOW', // 弹窗开关
      set_ctx: 'SET_MEMBER_CTX', // 弹窗上下文显示开关
      set_current_id: 'SET_MEMBER_VIP_ID', // 储存 当前选中的健康档案会员ID
      ser_user_info: 'SET_MEMBER_VIP_INFO' // 储存 当前选中的健康档案会员信息
    }),

    search() {
      this.list.listLoading = true
      GetConsumersPageList(this.query)
        .then(res => {
          Object.assign(this.list, res.data)
          this.list.listLoading = false
        })
        .catch(() => {
          this.list.listLoading = false
        })
    },

    // 打开弹窗
    openDialog(row, type) {
      this.set_current_id(row.userGuid)
      this.ser_user_info({
        nickName: row.name,
        phone: row.phone
      })
      // 打开对应弹窗
      this.set_dialog_show(true)

      // 对应打开数据列表
      this.set_ctx(type)
    },

    handleSearch() {
      this.query.pageIndex = 1
      this.search()
    },
    handleAdd() {
      this.add.dialogVisible = true
    },
    handleBatchBand() {
      this.batchBand.dialogVisible = true
    },
    handleBind(row) {
      this.healthManagerBand.dialogVisible = true
      this.healthManagerBand.consumerGuid = row.userGuid
    },
    handleFollow(row) {
      this.follow.dialogVisible = true
      this.follow.consumerGuid = row.userGuid
    },
    handleOnSuccess(data) {
      this.query.pageIndex = 1
      GetConsumersPageList(this.query)
        .then(res => {
          Object.assign(this.list, res.data)

          this.list.currentPage.forEach(element => {
            if (element.phone == data.phone) {
              element['sajdlss'] = true
            }
          })
          this.list.listLoading = false
        })
        .catch(() => {
          this.list.listLoading = false
        })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.sajdlss) {
        return 'sajdlss-row'
      }
    },
    parseTime
  }
}
</script>

<style lang="less" scoped>
/deep/.sajdlss-row {
  background-color: #ecf5ff;
}
</style>
