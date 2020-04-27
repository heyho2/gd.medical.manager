<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="用户名"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="query.status"
          clearable
          placeholder="状态"
          @keyup.enter.native="handleSearch"
        >
          <doctor-status type="selectOption" />
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
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <review-record
            :owner-guid="scope.row.doctorGuid"
            :type="'doctors'"
            :creation-date="scope.row.creationDate"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="一寸照" align="center" width="100">
        <template slot-scope="scope">
          <div class="avatar">
            <img
              v-if="scope.row.portraitUrl"
              :src="scope.row.portraitUrl"
              preview="4"
              :alt="scope.row.userName"
              :title="scope.row.userName"
            >
            <img
              v-else
              src="@/assets/DEFORTDoctor.jpg"
              :alt="scope.row.userName"
              :title="scope.row.userName"
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="医生名字" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.gender=='M'?'男':'女' }}</template>
      </el-table-column>
      <el-table-column label="医院" min-width="110" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.hospitalName||"暂无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在科室" align="left" min-width="110">
        <template slot-scope="scope">{{ scope.row.officeName||"暂无" }}</template>
      </el-table-column>
      <el-table-column label="工作城市" align="left" min-width="110">
        <template slot-scope="scope">{{ scope.row.workCity||"暂无" }}</template>
      </el-table-column>
      <!-- <el-table-column label="工作经验" align="right" width="110">
        <template slot-scope="scope">{{ scope.row.workAge }}</template>
      </el-table-column>-->
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          <doctor-status type="statusName" :data="scope.row.status" />
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
            size="mini"
            :disabled="!$checkPermission('handle_view')"
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
          <el-form-item label="医生照片" prop="userName">
            <gd-img
              :src="form.info.portraitUrl||'@/assets/DEFORTDoctor.jpg'"
              :title="form.info.userName"
              style="width:100px"
              preview="3"
            />
          </el-form-item>
          <el-form-item label="医生名字" prop="userName">
            <span>{{ form.info.userName||"暂无" }}</span>
          </el-form-item>
          <el-form-item label="医院" prop="hospitalName">
            <span>{{ form.info.hospitalName||"暂无" }}</span>
          </el-form-item>
          <el-form-item label="所在科室" prop="officeName">
            <span>{{ form.info.officeName||"暂无" }}</span>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <doctor-status type="statusName" :data="form.info.status" />
          </el-form-item>
          <el-form-item label="执业医院">
            <span>{{ form.info.hospitalName||"暂无" }}</span>
          </el-form-item>
          <el-form-item label="签名图片" prop="account">
            <el-card
              :style="{display: 'inline-block','margin-right': '10px'}"
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
                :src="item.src"
                :title="item.title"
                preview="1"
                class="image"
                :style="{height:'200px'}"
              />
              <div style="padding: 0px; text-align: center;">
                <span>{{ item.title }}</span>
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
  GetReviewDoctorPageAsync,
  ReviewRejectDoctorAsync,
  ReviewApprovedDoctorAsync,
  GetDoctorCertificateDetailAsync
} from '@/api/Doctor'
import Drawer from '@/components/Drawer/Index'
import { GetCertificateListAsync } from '@/api/Certificate'
import ReviewRecord from './ReviewRecord'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import DoctorStatus from '@/views/Commons/DoctorStatus'
import GdImg from '@/views/Commons/GdImg'

export default {
  components: { Pagination, ReviewRecord, DoctorStatus, GdImg, Drawer },
  data() {
    return {
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
      date: null,
      total: 0,
      list: [],
      listLoading: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          doctorGuid: null,
          hospitalGuid: null,
          hospitalName: null,
          hospitalPic: null,
          officeGuid: null,
          officeName: null,
          portraitUrl: null,
          userName: null,
          workCity: null,
          background: null,
          title: null,
          adeptTags: null,
          workAge: 0,
          honor: null,
          practisingHospital: null,
          status: null,
          certificateList: [],
          rejectReason: null
        }
      }
    }
  },
  watch: {
    date(val) {
      const t = this
      if (t.date && t.date.length > 0) {
        t.query.beginDate = parseTime(t.date[0], '{y}-{m}-{d}')
        t.query.endDate = parseTime(t.date[1], '{y}-{m}-{d}')
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
      GetReviewDoctorPageAsync(this.query).then(
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
      GetDoctorCertificateDetailAsync(row.doctorGuid).then(response => {
        t.form.info.certificateList = []
        response.data.forEach(item => {
          t.form.info.certificateList.push({
            src: item.certificateUrl,
            msrc: item.certificateUrl,
            alt: item.configName,
            title: item.configName,
            w: 1200,
            h: 900
          })
        })
        t.form.dialogEditVisible = true
        t.form.dialogEditStatus = 'update'
        t.form.dialogEditTitle = '查看医生'
      })
    },
    // 搜索
    handleSearch() {
      var t = this
      t.query.pageIndex = 1
      this.handleFilter()
    },
    toDateString(a, f) {
      return parseTime(new Date(a), f)
    },
    handleReviewApproved() {
      var t = this
      ReviewApprovedDoctorAsync({
        OwnerGuid: t.form.info.doctorGuid
      }).then(response => {
        t.$notify({
          title: '成功',
          message: '审核成功',
          type: 'success',
          duration: 2000
        })
        t.form.dialogEditVisible = false
        t.handleFilter()
      })
    },
    handleReviewReject() {
      var t = this
      if (!t.form.info.rejectReason) {
        this.$message.error('必须填写驳回原因哦')
        return
      }
      ReviewRejectDoctorAsync({
        OwnerGuid: t.form.info.doctorGuid,
        RejectReason: t.form.info.rejectReason
      }).then(response => {
        t.$notify({
          title: '成功',
          message: '审核成功',
          type: 'success',
          duration: 2000
        })
        t.form.dialogEditVisible = false
        t.handleFilter()
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.enable === false) {
        return 'disable-row'
      }
      return ''
    }
  }
}
</script>
<style scoped>
.image {
  display: block;
  cursor: pointer;
}
.avatar {
  display: flex;
  width: 60px;
  height: 60px;
  background-color: #57d3b9;
  border-radius: 50%;
  overflow: hidden;
  justify-content: center;
}
.avatar img {
  object-fit: cover;
  vertical-align: top;
  width: 100%;
  cursor: pointer;
}
</style>

