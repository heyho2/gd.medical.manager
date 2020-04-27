<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input v-model="query.ProductName" clearable placeholder="商品名称" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.ProductCode" clearable placeholder="商品编码" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.MerchantGuid" clearable filterable placeholder="请选择商户">
          <el-option
            v-for="item in merchantSelect"
            :key="item.guid"
            :label="item.name"
            :value="item.guid"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="grid.listLoading"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="grid.list"
      :border="false"
      fit
      :row-class-name="tableRowClassName"
      highlight-current-row
    >
      <el-table-column align="center" label="序列" type="index" width="55" />
      <el-table-column label="产品名称" min-width="140" align="left">
        <template slot-scope="scope">{{ scope.row.productName }}</template>
      </el-table-column>
      <el-table-column label="商户名称" min-width="140" align="left">
        <template slot-scope="scope">
          <span class="beyond-hiding">{{ scope.row.merchantName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品类型" width="140" align="left">
        <template slot-scope="scope">
          <span class="beyond-hiding">{{ productForms[scope.row.productForm] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品编码" width="160" align="left">
        <template
          slot-scope="scope"
        >{{ scope.row.productForm=="Service"?'-':scope.row.productCode }}</template>
      </el-table-column>
      <el-table-column label="所属分类名称" width="140" align="left">
        <template slot-scope="scope">{{ scope.row.categoryName }}</template>
      </el-table-column>

      <el-table-column label="价格" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column label="库存" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.productForm=="Service"?'-': scope.row.inventory }}</template>
      </el-table-column>
      <el-table-column label="销量" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.saleCount }}</template>
      </el-table-column>
      <el-table-column label="商品状态" width="80" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.platformOnSale? (scope.row.onSale?"在售":"已下架"):"已下架" }}</template>
      </el-table-column>
      <el-table-column label="有效期" width="120" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.productForm=="Service"? scope.row.effectiveDays===0?'永久有效': `${scope.row.effectiveDays}天`:'-' }}</template>
      </el-table-column>
      <el-table-column label="是否推荐首页" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.recommend"
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @change="handleRecommend(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序" width="110" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model=" scope.row.sort "
            style="width:100%"
            size="mini"
            controls-position="right"
            :min="1"
            :max="1000"
            @change="handleChangeSort(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.platformOnSale"
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @change="handlePlatformOnSale(scope.row)"
          />
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
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import {
  ProductCenterAsync,
  UpdateOnlieCategory,
  UpdateRecommendSort,
  UpdateRecommend
} from '@/api/Product'
import { GetMerchantSelectAsync } from '@/api/Merchant'

import { parseTime } from '@/utils/index'
export default {
  components: { Pagination },
  data: () => ({
    query: {
      pageIndex: 1,
      pageSize: 10,
      ProductName: null,
      ProductCode: null,
      MerchantGuid: null,
      CategoryName: null,
      ProductStatus: null
    },
    grid: {
      total: 0,
      list: [],
      listLoading: false
    },
    productForms: {
      Service: '服务类',
      Physical: '实体类'
    },
    merchantSelect: []
  }),
  created() {
    this.handleFilter()
    GetMerchantSelectAsync().then(response => {
      this.merchantSelect = response.data
      setTimeout(() => {}, 200)
    })
  },
  methods: {
    handleFilter() {
      this.grid.listLoading = true
      ProductCenterAsync(this.query).then(
        response => {
          this.grid.list = response.data.currentPage
          this.grid.total = response.data.total
          setTimeout(() => {
            this.grid.listLoading = false
          }, 200)
        },
        error => {
          this.grid.listLoading = false
        }
      )
    },
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    parseTime,
    handlePlatformOnSale(row) {
      UpdateOnlieCategory({ productGuid: row.productGuid }).then(response => {
        this.$notify({
          title: '成功',
          message: '成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleChangeSort(row) {
      UpdateRecommendSort({
        productGuid: row.productGuid,
        sort: row.sort
      }).then(response => {
        this.$notify({
          title: '成功',
          message: '成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (!row.platformOnSale) {
        return 'disable-row'
      }
      return ''
    },
    handleRecommend(row) {
      UpdateRecommend({ productGuid: row.productGuid }).then(response => {
        this.$notify({
          title: '成功',
          message: '成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
