<template>
  <div>
    <h4 class="text-center">问卷管理</h4>
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="query.name"
          size="small"
          placeholder="请输入问卷名称"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button
          size="small"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="list.listLoading"
      :data="list.currentPage"
      element-loading-text="Loading"
      :border="false"
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column
        align="center"
        label="问卷名称"
      >
        <template slot-scope="scope">
          <div
            class="table-name"
            @click="handleTableItemClick(scope.row.resultGuid)"
          >
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="发放时间"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.issuingDate? parseTime(scope.row.issuingDate): '-' }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="状态"
        sortable="custom"
        prop="fill_status"
      >
        <template slot-scope="scope">{{ scope.row.fillStatus?"已提交":"未提交" }}</template>
      </el-table-column>

      <el-table-column
        align="center"
        label="是否已评"
        sortable="custom"
        prop="commented"
      >
        <template slot-scope="scope">{{ scope.row.commentedStatus?"已评":'未评' }}</template>
      </el-table-column>

    </el-table>

    <pagination
      :total="list.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :border="false"
      @pagination="search"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import { GetConsumerQuestionnairesPageList } from '@/api/HealthDocumentation/Member'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      list: {
        currentPage: [],
        listLoading: false,
        total: 0
      },
      query: {
        sortCriterias: [],
        name: '',
        pageIndex: 1,
        pageSize: 5
      }
    }
  },

  computed: {
    ...mapGetters({
      isShow: 'get_member_question_dialog'
    }),
    ...mapState({
      userGuid: state => state.member.member_vip_id
    })
  },

  created() {
    this.search()
  },

  methods: {
    ...mapMutations({
      set_ctx: 'SET_MEMBER_CTX', // 弹窗上下文显示开关
      setCurrentId: 'SET_MEMBER_TABLE_CURRENT_ID' // 储存操作后选中表格的ID
    }),

    search() {
      this.list.listLoading = true
      this.query.userGuid = this.userGuid

      GetConsumerQuestionnairesPageList(this.query)
        .then(res => {
          Object.assign(this.list, res.data)
          this.list.listLoading = false
        })
        .catch(() => {
          this.list.listLoading = false
        })
    },

    sortChange(col) {
      this.query.sortCriterias = []

      const order = col.order

      if (col.prop === 'fill_status') {
        this.query.sortCriterias.push({ Field: 'fill_status' })
      }

      if (col.prop === 'commented') {
        this.query.sortCriterias.push({ Field: 'commented' })
      }

      if (order === 'descending') {
        this.query.sortCriterias.forEach(i => {
          if (i.Field === col.prop) i.SortOrder = 2
        })
      }

      if (order === 'ascending') {
        this.query.sortCriterias.forEach(i => {
          if (i.Field === col.prop) i.SortOrder = 1
        })
      }

      this.search()
    },

    handleTableItemClick(id) {
      this.setCurrentId(id)
      this.set_ctx('detail')
    },

    handleSearch() {
      this.query.pageIndex = 1
      this.search()
    },
    parseTime
  }
}
</script>

<style lang="less" scoped>
.table-name {
  cursor: pointer;
  color: #2d8cf0;

  &:hover {
    text-decoration: underline;
  }
}
.text-center {
  margin-top: -2.3rem;
  text-align: center;
}
</style>
