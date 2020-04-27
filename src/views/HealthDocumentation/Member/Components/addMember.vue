<template>
  <Drawer :title="c_dialogTitle" :dialog-visible.sync="c_dialogVisible" width="640px" style>
    <el-form
      ref="dataForm"
      :rules="form.rules"
      :model="form.info"
      label-position="right"
      label-width="120px"
      style="margin-left: 20px;margin-right: 30px;"
      label-suffix="："
    >
      <el-divider content-position="left" style="background-color: #fff;">注册手机</el-divider>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.info.phone" placeholder="请输入注册手机号" />
      </el-form-item>
      <el-divider content-position="left" style="background-color: #fff;">基础信息</el-divider>
      <el-form-item label="真实姓名" prop="userName">
        <el-input v-model="form.info.userName" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="form.info.birthday"
          style="width:100%"
          type="date"
          placeholder="选择生日"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.info.gender">
          <el-radio label="M">男</el-radio>
          <el-radio label="F">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身份证号码" prop="identityNumber">
        <el-input
          v-model="form.info.identityNumber"
          placeholder="请输入身份证号码"
          @change="changeIdentityNumber"
        />
      </el-form-item>
      <el-form-item
        v-for="(item,index) in HealthInfoBasicData"
        :key="index"
        :label="item.subjectName"
      >
        <el-input
          v-if="item.subjectName=='你的兴趣爱好'&&item.informationType==4"
          v-model="item.resultValue"
          maxlength="255"
          show-word-limit
          placeholder="你的兴趣爱好"
          type="textarea"
        />
        <el-input
          v-else-if="item.informationType==4"
          v-model="item.resultValue"
          :placeholder="item.subjectPromptText||'请填写'"
        />
        <el-input-number
          v-if="item.informationType==3"
          v-model="item.resultValue"
          :placeholder="item.subjectPromptText"
          :controls="false"
        />

        <el-radio-group v-if="item.informationType==1" v-model="item.optionGuids">
          <el-radio
            v-for="(item2,index2) in item.options"
            :key="index2"
            :label="item2.optionGuid"
          >{{ item2.optionLabel }}</el-radio>
        </el-radio-group>
        <el-switch v-if="item.informationType==2" v-model="item.resultValue" />
        <el-checkbox-group v-if="item.informationType==5" v-model="item.optionGuids">
          <el-checkbox
            v-for="(item2,index2) in item.options"
            :key="index2"
            :label="item2.optionGuid"
          >{{ item2.optionLabel }}</el-checkbox>
        </el-checkbox-group>

        <span
          v-if="item.subjectUnit"
          style="margin-left: 10px;color: #606266;"
        >{{ item.subjectUnit }}</span>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" @click="c_dialogVisible = false">关闭</el-button>
      <el-button type="primary" icon="iconfont icon-save" @click="handleSave">保存</el-button>
    </div>
  </Drawer>
</template>

<script>
import {
  validatPhone,
  validatCardNo,
  validatRegName,
  validatPassword
} from '@/utils/validate'
import { GetHealthInfoBasicDataAsync } from '@/api/HealthDocumentation/HealthInformation'
import {
  CreateConsumerHealthInfo,
  GetConsumersPageList
} from '@/api/HealthDocumentation/Member'
import Drawer from '@/components/Drawer/Index'

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
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      EducationalLevels: [
        { code: 1, value: '初中' },
        { code: 2, value: '高中' },
        { code: 3, value: '小学' },
        { code: 4, value: '大专/大专级以上' }
      ],
      HealthInfoBasicData: null,
      HealthInfoBasicData2: null,
      form: {
        info: {
          phone: '',
          userName: '',
          gender: 'M',
          birthday: '',
          identityNumber: ''
        },
        null_info: {
          phone: '',
          userName: '',
          gender: 'M',
          birthday: '',
          identityNumber: ''
        },
        rules: {
          phone: [
            { required: true, trigger: 'blur', message: '必填' },
            { trigger: 'blur', validator: validatPhone },
            {
              trigger: 'blur',
              validator(rule, value, callback) {
                GetConsumersPageList({
                  keyWord: value,
                  pageIndex: 1,
                  pageSize: 1
                })
                  .then(res => {
                    if (
                      res.data &&
                      res.data.currentPage &&
                      res.data.currentPage.length > 0
                    ) {
                      callback(new Error('该手机号已经注册'))
                    } else {
                      callback()
                    }
                  })
                  .catch(() => {
                    callback(new Error('验证失败'))
                  })
              }
            }
          ],
          userName: [
            { max: 10, trigger: 'blur', message: '字符长度不能大于10' }
          ],
          identityNumber: [{ trigger: 'blur', validator: validatCardNo }]
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
    dialogVisible(val) {
      if (val) {
        Object.assign(this.form.info, this.form.null_info)
        this.HealthInfoBasicData = JSON.parse(
          JSON.stringify(this.HealthInfoBasicData2)
        )
      }
    }
  },
  created() {
    GetHealthInfoBasicDataAsync().then(response => {
      this.HealthInfoBasicData = response.data.map(element => {
        if (
          element.informationType === 5 ||
          element.informationType === 1 ||
          element.informationType === 2
        ) {
          element.optionGuids = []
        }
        element.resultValue = null

        return element
      })
      this.HealthInfoBasicData2 = JSON.parse(
        JSON.stringify(this.HealthInfoBasicData)
      )
      console.log(this.HealthInfoBasicData)
    })
  },
  methods: {
    handleSave() {
      var t = this
      const tempData = Object.assign({}, t.form.info)
      tempData.informations = this.HealthInfoBasicData.map(item => {
        return {
          informationGuid: item.informationGuid,
          informationType: item.informationType,
          optionGuids: JSON.stringify(
            item.informationType == 1 ? [item.optionGuids] : item.optionGuids
          ),
          resultValue: item.resultValue
        }
      })
      t.$refs['dataForm'].validate(valid => {
        if (valid) {
          CreateConsumerHealthInfo(tempData).then(response => {
            t.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            t.c_dialogVisible = false
            this.$emit('onSuccess', tempData)
            Object.assign(t.form.info, t.form.null_info)
          })
        }
      })
    },
    changeIdentityNumber(val) {
      var sBirthday =
        val.substr(6, 4) +
        '-' +
        Number(val.substr(10, 2)) +
        '-' +
        Number(val.substr(12, 2))
      this.form.info.birthday = sBirthday
    }
  }
}
</script>

<style lang="less" scoped>
.custom {
  max-width: 520px;
}
/deep/.el-divider {
  background-color: #fff;
}
/deep/.el-divider__text {
  font-size: 16px;
  margin: 0 -46px;
  color: #555555;
}
</style>
