<template>
  <Drawer :title="`绑定健康管理师`" :dialog-visible.sync="c_dialogVisible" width="940px" style>
    <div class="search">
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="-"
        start-placeholder="注册时间"
        end-placeholder="至"
        clearable
        style="margin-right: 10px;"
        value-format="yyyy-MM-dd"
      />
      <el-input v-model="query.keyWord" style="width:300px;" placeholder="请输入会员名/手机号" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
      </el-input>
    </div>

    <el-table
      ref="multipleTable"
      v-loading="grid.loading"
      :data="grid.currentPage"
      element-loading-text="Loading"
      :border="false"
      fit
      highlight-current-row
    >
      <el-table-column align="center" type="index" width="55" label="序列" />
      <el-table-column label="头像" align="center" width="100">
        <template slot-scope="scope" width="100">
          <el-avatar icon="el-icon-user-solid" :src="scope.row.portraitImg" />
        </template>
      </el-table-column>
      <el-table-column align="left" label="会员名">
        <template slot-scope="scope">{{ scope.row.userName || '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="手机号" width="120">
        <template slot-scope="scope">{{ scope.row.phone || '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" width="160">
        <template
          slot-scope="scope"
        >{{ scope.row.registrationTime? parseTime(scope.row.registrationTime): '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.default">当前已绑定</span>
          <el-button v-else slot="append" size="mini" @click="handleBind(scope.row)">绑定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="grid.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :border="false"
      @pagination="handleFilter"
    />
  </Drawer>
</template>

<script>
import {
  GetChangeHealthManagers,
  BindHealthManager
} from '@/api/HealthDocumentation/HealthManager'
import { parseTime } from '@/utils/index'
import Drawer from '@/components/Drawer/Index'
export default {
  components: {
    Drawer
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    consumerGuid: {
      type: String
    }
  },
  data() {
    return {
      date: [],
      grid: {
        currentPage: [],
        loading: false,
        total: 0
      },
      query: {
        keyWord: '',
        consumerGuid: this.consumerGuid,
        registrationTime: null,
        endTime: null,
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    c_dialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.query.consumerGuid = this.consumerGuid
        this.handleFilter()
      }
    },
    date(val) {
      const t = this
      if (t.date && t.date.length > 0) {
        t.query.registrationTime = parseTime(t.date[0], '{y}-{m}-{d}')
        t.query.endTime = parseTime(t.date[1], '{y}-{m}-{d}')
      } else {
        t.query.registrationTime = null
        t.query.endTime = null
      }
    }
  },
  created() {
    console.log(this.query.consumerGuid)
  },
  methods: {
    handleFilter() {
      this.grid.loading = true
      console.log(this.query)

      GetChangeHealthManagers(this.query)
        .then(res => {
          Object.assign(this.grid, res.data)
          this.grid.loading = false
        })
        .catch(() => {
          this.grid.loading = false
        })
    },
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    parseTime,
    handleBind(row) {
      BindHealthManager({
        managerGuid: row.managerGuid,
        consumerGuid: this.consumerGuid
      })
        .then(res => {
          this.$notify({
            title: '成功',
            message: '绑定成功',
            type: 'success',
            duration: 2000
          })
          this.c_dialogVisible = false
          this.$emit('onSuccess')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.custom {
  max-width: 920px;
}
.text-center {
  margin-top: -2.3rem;
  text-align: center;
}
.search {
  padding: 20px;
  text-align: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
