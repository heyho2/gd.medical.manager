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
                :url.sync="form.info.portraitUrl"
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
            <el-form-item label="职业医院" prop="practisingHospital">
              <el-input v-model="form.info.practisingHospital" placeholder="请输入医院名称(选填)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="form.info.birthday"
                type="date"
                :style="{width:'100%'}"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
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
            <el-form-item label="职称" prop="honor">
              <el-select
                v-model="form.info.titleGuid"
                clearable
                :style="{width:'100%'}"
                placeholder="请选择职称"
              >
                <el-option
                  v-for="item in doctorJobTitles"
                  :key="item.dicGuid"
                  :label="item.configName"
                  :value="item.dicGuid"
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
                :props="{value: 'name',children: 'child',label:'name'}"
                :style="{width:'100%'}"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="医院" prop="hospitalGuid">
              <el-select
                v-model="form.info.hospitalGuid"
                clearable
                placeholder="请选择医院"
                :style="{width:'100%'}"
                @change="handleItemChange"
              >
                <el-option
                  v-for="item in hospitalList"
                  :key="item.guid"
                  :label="item.name"
                  :value="item.guid"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在科室" prop="officeGuid">
              <select-tree
                v-model="form.info.officeGuid"
                style="width:200px"
                placeholder="请选择科室"
                :options="officeList"
                :props="{value: 'guid',label: 'name',parent: 'parentGuid',children: 'children'}"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工号" prop="jobNumber">
              <el-input v-model="form.info.jobNumber" placeholder="工号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否推荐" :rules="[{ required: true}]">
              <el-switch v-model="form.info.isRecommend" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.info.isRecommend" :span="12">
            <el-form-item label="推荐排序" :rules="[{ required: true}]">
              <el-input-number
                v-model="form.info.recommendSort"
                :min="0"
                :max="1000"
                controls-position="right"
                :precision="0"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否启用" :rules="[{ required: true}]">
              <el-switch v-model="form.info.enable" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="擅长" prop="adeptTags">
              <labels-edit :list="form.info.adeptTags" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="荣誉" prop="honor">
              <el-input
                v-model="form.info.honor"
                type="textarea"
                placeholder="请填写获得的荣誉"
                :autosize="{ minRows: 3, maxRows: 4}"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="背景" prop="background">
              <el-input
                v-model="form.info.background"
                type="textarea"
                placeholder="请填写背景"
                :autosize="{ minRows: 3, maxRows: 4}"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="证书" prop="certificates">
              <CertificateEdit :values.sync="form.info.certificates" />
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
import SelectTree from '@/components/SelectTree'
import LabelsEdit from '@/views/Commons/LabelsEdit'
import areaData from '@/utils/china-city-area-zip'
import CertificateEdit from './CertificateEdit'

export default {
  components: {
    UploadImg2,
    SelectTree,
    LabelsEdit,
    CertificateEdit,
    Drawer
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
    doctorGuid: { type: String },
    onSuccess: { type: Function, default: () => {} },
    editStatus: { type: String },
    hospitalList: { type: Array, default: () => [] }
  },
  data() {
    return {
      officeList: [],
      areaData: [],
      doctorJobTitles: [],
      form: {
        certificateList1: [],
        info: {
          userName: null,
          gender: 'M',
          birthday: null,
          identityNumber: null,
          hospitalGuid: null,
          workCity: [],
          practisingHospital: null,
          officeGuid: null,
          titleGuid: null,
          honor: null,
          background: null,
          adeptTags: [],
          doctorGuid: null,
          signatureGuid: null,
          portraitGuid: null,
          portraitUrl: null,
          recommendSort: null,
          phone: null,
          enable: true,
          isRecommend: true,
          workAge: 0,
          certificates: [],
          jobNumber: null
        },
        null_info: {
          userName: null,
          gender: 'M',
          birthday: null,
          identityNumber: null,
          hospitalGuid: null,
          workCity: [],
          practisingHospital: null,
          officeGuid: null,
          titleGuid: null,
          honor: null,
          background: null,
          adeptTags: [],
          doctorGuid: null,
          signatureGuid: null,
          portraitGuid: null,
          portraitUrl: null,
          phone: null,
          enable: true,
          isRecommend: true,
          workAge: 0,
          certificates: [],
          jobNumber: null
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
          merchantName: [
            { required: true, trigger: 'blur', message: '必填' },
            { max: 20, trigger: 'blur', message: '长度不能超过20' }
          ],
          merchantPicture: [
            { required: true, trigger: 'blur', message: '必填' }
          ],
          identityNumber: [
            { required: true, trigger: 'blur', message: '必填' },
            { trigger: 'blur', validator: validatCardNo }
          ],
          birthday: [{ required: true, trigger: 'blur', message: '必填' }],
          portraitGuid: [{ required: true, trigger: 'blur', message: '必填' }],
          gender: [{ required: true, trigger: 'blur', message: '必填' }],
          adeptTags: [{ required: true, trigger: 'blur', message: '必填' }],
          hospitalGuid: [{ required: true, trigger: 'blur', message: '必填' }],
          officeGuid: [{ required: true, trigger: 'change', message: '必填' }],
          honor: [
            { required: true, trigger: 'blur', message: '必填' },
            { max: 200, trigger: 'blur', message: '长度不能超过200' }
          ],
          background: [
            { required: true, trigger: 'blur', message: '必填' },
            { max: 500, trigger: 'blur', message: '长度不能超过500' }
          ],
          certificates: [
            { required: true, trigger: 'blur', message: '必填' },
            {
              trigger: 'blur',
              validator(rule, value, callback) {
                if (value.length == 0) {
                  callback(new Error('必须添加'))
                  return
                }
                value.forEach((element, index) => {
                  if (!element.accessoryGuid) {
                    callback(`【证书${index + 1}】必须上传`)
                    return
                  }
                })
                callback()
              }
            }
          ],
          jobNumber: [
            { required: true, trigger: 'blur', message: '必填' },
            { max: 20, trigger: 'blur', message: '长度不能超过20' }
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
      if (t.doctorGuid) {
        var officeGuid = null
        GetDoctorInfoAsync({ doctorGuid: t.doctorGuid })
          .then(response => {
            Object.assign(t.form.info, response.data)
            officeGuid = response.data.officeGuid
            t.form.info.officeGuid = ''
            GetDoctorCertificateDetailAsync(t.doctorGuid).then(response => {
              t.form.info.certificates = response.data
            })
            return GetHospitalOfficeSelectAsync({
              hospitalGuid: response.data.hospitalGuid
            })
          })
          .then(response => {
            t.officeList = response.data
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve(officeGuid)
              }, 500)
            })
          })
          .then(response => {
            t.form.info.officeGuid = officeGuid
          })
      } else {
        Object.assign(t.form.info, t.form.null_info)
        t.form.info.certificates = t.form.certificateList1.select(a => {
          return {
            certificateGuid: null,
            dicGuid: a.dicGuid,
            configName: a.configName,
            certificateUrl: null,
            accessoryGuid: null
          }
        })
        this.$refs['dataForm'].clearValidate()
      }
    },
    'form.info.hospitalGuid': function(val, oldval) {
      this.form.info.officeGuid = ''
    }
  },
  created() {
    this.areaData = areaData
    GetDoctorJobTitlesAsync().then(response => {
      this.doctorJobTitles = response.data
    })
    GetDoctorCertificateDetailAsync().then(response => {
      this.form.certificateList1 = response.data.map(a => ({
        certificateGuid: null,
        dicGuid: a.dicGuid,
        configName: a.configName,
        certificateUrl: null,
        accessoryGuid: null
      }))
    })
  },
  methods: {
    handleSave() {
      const t = this
      const tempData = Object.assign({}, t.form.info)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (t.editStatus == 'add') {
            AddDoctorInfoAsync(tempData).then(response => {
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
            UpdateDoctorInfoAsync(tempData).then(response => {
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
/deep/.drawer {
  max-width: 100%;
  width: 900px;
  display: flex;
  flex-direction: row;
  header {
    display: flex;
    justify-content: space-between;
    align-content: center;
    line-height: 50px;
    padding: 2px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    .close {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-weight: bold;
    }
  }
  main {
    padding: 5px;
    flex: 1;
    overflow-y: auto;
    height: calc(100% - 110px);
  }
  footer {
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    height: 55px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

