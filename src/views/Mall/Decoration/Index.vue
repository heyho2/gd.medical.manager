<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-select
          v-model="query.ClassificationGuid"
          placeholder="请选择位置"
          clearable
          @change="handleSearch"
        >
          <el-option
            v-for="item in typeList"
            :key="item.classificationGuid"
            :label="item.classificationName"
            :value="item.classificationGuid"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.keyword" placeholder="关键字" clearable />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="listLoading"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          class="filter-item"
          icon="el-icon-plus"
          @click="handleAdd"
        >添加专题拼图</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" :border="false" fit highlight-current-row>
      <el-table-column align="center" type="index" label="序列" width="65" />
      <el-table-column label="名字" min-width="110" align="left">
        <template slot-scope="scope">
          <span class="beyond-hiding">{{ scope.row.decorationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.classificationName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="跳转链接" align="left" max-width="250">
        <template slot-scope="scope">{{ scope.row.targetUrl }}</template>
      </el-table-column>-->
      <el-table-column label="排序" width="110" align="center" :sortable="'custom'" prop="sort">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">{{ parseTime(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="是否启用?" width="60" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.classificationName=='专题拼图'"
            type="success"
            size="mini"
            @click="handleCopy(scope.row,$event)"
          >复制</el-button>
          <el-button
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :border="false"
      @pagination="handleFilter"
    />
    <SpecialTopic
      :dialog-visible.sync="specialTopic.dialogVisible"
      :dialog-title="specialTopic.title"
      :guid="specialTopic.guid"
      @onSuccess="handleFilter"
    />
  </div>
</template>

<script>
import {
  GetDecorationPageListAsync,
  GetDecorationClassificationAsync,
  DisableEnableDecorationAsync
} from '@/api/Decoration'
import { parseTime } from '@/utils/index'
import '@/utils/linq'
import Pagination from '@/components/Pagination'
import SpecialTopic from './Components/SpecialTopic'
import clip from '@/utils/clipboard' // use clipboard directly
export default {
  components: { Pagination, SpecialTopic },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 5,
        ClassificationGuid: null,
        keyword: null,
        SortField: 'sort',
        IsAscending: false
      },
      typeList: [],
      total: 0,
      list: [],
      listLoading: false,
      specialTopic: {
        dialogVisible: false,
        title: '添加专题页',
        guid: null
      }
    }
  },
  watch: {},
  created() {
    GetDecorationClassificationAsync().then(response => {
      this.typeList = response.data
    })
    this.handleFilter()
  },
  methods: {
    // 加载表格数据
    handleFilter() {
      this.listLoading = true
      GetDecorationPageListAsync(this.query).then(
        response => {
          this.list = response.data.currentPage
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        },
        error => {
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        }
      )
    },
    // 添加
    handleAdd() {
      this.specialTopic.dialogVisible = true
      this.specialTopic.title = '添加专题页'
      this.specialTopic.guid = null
    },
    // 修改
    handleUpdate(row) {
      this.specialTopic.guid = row.decorationGuid
      this.specialTopic.dialogVisible = true
      this.specialTopic.title = '修改专题页'
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableDecorationAsync({
        DecorationGuid: row.decorationGuid,
        Status: row.enable
      }).then(response => {
        t.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    parseTime,
    handleCopy(row) {
      clip(
        `${process.env.VUE_APP_BASE_Client_Url}/special?id=${row.decorationGuid}`,
        event
      )
      //   alert(`${process.env.clientUrl}/special?id=${row.decorationGuid}`);
    }
  }
}
</script>
<style scoped  lang="less">
.jianyi {
  color: #a2a2a2;
}
</style>

