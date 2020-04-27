<template>
  <div class="app-container">
    <el-form
      :inline="true"
      :model="query"
    >
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="医院名称"
          style="width: 200px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="query.registeredDate"
          type="daterange"
          range-separator="-"
          start-placeholder="注册时间"
          end-placeholder="至"
        />
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
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >添加医院</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      :border="false"
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <HospitalOffice :hospital-guid="scope.row.hospitalGuid" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="序列"
        width="65"
      >
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="医院名称"
        width="210"
        align="left"
      >
        <template slot-scope="scope">
          <span class="beyond-hiding">{{ scope.row.hosName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医院地址">
        <template slot-scope="scope">
          <span class="beyond-hiding">{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系方式"
        width="140"
        align="left"
      >
        <template slot-scope="scope">
          {{ scope.row.contactNumber }}
        </template>
      </el-table-column>
      <el-table-column
        label="注册时间"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          {{ toDateString(scope.row.registeredDate, '{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          {{ toDateString(scope.row.creationDate) }}
        </template>
      </el-table-column>
      <el-table-column
        label="是否启用?"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <!-- <el-button
            @click="handleUpdate(scope.row)"
            size="mini"
            :disabled="!$checkPermission('handle_update')"
          >编辑</el-button>
          <el-button
            @click="handleDelete(scope.row)"
            type="danger"
            size="mini"
            :disabled="!$checkPermission('handle_delete')"
          >删除</el-button>-->

          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作菜单
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-edit"
                :command="{ type: `payment`, row: scope.row }"
                :disabled="scope.row.typeCode == 'matedata' || !$checkPermission('handle_payment')"
                @click="handlePayment(scope.row)"
              >
                付款码
              </el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-edit"
                :command="{ type: `edit`, row: scope.row }"
                :disabled="scope.row.typeCode == 'matedata' || !$checkPermission('handle_update')"
                @click="handleUpdate(scope.row)"
              >
                编辑
              </el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-delete-solid"
                :command="{ type: `delete`, row: scope.row }"
                :disabled="!$checkPermission('handle_delete')"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-refresh-right"
                :command="{ type: `reset`, row: scope.row }"
                :disabled="!$checkPermission('handle_reset')"
                @click="handleAdd(scope.row.dicGuid)"
              >
                重置密码
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
      :append-to-body="false"
      style
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="right"
        label-suffix="："
        label-width="100px"
        :style="{ width: 90 + '%' }"
      >
        <el-form-item
          label="Logo"
          prop="logoGuid"
        >
          <upload-img2
            :dialog-visible="true"
            :value.sync="form.info.logoGuid"
            :url.sync="form.info.logoUrl"
            :img-width="150"
            :not-cutting="true"
            :size="500"
          />
          <span class="jianyi">{{ `建议尺寸：300*300像素。大小在500k内` }}</span>
        </el-form-item>
        <el-form-item
          label="医院名称"
          prop="hosName"
        >
          <el-input
            v-model="form.info.hosName"
            placeholder="医院名称"
            :maxlength="7"
          />
        </el-form-item>
        <el-form-item
          label="医院简介"
          prop="hosAbstract"
        >
          <el-input
            v-model="form.info.hosAbstract"
            type="textarea"
            placeholder="医院简介"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="医院地址"
              prop="location"
            >
              <el-input
                v-model="form.info.location"
                placeholder="医院地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="经维度"
              prop="longitudelongitude"
            >
              <map-input :value.sync="form.info.longitudelongitude" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="医院等级"
              prop="hosLevel"
            >
              <el-select
                v-model="form.info.hosLevel"
                placeholder="请选择医院等级"
                style="width:100%"
              >
                <el-option
                  v-for="item in HospitalLevel"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="联系方式"
              prop="contactNumber"
            >
              <el-input
                v-model="form.info.contactNumber"
                placeholder="联系方式"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="标签"
              prop="hosTag"
            >
              <el-input
                v-model="form.info.hosTag"
                placeholder="标签"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="是否医院"
              prop="isHospital"
            >
              <el-switch
                v-model="form.info.isHospital"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="导诊链接"
              prop="guidanceUrl"
            >
              <el-input
                v-model="form.info.guidanceUrl"
                placeholder="请输入导诊链接地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="外联链接"
              prop="externalLink"
            >
              <el-input
                v-model="form.info.externalLink"
                placeholder="请输入外联链接地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="账号"
              prop="account"
            >
              <el-input
                v-model="form.info.account"
                placeholder="请输入账号"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="密码"
              prop="password"
            >
              <el-input
                v-model="form.info.password"
                type="password"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.info.password != defaultPassword"
              label="确认密码"
              prop="password2"
            >
              <el-input
                v-model="form.info.password2"
                type="password"
                placeholder="请输入确认密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="注册时间"
              prop="registeredDate"
            >
              <el-date-picker
                v-model="form.info.registeredDate"
                type="date"
                style="width:100%"
                placeholder="选择注册日期"
                :picker-options="opRegisteredDate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="显示顺序"
              prop="sort"
            >
              <el-input-number
                v-model="form.info.sort"
                :min="1"
                :max="1000"
                label="显示顺序"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="是否启用"
              prop="enable"
            >
              <el-switch
                v-model="form.info.enable"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="允许搜索"
              prop="visibility"
            >
              <el-switch
                v-model="form.info.visibility"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              label="医院详细"
              prop="content"
            >
              <tinymce
                :height="300"
                :value.sync="form.info.content"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-slot:footer>
        <el-button
          icon="el-icon-close"
          @click="form.dialogEditVisible = false"
        >关闭</el-button>
        <el-button
          type="primary"
          icon="iconfont icon-save"
          @click="handleSave"
        >保存</el-button>
      </template>
    </Drawer>
    <Drawer
      :title="form.dialogPaymentTitle"
      :dialog-visible.sync="form.dialogPaymentVisible"
      width="500px"
      :append-to-body="false"
      style
    >
      <div class="qrcodeImg">
        <vue-qr
          :text="form.paymentText"
          :size="350"
          :dot-scale="1"
          :margin="0"
        />
        <!-- <a href="javascript:;" class="downloadImg" @click="handleDownloadImg">下载到本地</a> -->
        <el-button
          type="primary"
          icon="iconfont icon-save"
          @click="handleDownloadImg"
        >下载到本地</el-button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import {
  GetHospitalPageAsync,
  GetHospitalLevel,
  AddHospitalAsync,
  UpdateHospitalAsync,
  DisableEnableHospitalAsync,
  GetHospitalInfoAsync,
  DeleteHospitalAsync,
  ResetPasswordAsync,
  GetUserWeChatQRCodeAsync
} from '@/api/Hospital'
import Pagination from '@/components/Pagination'
import UploadImg2 from '@/components/UploadImg2/Index'
import VueQr from 'vue-qr'
import { parseTime } from '@/utils/index'
import HospitalOffice from './HospitalOffice'
import Tinymce from '@/components/Tinymce'
import { md5 } from '@/utils/md5'
import Drawer from '@/components/Drawer/Index'
import mapInput from '@/views/Commons/map/mapInput'

export default {
  components: {
    Pagination,
    UploadImg2,
    Tinymce,
    HospitalOffice,
    Drawer,
    mapInput,
    VueQr
  },
  data() {
    const validateq = (rule, value, callback) => {
      if (value != this.form.info.password) {
        callback(new Error('密码不相同'))
      } else {
        callback()
      }
    }
    return {
      defaultPassword: '~~~~~~~~~~~~',
      query: {
        name: null,
        registeredDate: null,
        registeredBeginDate: null,
        registeredEndDate: null,
        sortField: null,
        isAscending: true,
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      list: [],
      HospitalLevel: [],
      listLoading: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加医院',
        dialogEditStatus: 'add',
        dialogPaymentVisible: false,
        dialogPaymentTitle: '付款码',
        paymentText: 'https://www.baidu.com',
        // 表单数据
        info: {
          hospitalGuid: null,
          logoGuid: null,
          logoUrl: null,
          content: '',
          hosName: null,
          hosTag: null,
          hosAbstract: null,
          hosLevel: null,
          location: null,
          visibility: true,
          registeredDate: null,
          enable: true,
          contactNumber: null,
          sort: 0,
          guidanceUrl: null,
          password2: null,
          password: null,
          account: null,
          longitudelongitude: [],
          isHospital: false
        },
        // 表单验证
        rules: {
          password: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 20, min: 6, message: '长度必须6-20', trigger: 'change' }
          ],
          password2: [{ trigger: 'blur', validator: validateq }],
          account: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 20, message: '长度不能超过20', trigger: 'change' }
          ],
          hosName: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 7, message: '不能超过7', trigger: 'change' }
          ],
          hosAbstract: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 200, message: '不能超过200', trigger: 'change' }
          ],
          location: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 100, message: '不能超过100', trigger: 'change' }
          ],
          registeredDate: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          hosLevel: [{ required: true, message: '必填', trigger: 'change' }],
          contactNumber: [
            { max: 20, message: '不能超过20', trigger: 'change' }
          ],
          hosTag: [{ max: 100, message: '不能超过100', trigger: 'change' }],
          guidanceUrl: [
            { max: 500, message: '不能超过500', trigger: 'change' }
          ],
          externalLink: [
            { max: 500, message: '不能超过500', trigger: 'change' }
          ]
        }
      },
      opRegisteredDate: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  watch: {},
  created() {
    var t = this
    t.handleFilter()
    GetHospitalLevel({}).then(response => {
      t.HospitalLevel = response.data
    })
  },
  methods: {
    // 获取云医二维码
    GetUserWeChatQRCode(id) {
      GetUserWeChatQRCodeAsync({
        hospiltalGuid: id
      })
        .then(response => {
          if (response.data.url) {
            this.form.paymentText = response.data.url
            this.form.dialogPaymentVisible = true
          }
          console.log(response)
        })
        .catch(err => {})
    },
    getInfo(hospitalGuid, rob) {
      var t = this
      GetHospitalInfoAsync({
        hospitalGuid
      }).then(response => {
        Object.assign(t.form.info, response.data)
        const { longitude, latitude } = response.data
        this.form.info.password = this.defaultPassword
        this.form.info.password2 = this.defaultPassword
        this.form.info.longitudelongitude = [longitude, latitude]
        debugger
        if (rob) rob()
      })
    },
    handleDownloadImg() {
      const imgurl = document.querySelector('.qrcodeImg img').src
      this.downloadFile('付款码', imgurl)
    },
    // 下载图片
    downloadFile(fileName, content) {
      const aLink = document.createElement('a')
      const blob = this.base64ToBlob(content) // new Blob([content]);

      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)

      // aLink.dispatchEvent(evt);
      aLink.click()
    },
    // base64转blob
    base64ToBlob(code) {
      const parts = code.split(';base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length

      const uInt8Array = new Uint8Array(rawLength)

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: contentType })
    },
    // 获取付款码
    handlePayment(row) {
      console.log(row)
      // this.form.paymentText = ''
      this.GetUserWeChatQRCode(row.hospitalGuid)
    },
    handleFilter() {
      this.listLoading = true
      GetHospitalPageAsync(this.query).then(
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
    // 添加
    handleAdd() {
      this.form.info = {
        visibility: true,
        enable: true,
        contactNumber: null,
        content: '',
        sort: 0
      }
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加医院'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      this.getInfo(row.hospitalGuid, () => {
        this.form.dialogEditVisible = true
        this.form.dialogEditStatus = 'update'
        this.form.dialogEditTitle = '修改医院'
      })
    },
    handleSearch() {
      //  console.log(this.query.registeredDate);
      var t = this
      t.query.pageIndex = 1
      if (t.query.registeredDate && t.query.registeredDate.length > 0) {
        t.query.registeredBeginDate = parseTime(
          t.query.registeredDate[0],
          '{y}-{m}-{d}'
        )
        t.query.registeredEndDate = parseTime(
          t.query.registeredDate[1],
          '{y}-{m}-{d}'
        )
      }
      t.handleFilter()
    },
    handleOrderBy(a) {
      this.query.SortField = a.prop
      this.query.IsAscending = a.order == 'ascending'
      this.handleFilter()
    },
    handleSave() {
      const t = this
      const tempData = Object.assign({}, t.form.info)
      t.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (tempData.password == this.defaultPassword) {
            tempData.password = null
          } else {
            tempData.password = md5(tempData.password).toUpperCase()
            tempData.password2 = md5(tempData.password).toUpperCase()
          }
          tempData.longitude = tempData.longitudelongitude[1]
          tempData.latitude = tempData.longitudelongitude[0]
          if (t.form.dialogEditStatus == 'add') {
            AddHospitalAsync(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()
            })
          } else {
            UpdateHospitalAsync(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()
            })
          }
        }
      })
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableHospitalAsync({
        guid: row.hospitalGuid,
        enable: row.enable
      }).then(response => {
        t.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      var t = this
      t.$confirm('此操作将永久删除该数据, 是否继续?', '确认删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteHospitalAsync(row.hospitalGuid).then(response => {
            t.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            t.handleFilter()
          })
        })
        .catch(() => {
          t.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    toDateString(a, f) {
      return parseTime(new Date(a), f)
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
          guid: row.hospitalGuid
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
    handleCommand(command) {
      switch (command.type) {
        case 'payment':
          this.handlePayment(command.row)
          break
        case 'reset':
          this.handleResetPassword(command.row)
          break
        case 'edit':
          this.handleUpdate(command.row)
          break
        case 'delete':
          this.handleDelete(command.row)
          break
      }
    }
  }
}
</script>
<style>
.jianyi {
  color: #a2a2a2;
}
.qrcodeImg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}
.qrcodeImg img {
  margin-bottom: 50px;
}
</style>
