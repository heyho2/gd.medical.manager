<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" :model="query">
      <el-form-item
        v-for="(item,index) in query.previewConditionInfoList"
        :key="index"
        :label="item.name"
        :prop="'previewConditionInfoList.' + index + '.fieldValue'"
        :rules="[{ required: item.required, message: '必填', trigger: 'blur'}]"
      >
        <el-date-picker
          v-if="item.valueType==`datetime`"
          v-model="item.fieldValue"
          type="datetime"
          :placeholder="item.name"
          value-format="yyyy-MM-dd HH:mm:ss"
          clearable
        />
        <el-input
          v-else-if="item.valueType==`int`||item.valueType==`decimal`"
          v-model="item.fieldValue"
          oninput="value=value.replace(/[^\d]/g,'')"
          :placeholder="`${item.name}（数字）`"
          clearable
        />
        <el-input v-else v-model="item.fieldValue" :placeholder="item.name" clearable />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="grid.listLoading"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
      <el-button
        v-permission="'handle_export'"
        type
        icon="el-icon-printer"
        @click="handleDownload"
      >导出</el-button>
    </el-form>
    <el-table :data="grid.list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序列" type="index" width="60" />
      <el-table-column
        v-for="(item,index) in grid.columnList"
        :key="index"
        :min-width="'120px'"
        :sortable="'custom'"
        :prop="item.fieldCode"
        :label="item.name"
        align="center"
      >
        <template slot-scope="scope">
          <span
            v-if="item.valueType==`datetime`"
            class="beyond-hiding"
            :title="scope.row[item.fieldCode]"
          >{{ item.fieldCode?parseTime(scope.row[item.fieldCode]):"-" }}</span>
          <span
            v-else-if="item.valueType==`bool`"
            class="beyond-hiding"
            :title="scope.row[item.fieldCode]"
          >{{ scope.row[item.fieldCode] ?"是":"否" }}</span>
          <span
            v-else
            class="-hiding"
            :title="scope.row[item.fieldCode]"
          >{{ scope.row[item.fieldCode] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="grid.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :page-sizes="[10,20,30,50,100,200,300,500,1000]"
      :border="false"
      @pagination="handleFilter"
    />
  </div>
</template>

<script>
import { PreviewResultInSqlAsync, GetConditionListAsync } from '@/api/Report'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import '@/utils/linq'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      query: {
        themeGuid: this.$route.params.id,
        orderByKey: 'string',
        aacOrDesc: 'string',
        previewConditionInfoList: [
          {
            name: null,
            fieldCode: null,
            fieldValue: null,
            valueType: null,
            sort: null,
            fieldCodeValueString: null,
            required: null
          }
        ],
        pageIndex: 1,
        pageSize: 10
      },
      grid: {
        list: [],
        columnList: [],
        conditionList: [],
        listLoading: false,
        total: 0
      },
      temp: {}
    }
  },
  created() {
    GetConditionListAsync({
      themeGuid: this.$route.params.id,
      recordType: 'Condition'
    }).then(response => {
      this.query.previewConditionInfoList = response.data.select(a => {
        return {
          name: a.name,
          fieldCode: a.fieldCode.replace(/(^\s*)|(\s*$)/g, ''),
          fieldValue: null,
          valueType: a.valueType,
          sort: a.sort,
          fieldCodeValueString: `@${a.fieldCode}`,
          required: a.required
        }
      })
    })
    GetConditionListAsync({
      themeGuid: this.$route.params.id,
      recordType: 'Column'
    }).then(response => {
      this.grid.columnList = response.data.select(a => {
        return {
          name: a.name,
          fieldCode: a.fieldCode.replace(/(^\s*)|(\s*$)/g, ''),
          valueType: a.valueType,
          sort: a.sort
        }
      })
    })
    // this.handleFilter();
  },
  methods: {
    // 加载表格数据
    handleFilter() {
      this.query.previewConditionInfoList.forEach(element => {
        if (element.valueType == `string`) {
          element.fieldValue =
            (element.fieldValue || '').replace(/(^\s*)|(\s*$)/g, '') || null
        }
      })
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.grid.listLoading = true
          PreviewResultInSqlAsync(this.query).then(
            response => {
              var { currentPage, total } = response.data
              this.grid.list = currentPage
              this.grid.total = total
              setTimeout(() => {
                this.grid.listLoading = false
              }, 200)
            },
            err => {
              this.grid.listLoading = false
            }
          )
        }
      })
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    parseTime,
    handleDownload() {
      PreviewResultInSqlAsync({
        themeGuid: this.$route.params.id,
        orderByKey: 'string',
        aacOrDesc: 'string',
        previewConditionInfoList: this.query.previewConditionInfoList,
        pageIndex: 1,
        pageSize: 99999
      }).then(response => {
        var { currentPage, total } = response.data
        if (currentPage.length == 0) {
          return this.$message({
            type: 'info',
            message: '没有数据导出'
          })
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = this.grid.columnList.select(a => a.name)
          const filterVal = this.grid.columnList.select(a => a.fieldCode)
          const data = this.formatJson(this.grid.columnList, currentPage)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '报表',
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(columnList, jsonData) {
      var t = this
      return jsonData.map(item =>
        columnList.map(column => {
          if (column.valueType == `datetime`) {
            return parseTime(item[column.fieldCode])
          } else if (column.valueType == `bool`) {
            return item[column.fieldCode] ? '是' : '否'
          } else {
            return item[column.fieldCode]
          }
        })
      )
    }
  }
}
</script>
