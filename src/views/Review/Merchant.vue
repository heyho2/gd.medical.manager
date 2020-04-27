<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="商户名"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.status" clearable placeholder="状态">
          <merchant-status type="selectOption" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="注册时间"
          end-placeholder="至"
          class="filter-item"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :border="false"
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <review-record
            :owner-guid="scope.row.merchantGuid"
            :type="'Merchant'"
            :creation-date="scope.row.creationDate"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="商户名字" width="180" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.merchantName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="210" align="left">
        <template slot-scope="scope">{{ scope.row.telephone||'暂无' }}</template>
      </el-table-column>
      <el-table-column label="注册手机" width="110" align="left">
        <template slot-scope="scope">
          <span class="assss">{{ scope.row.phone||'暂无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册人" width="110" align="left">
        <template slot-scope="scope">
          <span class="assss">{{ scope.row.userName||'暂无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经营范围" align="left" min-width="210">
        <template slot-scope="scope">
          <labels :list="getScopes(scope.row.scope)" />
        </template>
      </el-table-column>

      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          <merchant-status type="statusName" :data="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="160" align="center">
        <template slot-scope="scope">{{ toDateString(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="最后审核时间" width="160" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.lastUpdatedDate?toDateString(scope.row.lastUpdatedDate):'-' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            :disabled="!$checkPermission('handle_view')"
            size="mini"
            @click="handleUpdate(scope.row)"
          >查看</el-button>
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
    <Drawer
      :title="form.dialogEditTitle"
      :dialog-visible.sync="form.dialogEditVisible"
      width="1024px"
      style
    >
      <template>
        <el-form
          ref="dataForm"
          :rules="form.rules"
          :model="form.info"
          label-position="right"
          label-width="150px"
          width="90%"
          label-suffix="："
        >
          <el-form-item label="商户名字" prop="account">
            <span>{{ form.info.merchantName }}</span>
          </el-form-item>

          <el-form-item label="经营范围" prop="account">
            <div class="assss">
              <labels :list="getScopes(form.info.scope)" />
            </div>
          </el-form-item>

          <el-form-item label="联系人" prop="account">
            <span>{{ form.info.telephone||'暂无' }}</span>
          </el-form-item>
          <el-form-item label="状态" prop="account">
            <merchant-status type="statusName" :data="form.info.status" />
          </el-form-item>
          <el-form-item label="签名" prop="account">
            <el-card
              style="display: inline-block;margin-right: 10px;"
              :body-style="{ padding: '0px' }"
            >
              <gd-img
                :src="form.info.signatureUrl"
                title="签名"
                preview="2"
                class="image"
                :style="{height:'200px'}"
              />
              <div style="padding: 0px; text-align: center;">
                <span>签名</span>
              </div>
            </el-card>
          </el-form-item>
          <el-form-item label="证件" prop="account">
            <el-card
              v-for="(item,index) in form.info.certificateList"
              :key="index"
              :style="{display: 'inline-block','margin-right': '10px'}"
              :body-style="{ padding: '0px' }"
            >
              <gd-img
                :src="item.pictureUrl"
                :title="item.certificateName"
                preview="1"
                class="image"
                :style="{height:'200px'}"
              />
              <div style="padding: 0px; text-align: center;">
                <span>{{ item.certificateName }}</span>
              </div>
            </el-card>
          </el-form-item>
          <el-form-item label="经营范围许可证" prop="account">
            <el-card
              v-for="(item,index) in form.info.businessScopeLicenseList"
              :key="index"
              :style="{display: 'inline-block','margin-right': '10px'}"
              :body-style="{ padding: '0px' }"
            >
              <gd-img
                :src="item.pictureUrl"
                :title="item.name"
                preview="1"
                class="image"
                :style="{height:'200px'}"
              />
              <div style="padding: 0px; text-align: center;">
                <span>{{ item.name }}</span>
              </div>
            </el-card>
          </el-form-item>
          <el-form-item label="未通过原因">
            <el-input v-model="form.info.rejectReason" type="textarea" placeholder="驳回时必须填写未通过原因" />
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:footer>
        <el-button
          v-if="form.info.status!=`approved`"
          v-permission="'handle_review_approved'"
          type="primary"
          icon="iconfont icon-save"
          @click="handleReviewApproved"
        >通过</el-button>
        <el-button
          v-if="form.info.status!=`reject`"
          v-permission="'handle_review_reject'"
          type="danger"
          icon="iconfont icon-save"
          @click="handleReviewReject"
        >驳回</el-button>
        <el-button icon="el-icon-close" @click="form.dialogEditVisible = false">关闭</el-button>
      </template>
    </Drawer>
  </div>
</template>

<script>
import {
  GetReviewMerchantPageAsync,
  ReviewRejectMerchantAsync,
  ReviewApprovedMerchantAsync,
  GetBusinessScopeLicenseListAsync
} from '@/api/Merchant'
import Drawer from '@/components/Drawer/Index'
import ReviewRecord from '@/views/Review/ReviewRecord'
import { GetCertificateListAsync } from '@/api/Certificate'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import Labels from '@/views/Commons/Labels'
import MerchantStatus from '@/views/Commons/MerchantStatus'
import GdImg from '@/views/Commons/GdImg'

export default {
  components: {
    Pagination,
    ReviewRecord,
    Labels,
    MerchantStatus,
    GdImg,
    Drawer
  },
  data() {
    return {
      date: null,
      query: {
        name: null,
        status: null,
        beginDate: null,
        endDate: null,
        sortField: null,
        isAscending: true,
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      list: [],
      listLoading: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          merchantGuid: null,
          merchantName: null,
          status: null,
          signatureGuid: null,
          signatureUrl: null,
          creationDate: null,
          scope: null,
          telephone: null,
          certificateList: [],
          rejectReason: null,
          businessScopeLicenseList: []
        },
        // 表单验证
        rules: {}
      }
    }
  },
  watch: {
    date(val) {
      const t = this
      if (val && val.length > 0) {
        t.query.beginDate = parseTime(val[0], '{y}-{m}-{d}')
        t.query.endDate = parseTime(val[1], '{y}-{m}-{d}')
      } else {
        t.query.beginDate = null
        t.query.endDate = null
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    // 加载表格数据
    handleFilter() {
      this.listLoading = true
      GetReviewMerchantPageAsync(this.query).then(
        response => {
          this.list = response.data.currentPage
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        },
        error => {
          this.listLoading = false
        }
      )
    },
    // 修改
    handleUpdate(row) {
      const t = this
      t.form.info = Object.assign({}, row) // copy obj
      GetBusinessScopeLicenseListAsync(row.merchantGuid).then(response => {
        t.form.info.businessScopeLicenseList = response.data
        GetCertificateListAsync({ OwnerGuid: row.merchantGuid, type: 1 }).then(
          response => {
            t.form.info.certificateList = response.data
            t.form.dialogEditVisible = true
            t.form.dialogEditStatus = 'update'
            t.form.dialogEditTitle = '查看商户'
          }
        )
      })
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    getScopes(scope) {
      let scopes = []
      if (scope) {
        scopes = scope.split(',')
      }
      return scopes
    },
    toDateString(a, f) {
      return parseTime(new Date(a), f)
    },
    handleReviewApproved() {
      var t = this
      ReviewApprovedMerchantAsync({
        OwnerGuid: t.form.info.merchantGuid
      }).then(response => {
        if (response.code === 0) {
          t.$notify({
            title: '成功',
            message: '审核成功',
            type: 'success',
            duration: 2000
          })
          t.form.dialogEditVisible = false
          t.handleFilter()
        }
      })
    },
    handleReviewReject() {
      var t = this
      if (!t.form.info.rejectReason) {
        this.$message.error('必须填写驳回原因哦')
        return
      }
      ReviewRejectMerchantAsync({
        OwnerGuid: t.form.info.merchantGuid,
        RejectReason: t.form.info.rejectReason
      }).then(response => {
        if (response.code === 0) {
          t.$notify({
            title: '成功',
            message: '审核成功',
            type: 'success',
            duration: 2000
          })
          t.form.dialogEditVisible = false
          t.handleFilter()
        }
      })
    }
  }
}
</script>
<style scoped>
.image {
  display: block;
  cursor: pointer;
}
.assss {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
