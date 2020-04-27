<template>
  <Drawer :title="`批量绑定用户`" :dialog-visible.sync="c_dialogVisible" width="940px" style>
    <el-form
      ref="dataForm"
      style="padding:10px"
      :rules="form.rules"
      label-position="right"
      label-suffix="："
      :model="form.info"
    >
      <el-form-item prop="healthManagerGuid" label="健康管理师">
        <el-select
          v-model="form.info.healthManagerGuid"
          placeholder="请选择健康管理师"
          @change="handleChangehealthManager"
        >
          <el-option
            v-for="item in HealthManagers"
            :key="item.managerGuid"
            :label="item.userName"
            :value="item.managerGuid"
          />
        </el-select>
      </el-form-item>
      <el-divider />
      <el-form-item prop="userGuids">
        <div class="search">
          <span style="color: #0000FF;flex: 1;">当前已选择{{ form.addUserGuids.length }}位用户</span>
          <!-- 当前已选择{{ form.info.userGuids.length }}位用户-->
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
          :row-class-name="tableRowClassName"
          @select="handleSelection"
          @select-all="handleSelectionAll"
        >
          <el-table-column type="selection" width="55" :selectable="handleSelectable" />
          <el-table-column align="left" label="会员名">
            <template slot-scope="scope">{{ scope.row.name || '-' }}</template>
          </el-table-column>
          <el-table-column align="left" label="已绑定的健康管理师" width="200">
            <template slot-scope="scope">
              <span
                v-if="scope.row.managerGuid"
              >{{ scope.row.managerName }}({{ scope.row.managerPhone }})</span>
              <span v-else>未绑定</span>
            </template>
          </el-table-column>

          <el-table-column align="left" label="手机号" width="120">
            <template slot-scope="scope">{{ scope.row.phone || '-' }}</template>
          </el-table-column>
          <el-table-column align="center" label="性别" width="80">
            <template slot-scope="scope">{{ scope.row.gender=='M'?'男':'女' }}</template>
          </el-table-column>
          <el-table-column align="center" label="年龄" width="80">
            <template slot-scope="scope">{{ scope.row.age >= 0? scope.row.age : '-' }}</template>
          </el-table-column>
          <el-table-column align="center" label="注册时间" width="160">
            <template
              slot-scope="scope"
            >{{ scope.row.creationDate? parseTime(scope.row.creationDate): '-' }}</template>
          </el-table-column>
        </el-table>
        <pagination
          :total="grid.total"
          :page.sync="query.pageIndex"
          :limit.sync="query.pageSize"
          :border="false"
          @pagination="handleFilter"
        />
      </el-form-item>
    </el-form>
    <!-- {{ form.info.userGuids }} -->
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" @click="c_dialogVisible = false">关闭</el-button>
      <el-popover v-model="visible" placement="top" width="260">
        <span>当前已选择{{ form.addUserGuids.length }}位用户，是否确认绑定？</span>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="handleSave">确定</el-button>
        </div>
        <el-button slot="reference" type="primary" icon="iconfont icon-save">确定绑定</el-button>
      </el-popover>
    </div>
  </Drawer>
</template>

<script>
import {
  GetHealthManagerConsumers,
  GetHealthManagers,
  BatchBindHealthManager,
  GetSimpleHealthManagers
} from '@/api/HealthDocumentation/HealthManager'
import { GetConsumersPageList } from '@/api/HealthDocumentation/Member'
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
    }
  },
  data() {
    return {
      HealthManagers: [],
      date: [],
      form: {
        addUserGuids: [],
        info: {
          healthManagerGuid: null,
          userGuids: []
        },
        rules: {
          healthManagerGuid: [
            { required: true, trigger: 'blur', message: '必填' }
          ]
          //   userGuids: [{ required: true, trigger: "blur", message: "必填" }]
        }
      },
      grid: {
        currentPage: [],
        loading: false,
        total: 0
      },
      query: {
        managerGuid: null,
        keyWord: '',
        registrationTime: null,
        endTime: null,
        bindTime: null,
        endTime: null,
        pageIndex: 1,
        pageSize: 10
      },
      visible: false
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
        this.form.info = { healthManagerGuid: null, userGuids: [] }
        this.handleFilter()
        this.form.addUserGuids = []
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
    GetSimpleHealthManagers().then(res => {
      this.HealthManagers = res.data
    })
  },
  methods: {
    handleFilter() {
      this.grid.loading = true
      GetConsumersPageList(this.query)
        .then(res => {
          Object.assign(this.grid, res.data)
          this.grid.loading = false
          this.$nextTick(function() {
            this.handleChecked() // 每次更新了数据，触发这个函数即可。
          })
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
    handleSelection(selection, row) {
      const selected = selection.length && selection.indexOf(row) !== -1
      let list = this.form.info.userGuids
      var index = list.indexOf(row.userGuid)
      if (selected) {
        list.push(row.userGuid)
        this.form.addUserGuids.push(row.userGuid)
      } else {
        var index = list.indexOf(row.userGuid)
        list = list.splice(index, 1)
        this.form.addUserGuids.splice(
          this.form.addUserGuids.indexOf(row.userGuid),
          1
        )
      }
    },
    handleChecked() {
      this.$refs.multipleTable.clearSelection()
      this.form.info.userGuids = this.form.info.userGuids || []
      this.grid.currentPage.forEach(item => {
        if (this.form.info.userGuids.includes(item.userGuid)) {
          this.$refs.multipleTable.toggleRowSelection(item, true)
        }
      })
    },
    handleSelectionAll(selection) {
      var list = this.form.info.userGuids || []
      this.grid.currentPage
        .filter(row => !row.managerGuid)
        .forEach(item => {
          const guid = item.userGuid
          var selected = selection.some(a => a.userGuid == guid)
          if (selected) {
            var index = list.indexOf(guid)
            if (index == -1) {
              list.push(guid)
              this.form.addUserGuids.push(guid)
            }
          } else {
            var index = list.indexOf(guid)
            if (index > -1) {
              list.splice(index, 1)
              this.form.addUserGuids.splice(
                this.form.addUserGuids.indexOf(guid),
                1
              )
            }
          }
        })
    },
    handleChangehealthManager(val) {
      this.grid.loading = true
      GetHealthManagerConsumers({
        managerGuid: val,
        pageIndex: 1,
        pageSize: 99999
      })
        .then(res => {
          this.form.info.userGuids = res.data.currentPage.map(
            a => a.consumerGuid
          )
          this.grid.loading = false
          this.$nextTick(function() {
            this.handleChecked() // 每次更新了数据，触发这个函数即可。
          })
          this.visible = false
          this.form.addUserGuids = []
        })
        .catch(() => {
          this.grid.loading = false
        })
    },
    handleSave() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          BatchBindHealthManager({
            managerGuid: this.form.info.healthManagerGuid,
            consumerGuids: this.form.info.userGuids
          }).then(res => {
            this.$notify({
              title: '成功',
              message: '绑定成功',
              type: 'success',
              duration: 2000
            })
            this.handleFilter()
            this.visible = false
            this.form.addUserGuids = []
          })
        }
      })
    },
    handleSelectable(row, index) {
      return !row.managerGuid && this.form.info.healthManagerGuid
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.managerGuid || !this.form.info.healthManagerGuid) {
        return 'disable-row'
      }
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
/deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #7faef5;
  border-color: #dcdee4;
}
.search {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
