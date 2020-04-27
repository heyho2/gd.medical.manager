<template>
  <Drawer :title="c_dialogTitle" :dialog-visible.sync="c_dialogVisible" width="1024px" style>
    <template>
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="right"
        label-width="100px"
        label-suffix=":"
        style="margin-right:20px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="头像" prop="portraitGuid">
              <UploadImg2
                :value.sync="form.info.portraitGuid"
                :url.sync="form.info.portraitImg"
                :img-width="140"
                :img-height="140"
                :auto-crop-width="300"
                :auto-crop-height="300"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="form.info.userName" placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.info.phone" placeholder="联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证" prop="identityNumber" style="width:100%">
              <el-input v-model="form.info.identityNumber" placeholder="身份证号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="jobNumber">
              <el-input v-model="form.info.jobNumber" placeholder="请输入工号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.info.gender">
                <el-radio label="M">男</el-radio>
                <el-radio label="F">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职业等级" prop="occupationGrade">
              <el-select
                v-model="form.info.occupationGrade"
                clearable
                :style="{ width: '100%' }"
                placeholder="请选择职业等级"
              >
                <el-option
                  v-for="item in occupationGradeList"
                  :key="item.code"
                  :label="item.text"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作城市" prop="workCity">
              <el-cascader
                v-model="form.info.workCity"
                :options="areaData"
                placeholder="请选择工作城市"
                :props="{ value: 'name', children: 'child', label: 'name' }"
                :style="{ width: '100%' }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否启用" :rules="[{ required: true }]">
              <el-switch v-model="form.info.enable" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="证书" prop="qualificationCertificateGuids">
              <!-- <CertificateEdit :values.sync="form.info.qualificationCertificateGuids" /> -->
              <upload-img2-more
                :values.sync="form.info.qualificationCertificateGuids"
                :add-button-text="'新增证书'"
                :button-text="'选择证书'"
                :img-height="150"
                :auto-crop-width="725"
                :auto-crop-height="320"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template v-slot:footer>
      <el-button icon="el-icon-close" @click="c_dialogVisible = false">关闭</el-button>
      <el-button type="primary" icon="iconfont icon-save" @click="handleSave()">保存</el-button>
    </template>
  </Drawer>
</template>

<script>
import {
  GetDoctorInfoAsync,
  GetDoctorJobTitlesAsync,
  UpdateDoctorInfoAsync,
  GetDoctorCertificateDetailAsync,
  SaveDoctorCertificateDetailAsync,
  AddDoctorInfoAsync
} from '@/api/Doctor'
import {
  CreateHealthManager,
  UpdateHealthManager,
  GetHealthManager
} from '@/api/HealthDocumentation/HealthManager'

import {
  GetHospitalAllSelectAsync,
  GetHospitalOfficeSelectAsync
} from '@/api/Hospital'
import {
  validatPhone,
  validatCardNo,
  validatRegName,
  validatPassword
} from '@/utils/validate'

import Drawer from '@/components/Drawer/Index'
import UploadImg2 from '@/components/UploadImg2/Index'
import { parseTime } from '@/utils/index'
import areaData from '@/utils/china-city-area-zip'
import CertificateEdit from './CertificateEdit'
import UploadImg2More from '@/components/UploadImg2/More'
export default {
  components: {
    UploadImg2,
    Drawer,
    CertificateEdit,
    UploadImg2More
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '医生详细'
    },
    managerGuid: { type: String },
    onSuccess: { type: Function, default: () => {} },
    editStatus: { type: String },
    hospitalList: { type: Array, default: () => [] }
  },
  data() {
    return {
      areaData: [],
      occupationGradeList: [
        {
          code: 'FirstLevel',
          text: '一级健康管理师'
        },
        {
          code: 'SecondLevel',
          text: '二级健康管理师'
        },
        {
          code: 'ThirdLevel',
          text: '三级健康管理师'
        }
      ],
      form: {
        certificateList1: [],
        info: {
          enable: true,
          userName: null,
          jobNumber: null,
          gender: 'M',
          phone: null,
          identityNumber: null,
          province: null,
          city: null,
          district: null,
          occupationGrade: null,
          portraitGuid: null,
          qualificationCertificateGuids: [],
          portraitImg: null,
          workCity: []
        },
        null_info: {
          enable: true,
          userName: null,
          jobNumber: null,
          gender: 'M',
          phone: null,
          identityNumber: null,
          province: null,
          city: null,
          district: null,
          occupationGrade: null,
          portraitGuid: null,
          qualificationCertificateGuids: [],
          portraitImg: null,
          workCity: []
        },
        rules: {
          userName: [
            { required: true, trigger: 'blur', message: '必填' },
            { trigger: 'blur', validator: validatRegName },
            { max: 20, trigger: 'blur', message: '长度不能超过20' }
          ],
          phone: [
            { required: true, trigger: 'blur', message: '必填' },
            { trigger: 'blur', validator: validatPhone }
          ],
          gender: [{ required: true, trigger: 'blur', message: '必填' }],
          jobNumber: [
            { required: true, trigger: 'blur', message: '必填' },
            { max: 13, trigger: 'blur', message: '长度不能超过13' }
          ],
          identityNumber: [
            { required: true, trigger: 'blur', message: '必填' },
            { trigger: 'blur', validator: validatCardNo }
          ],
          portraitGuid: [{ required: true, trigger: 'blur', message: '必填' }],
          occupationGrade: [
            { required: true, trigger: 'blur', message: '必填' }
          ],
          qualificationCertificateGuids: [
            { required: true, trigger: 'blur', message: '必填' }
          ]
        }
      }
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
    },
    c_dialogTitle: {
      get() {
        return this.dialogTitle
      },
      set(val) {
        this.$emit('update:dialogTitle', val)
      }
    }
  },
  watch: {
    editStatus(val) {},
    dialogVisible(val) {
      if (!val) return
      var t = this
      if (t.managerGuid) {
        GetHealthManager({ managerGuid: t.managerGuid }).then(response => {
          Object.assign(t.form.info, response.data)
          t.form.info.workCity = [
            response.data.province,
            response.data.city,
            response.data.district
          ]
          t.form.info.qualificationCertificateGuids = response.data.certificates.map(
            a => {
              return {
                value: a.certificateGuid,
                url: a.certificateImg
              }
            }
          )
        })
      } else {
        t.form.info = JSON.parse(JSON.stringify(t.form.null_info))
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    }
  },
  created() {
    this.areaData = areaData
    this.form.certificateList1 = [
      {
        certificateGuid: null,
        certificateUrl: null,
        accessoryGuid: null
      },
      {
        certificateGuid: null,
        certificateUrl: null,
        accessoryGuid: null
      }
    ]

    // 获取证书
  },
  methods: {
    handleSave() {
      const t = this
      const tempData = Object.assign({}, t.form.info)
      if (tempData.workCity.length >= 3) {
        tempData.province = tempData.workCity[0]
        tempData.city = tempData.workCity[1]
        tempData.district = tempData.workCity[2]
      }

      tempData.qualificationCertificateGuids = tempData.qualificationCertificateGuids.map(
        a => a.value
      )
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (t.editStatus == 'add') {
            CreateHealthManager(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              t.c_dialogVisible = false
              t.onSuccess()
              Object.assign(t.form.info, t.form.null_info)
            })
          } else {
            UpdateHealthManager(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              t.c_dialogVisible = false
              t.onSuccess()
              Object.assign(t.form.info, t.form.null_info)
            })
          }
        }
      })
    },
    handleItemChange(val) {
      this.form.info.hospitalGuid = val
      GetHospitalOfficeSelectAsync({
        hospitalGuid: val
      }).then(response => {
        this.officeList = response.data
      })
    },
    addCertificate(url, val) {
      var ce
      ce = this.form.certificateList[this.index_u]
      SaveDoctorCertificateDetailAsync({
        certificateGuid: ce.certificateGuid,
        ownerGuid: this.doctorGuid,
        dicGuid: ce.dicGuid,
        configName: ce.configName,
        certificateUrl: url,
        accessoryGuid: val
      }).then(response => {
        ce.certificateGuid = response.data
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
