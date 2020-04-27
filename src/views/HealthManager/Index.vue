<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.KeyWord"
          placeholder="名字/手机号"
          style="width: 200px;"
          class="filter-item"
          clearable
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="注册时间"
          end-placeholder="至"
          class="filter-item"
          clearable
        />
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
        >添加健康管理师</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      :border="false"
      highlight-current-row
      :row-class-name="tableRowClassName"
    >
      <el-table-column align="center" label="序列" type="index" width="65" />
      <el-table-column label="照片" align="center" width="70">
        <template slot-scope="scope">
          <div class="avatar">
            <img
              v-if="scope.row.portraitImg"
              :src="scope.row.portraitImg"
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
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <div class="beyond-hiding">
            <span>{{ scope.row.userName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="手机" align="center">
        <template slot-scope="scope">
          <span class="beyond-hiding" :title="scope.row.phone">{{ scope.row.phone || '暂无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已绑定用户" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="  text-decoration: underline;"
            icon="el-icon-user"
            @click="handleBinding(scope.row)"
          >{{ scope.row.count || '0' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center">
        <template slot-scope="scope">{{ toDateString(scope.row.registrationTime) }}</template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template slot-scope="scope">
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
    <HealthyEdit
      :dialog-visible.sync="edit.dialogEditVisible"
      :manager-guid="edit.managerGuid"
      :on-success="onSuccessEdit"
      :edit-status="edit.dialogEditStatus"
      :dialog-title="dialogTitle"
    />
    <MemberLists :dialog-visible.sync="dialogMemberEditVisible" :manager-guid="managerGuid" />
  </div>
</template>

<script>
import {
  GetHealthManagers,
  UpdateStatus
} from '@/api/HealthDocumentation/HealthManager'
import {
  GetHospitalAllSelectAsync,
  GetHospitalOfficeSelectAsync
} from '@/api/Hospital'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import HealthyEdit from './Components/HealthyEdit'
import MemberLists from './Components/MemberLists'

// import Sidebar from '@/components/Sidebar/Index'
export default {
  components: {
    Pagination,
    HealthyEdit,
    MemberLists
  },
  data() {
    return {
      query: {
        KeyWord: null,
        RegistrationTime: null,
        EndTime: null,
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      list: [],
      listLoading: true,
      dialogTitle: '编辑健康管理师',
      date: [],
      managerGuid: null,
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
      dialogMemberEditVisible: false,
      edit: {
        dialogEditStatus2: false,
        dialogEditVisible: false,
        doctorGuid: null,
        dialogEditStatus: 'add',
        managerGuid: null
      }
    }
  },
  /* managerGuid*/
  watch: {
    date(val) {
      const t = this
      if (val && val.length > 0) {
        t.query.RegistrationTime = parseTime(val[0], '{y}-{m}-{d}')
        t.query.EndTime = parseTime(val[1], '{y}-{m}-{d}')
      } else {
        t.query.RegistrationTime = null
        t.query.EndTime = null
      }
    },
    edit: {
      handler(v) {
        if (!v.dialogEditVisible) {
          this.handleFilter()
        }
      },
      deep: true
    },
    dialogMemberEditVisible(v) {
      console.log(v)
      if (!v) {
        this.handleFilter()
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    // 绑定用户
    handleBinding(row) {
      this.dialogMemberEditVisible = true
      this.managerGuid = row.managerGuid
    },
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
      GetHealthManagers(this.query).then(response => {
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
      this.edit.managerGuid = row.managerGuid
      this.edit.dialogEditVisible = true
      this.edit.dialogEditStatus = 'update'
      this.dialogTitle = '编辑康管理师信息'
    },
    handleUpdate(row) {
      this.form.info = Object.assign({}, row) // copy obj
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'update'
      this.form.dialogEditTitle = '修改'
    },
    handleAdd() {
      this.edit.managerGuid = null
      // this.edit.dialogEditStatus2 = true
      this.edit.dialogEditVisible = true
      this.edit.dialogEditStatus = 'add'
      this.dialogTitle = '添加健康管理师'
    },
    // 禁用/启用
    handleDisable(row) {
      console.log(row)
      var t = this
      UpdateStatus({
        managerGuid: row.managerGuid
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
    }
  }
}
</script>
<style lang="less" scoped>
.el-table .disable-row {
  img {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
}
/deep/.el-button [class*="el-icon-"] + span {
  margin-left: 5px;
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
