<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="医生名字"
          style="width: 200px;"
          class="filter-item"
          clearable
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="query.phone"
          placeholder="手机"
          style="width: 200px;"
          class="filter-item"
          clearable
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="hospitalGuid"
          placeholder="请选择医院"
          clearable
          @keyup.enter.native="handleSearch"
        >
          <el-option
            v-for="item in hospitalList"
            :key="item.guid"
            :label="item.name"
            :value="item.guid"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-form-item>
          <select-tree
            v-model="query.officeGuid"
            placeholder="请选择科室"
            :options="officeList"
            :props="{value: 'guid',label: 'name',parent: 'parentGuid',children: 'children'}"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          class="filter-item"
          type
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >添加医生</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_export'"
          class="filter-item"
          type
          icon="el-icon-printer"
          @click="handleDownload"
        >导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      :border="false"
      fit
      highlight-current-row
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-tabs tab-position="top">
            <el-tab-pane label="积分详细信息">
              <IntegralInfo :guid="scope.row.doctorGuid" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序列" type="index" width="65" />

      <el-table-column label="一寸照" align="center" width="70">
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
      <el-table-column label="医生名字" width="120" align="center">
        <template slot-scope="scope">
          <div class="beyond-hiding">
            <span>{{ scope.row.userName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="在线状态" width="50" align="center">
        <template slot-scope="scope">
          <div class="beyond-hiding">
            <img
              :src="`${scope.row.presenceIcon}&t=${new Date().getTime()}`"
              title="在线状态"
              width="20"
              onerror="this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACdklEQVRYR+2XP2gTURzHv79LWsWKWoci6CCo1EHQQcShnbTNJSWUklwgdw7+ARHETioOCgFdap3UQQSpiJdALlokJLnY0SKii4KDRR0EHVSwKq34p7mfpG1CEnNJXnJ2ym3He9/v9/O+PN67IzT56Ib5CEDfsnxaU+T+ZqyoGVFeoxsml2o1RW7KS1gUjWf6WHJpYOtEGTxJN8jK6WrIOy2yqIYBYrHMVnbTdQaGagUQkGKp46QWOPCuEZCGAPRJcx8WkATQ04gpgE9ww6+NyE/rza8LEE1kdzLzEwDr65lVjH8jov1q0POqTmP2w+l0etXsvPQCQK9geGH6THeXtdvn8/2y09dsQDcy5wG62GT4sowvaIr3kjBAMplc8/1nxwcAG1oDwNd1q/9s9vv9P6r52DagxzOHQTTRYviSnPmIFvLeFgKIJswoM8JOABAhpgZlVRTgDTO2OQTwVg3K24UAdMOcA9DlBACAeU2R14oClJ31rYLY3RX2m7DismkDtBtoN7CiDUSN7CkGX201tFRPoFFV8Vyr9PznHIjdmxqyrNwDAC4nAQDkJMk1HA4MpMrBSt70yYd7sGDlP7erHpsOAM3BLfVrI4PPC17FBibiqU2d5HoGYIsDQbUs3lOne686fPBjflIR4G4ie5mYz/zn8EV7iaSxcHDwXBlA1DDHGDi7EgBMNH4o6FnMKjZw5362x5VDHOD875bTG7CwrhwDj3+zFTga8n0uA1iJlQt9D9gB6Yb5BUC3zfispsgbRRZT98ek0kxPZMfBfLpqCNEVLegR2sjCAJEIS727po4z8zGAdyyB0GsiujXzcuBmJEKWSAN/AflR0iFfghnfAAAAAElFTkSuQmCC'"
            >
          </div>
        </template>
      </el-table-column>

      <el-table-column label="手机" width="110" align="center">
        <template slot-scope="scope">
          <span class="beyond-hiding" :title="scope.row.phone">{{ scope.row.phone||"暂无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在科室" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.officeName||"暂无" }}</template>
      </el-table-column>
      <el-table-column label="医院" mix-width="110" align="left">
        <template slot-scope="scope">
          <span
            class="beyond-hiding"
            :title="scope.row.hospitalName"
          >{{ scope.row.hospitalName||"暂无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="right" width="80">
        <template slot-scope="scope">{{ scope.row.totalPoints||0 }}</template>
      </el-table-column>
      <el-table-column label="咨询量" align="right" width="80">
        <template slot-scope="scope">{{ scope.row.advisoryQty||0 }}</template>
      </el-table-column>
      <el-table-column label="推广量" align="right" width="80">
        <template slot-scope="scope">{{ scope.row.recommendCount||0 }}</template>
      </el-table-column>
      <el-table-column label="文章量" align="right" width="80">
        <template slot-scope="scope">{{ scope.row.articleQty||0 }}</template>
      </el-table-column>
      <el-table-column label="粉丝" align="right" width="80">
        <template slot-scope="scope">{{ scope.row.fansQty||0 }}</template>
      </el-table-column>
      <el-table-column label="注册时间" width="160" align="center">
        <template slot-scope="scope">{{ toDateString( scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="是否上线" align="center" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否推荐" align="center" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isRecommend"
            @change="handleRecommend(scope.row)"
            :disabled="!$checkPermission('handle_update')"
          ></el-switch>
        </template>
      </el-table-column>-->
      <!-- <el-table-column label="重置密码" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click="handleResetPassword(scope.row)" type="primary" size="mini">重置</el-button>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            :disabled="!$checkPermission('handle_view')"
            @click="handleUpdate(scope.row)"
          >查看</el-button>
          <!-- <el-button @click="handleOffline(scope.row)" type="text" size="small">强制下线</el-button> -->
          <el-button
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @click="handleEdit(scope.row)"
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
    <DoctorsView
      :dialog-visible.sync="form.dialogEditVisible"
      :dialog-title="form.dialogEditTitle"
      :info="form.info"
    />
    <DoctorsEdit
      :hospital-list="hospitalList"
      :dialog-visible.sync="edit.dialogEditVisible"
      :doctor-guid="edit.doctorGuid"
      :on-success="onSuccessEdit"
      :edit-status="edit.dialogEditStatus"
      :dialog-title="dialogTitle"
    />
  </div>
</template>

<script>
import {
  GetDoctorPageAsync,
  DisableEnableDoctorAsync,
  RecommendDoctorAsync,
  ResetPasswordAsync,
  ExportDoctorIntegralAsync
} from '@/api/Doctor'
import {
  GetHospitalAllSelectAsync,
  GetHospitalOfficeSelectAsync
} from '@/api/Hospital'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import SelectTree from '@/components/SelectTree'
import DoctorsView from './Components/DoctorsView'
import DoctorsEdit from './Components/DoctorsEdit'
import IntegralInfo from './Components/IntegralInfo'

// import Sidebar from '@/components/Sidebar/Index'
export default {
  components: {
    Pagination,
    DoctorsView,
    SelectTree,
    DoctorsEdit,
    IntegralInfo
  },
  data() {
    return {
      query: {
        name: null,
        hospitalGuid: null,
        pjone: null,
        officeGuid: null,
        beginDate: null,
        endDate: null,
        sortField: null,
        isAscending: true,
        pageIndex: 1,
        pageSize: 10
      },
      hospitalGuid: null,
      hospitalList: [],
      officeList: [],
      total: 0,
      list: [],
      listLoading: true,
      dialogTitle: '编辑医生信息',
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          account: null,
          password: null,
          enable: 1
        }
      },
      edit: {
        dialogEditStatus2: false,
        dialogEditVisible: false,
        doctorGuid: null,
        dialogEditStatus: 'add'
      }
    }
  },
  watch: {
    hospitalGuid(val) {
      this.query.hospitalGuid = val
      GetHospitalOfficeSelectAsync({
        hospitalGuid: val
      }).then(response => {
        this.officeList = response.data
      })
    }
  },
  created() {
    this.handleFilter()
    GetHospitalAllSelectAsync({}).then(response => {
      this.hospitalList = response.data
    })
  },
  methods: {
    // /children长度等于0则变成null
    _toChildrenNull(list) {
      const t = this
      if (list && list.length > 0) {
        list.forEach(item => {
          if (item.children && item.children.length == 0) {
            item.children = null
          } else {
            if (item.children && item.children.length > 0) {
              t._toChildrenNull(item.children)
            }
          }
        })
      }
    },
    // 加载表格数据
    handleFilter() {
      GetDoctorPageAsync(this.query).then(response => {
        this.list = response.data.currentPage
        this.total = response.data.total
      })
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    handleEdit(row) {
      this.edit.doctorGuid = row.doctorGuid
      this.edit.dialogEditVisible = true
      this.edit.dialogEditStatus = 'update'
      this.dialogTitle = '编辑医生信息'
    },
    handleUpdate(row) {
      this.form.info = Object.assign({}, row) // copy obj
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'update'
      this.form.dialogEditTitle = '修改'
    },
    handleAdd() {
      this.edit.doctorGuid = null
      // this.edit.dialogEditStatus2 = true
      this.edit.dialogEditVisible = true
      this.edit.dialogEditStatus = 'add'
      this.dialogTitle = '添加医生'
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableDoctorAsync({
        guid: row.doctorGuid,
        enable: row.enable
      }).then(response => {
        if (response.code === 0) {
          t.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 推荐
    handleRecommend(row) {
      var t = this
      RecommendDoctorAsync({
        guid: row.doctorGuid,
        isRecommend: row.isRecommend
      }).then(response => {
        t.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 重置密码
    handleResetPassword(row) {
      var t = this
      t.$confirm('确定重置密码为‘123456’？', '确认重置', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ResetPasswordAsync({
          doctorGuid: row.doctorGuid
        }).then(response => {
          t.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    toDateString(a, f) {
      return parseTime(new Date(a), f)
    },

    tableRowClassName({ row, rowIndex }) {
      if (row.enable === false) {
        return 'disable-row'
      }
      return ''
    },
    onSuccessEdit() {
      var t = this
      t.handleFilter()
    },
    handleDownload() {
      ExportDoctorIntegralAsync(this.query).then(response => {
        if (response.data.items.length == 0) {
          return this.$message({
            type: 'info',
            message: '没有数据导出'
          })
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '医生名字',
            '手机',
            '医院',
            '所在科室',
            '总积分',
            '积分收入',
            '积分支出',
            '注册时间'
          ]
          const filterVal = [
            'userName',
            'phone',
            'hospitalName',
            'officeName',
            'totalPoints',
            'earnPoints',
            'usePoints',
            'creationDate'
          ]
          const data = this.formatJson(filterVal, response.data.items)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '医生积分',
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      var t = this
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'creationDate') {
            return t.toDateString(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
<style lang="less">
.el-table .disable-row {
  background: #f5f7fa;
  color: #b5b4b4;
  img {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
}
</style>

<style scoped>
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

