<template>
  <Drawer :title="c_dialogTitle" :dialog-visible.sync="c_dialogVisible" width="1024px" style>
    <template>
      <el-row>
        <el-col :span="10">渲染</el-col>
        <el-col :span="12">
          <el-form
            ref="dataForm"
            :rules="form.rules"
            :model="form.info"
            label-position="right"
            label-width="100px"
            label-suffix=":"
            style="margin-right:20px"
          >
            <el-divider content-position="left">内容设置</el-divider>
            <el-form-item label="副标题" prop="phone">
              <el-input v-model="form.info.phone" placeholder="副标题">
                <el-color-picker slot="append" v-model="color1" size="mini" />
              </el-input>
            </el-form-item>
            <el-form-item label="优惠对象" prop="phone">
              <el-input v-model="form.info.phone" placeholder="优惠对象">
                <el-color-picker slot="append" v-model="color1" size="mini" />
              </el-input>
            </el-form-item>
            <el-form-item label="优惠时间" prop="phone">
              <el-input v-model="form.info.phone" placeholder="优惠时间">
                <el-color-picker slot="append" v-model="color1" size="mini" />
              </el-input>
            </el-form-item>
            <el-form-item label="领取方式" prop="phone">
              <el-input v-model="form.info.phone" placeholder="领取方式">
                <el-color-picker slot="append" v-model="color1" size="mini" />
              </el-input>
            </el-form-item>
            <el-form-item label="备注" prop="phone">
              <el-input v-model="form.info.phone" placeholder="备注">
                <el-color-picker slot="append" v-model="color1" size="mini" />
              </el-input>
            </el-form-item>
            <el-divider content-position="left">跳转设置</el-divider>
            <el-form-item label="跳转链接" prop="phone">
              <el-input v-model="form.info.phone" placeholder="副标题">
                <el-radio slot="prepend" v-model="radio" :label="1" />
              </el-input>
            </el-form-item>
            <el-form-item label="跳转链接" prop="phone">
              <el-input v-model="form.info.phone" placeholder="副标题">
                <el-radio slot="prepend" v-model="radio" :label="2" />
              </el-input>
            </el-form-item>
            <el-form-item label="跳转链接" prop="phone">
              <el-input v-model="form.info.phone" placeholder="副标题">
                <el-radio slot="prepend" v-model="radio" :label="3" name />
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
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
import { parseTime } from '@/utils/index'

export default {
  components: {
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
          certificates: []
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
          certificates: []
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
      }
    },
    'form.info.hospitalGuid': function(val, oldval) {
      this.form.info.officeGuid = ''
    }
  },
  created() {
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

