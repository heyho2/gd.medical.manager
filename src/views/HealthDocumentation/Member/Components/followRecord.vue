<template>
  <Drawer :title="`随访记录`" :dialog-visible.sync="c_dialogVisible" width="940px" style>
    <div style="padding: 20px;text-align: right;">
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="-"
        start-placeholder="随访时间"
        end-placeholder="至"
        clearable
      />
      <el-input v-model="query.keyWord" style="width:300px;" placeholder="请输入记录人姓名/手机号" clearable>
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
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form
            ref="dataForm"
            label-position="top"
            label-width="120px"
            style="margin-left: 20px;margin-right: 30px;"
            label-suffix="："
          >
            <el-form-item label="随访记录">
              <p style="line-height:25px;margin: 0;">{{ scope.row.content||"无" }}</p>
            </el-form-item>
            <el-form-item label="随访建议">
              <p style="line-height:30px;margin: 0;">{{ scope.row.suggestion||"无" }}</p>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" type="index" width="55" label="序列" />
      <el-table-column align="center" label="记录人">
        <template slot-scope="scope">{{ scope.row.userName || '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">{{ scope.row.phone || '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="随访时间">
        <template
          slot-scope="scope"
        >{{ scope.row.followUpTime? parseTime(scope.row.followUpTime): '-' }}</template>
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
import { GetHealthManagerFllowupRecords } from '@/api/HealthDocumentation/HealthManager'
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
        ConsumerGuid: null,
        followUpTime: null,
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
        t.query.followUpTime = parseTime(t.date[0], '{y}-{m}-{d}')
        t.query.endTime = parseTime(t.date[1], '{y}-{m}-{d}')
      } else {
        t.query.followUpTime = null
        t.query.endTime = null
      }
    }
  },
  created() {},
  methods: {
    handleFilter() {
      this.grid.loading = true
      GetHealthManagerFllowupRecords(this.query)
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
    parseTime
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
</style>
