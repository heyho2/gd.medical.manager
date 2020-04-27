<template>
  <Drawer :title="dialogTitle" :dialog-visible.sync="c_dialogVisible" width="1024px">
    <el-form
      ref="dataForm"
      :rules="form.rules"
      :model="form.info"
      label-position="right"
      label-width="100px"
      label-suffix="："
    >
      <el-form-item label="报表名称" prop="reportName">
        <el-input v-model="form.info.reportName" placeholder="报表名称" />
      </el-form-item>
      <el-form-item label="简介" prop="demand">
        <el-input v-model="form.info.demand" type="textarea" placeholder="简介" />
      </el-form-item>
      <el-form-item label="是否发布" prop="recordStatus">
        <!-- <el-switch v-model="form.info.recordStatus" active-color="#13ce66" inactive-color="#ff4949"></el-switch> -->
        <el-select
          v-model="form.info.recordStatus"
          clearable
          style="width:120px"
          placeholder="请选择类型"
        >
          <el-option
            v-for="item in recordStatuss"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.info.sort" controls-position="right" />
      </el-form-item>
      <el-form-item label="刷选条件" prop="createConditionInfoList">
        <conditionEdit :values.sync="form.info.createConditionInfoList" />
      </el-form-item>
      <el-form-item label="数据列" prop="createColumnInfoList">
        <columnEdit :values.sync="form.info.createColumnInfoList" />
      </el-form-item>
      <el-form-item label="sql" prop="sqlStr">
        <el-input v-model="form.info.sqlStr" type="textarea" :rows="6" placeholder="sql语句" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button icon="el-icon-close" @click="c_dialogVisible = false">关闭</el-button>
      <el-button type="primary" icon="iconfont icon-save" @click="handleSave()">保存</el-button>
    </template>
  </Drawer>
</template>
<script>
import conditionEdit from './conditionEdit'
import columnEdit from './columnEdit'
import Drawer from '@/components/Drawer/Index'
import {
  CreateReport,
  GetConditionListAsync,
  GetOneReport,
  UpdateOneReport
} from '@/api/Report'

export default {
  components: { conditionEdit, columnEdit, Drawer },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '标题'
    },
    guid: { type: String }
  },
  data() {
    const validateConditions = (rule, value, callback) => {
      value.forEach((element, index) => {
        if (!element.valueType) {
          callback(`【数据${index + 1}】类型必填`)
          return
        }
        if (!element.fieldCode) {
          callback(`【数据${index + 1}】字段必填`)
          return
        }
        if (!element.conditionName) {
          callback(`【数据${index + 1}】名称必填`)
          return
        }
      })
      callback()
    }
    const validateColumns = (rule, value, callback) => {
      value.forEach((element, index) => {
        if (!element.valueType) {
          callback(`【数据${index + 1}】类型必填`)
          return
        }
        if (!element.fieldCode) {
          callback(`【数据${index + 1}】字段必填`)
          return
        }
        if (!element.columnName) {
          callback(`【数据${index + 1}】名称必填`)
          return
        }
      })
      callback()
    }
    return {
      recordStatuss: [
        { code: 0, name: `保存` },
        { code: 1, name: `发布` },
        { code: 2, name: `下架` }
      ],
      form: {
        info: {
          themeGuid: null,
          applyUserName: '蔡徐坤',
          reportName: null,
          demand: null,
          createConditionInfoList: [
            {
              conditionName: null,
              fieldCode: null,
              valueType: null,
              valueRange: null,
              sort: 0
            }
          ],
          createColumnInfoList: [
            {
              columnName: null,
              fieldCode: null,
              valueType: null,
              valueRange: null,
              sort: 0
            }
          ],
          sqlStr: null,
          recordStatus: 0,
          platformType: null,
          sort: 0
        },
        info_null: {
          themeGuid: null,
          applyUserName: '蔡徐坤',
          reportName: null,
          demand: null,
          createConditionInfoList: [
            {
              conditionName: null,
              fieldCode: null,
              valueType: null,
              valueRange: null,
              sort: 0
            }
          ],
          createColumnInfoList: [
            {
              columnName: null,
              fieldCode: null,
              valueType: null,
              valueRange: null,
              sort: 0
            }
          ],
          sqlstr: null,
          recordStatus: 0,
          platformType: null,
          sort: 0
        },
        rules: {
          reportName: [
            { required: true, trigger: 'blur', message: '必填' },
            { max: 20, trigger: 'blur', message: '长度不能超过20' }
          ],
          demand: [
            { required: true, trigger: 'blur', message: '必填' },
            { max: 500, trigger: 'blur', message: '长度不能超过500' }
          ],
          merchantPicture: [
            { required: true, trigger: 'blur', message: '必填' }
          ],
          sqlStr: [
            { required: true, trigger: 'blur', message: '必填' },
            { max: 3000, trigger: 'blur', message: '长度不能超过3000' }
          ],
          createConditionInfoList: [
            { trigger: 'blur', validator: validateConditions }
          ],
          createColumnInfoList: [
            { trigger: 'blur', validator: validateColumns }
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
    }
  },
  watch: {
    c_dialogVisible(val) {
      if (!val) return
      if (this.guid) {
        GetOneReport({ themeGuid: this.guid }).then(response => {
          this.form.info = Object.assign(this.form.info, response.data)
          this.form.info.reportName = response.data.name
        })
        GetConditionListAsync({
          themeGuid: this.guid,
          recordType: 'Condition'
        }).then(response => {
          this.form.info.createConditionInfoList = response.data.select(a => {
            return {
              conditionName: a.name,
              fieldCode: a.fieldCode,
              valueType: a.valueType,
              sort: a.sort,
              required: a.required
            }
          })
        })
        GetConditionListAsync({
          themeGuid: this.guid,
          recordType: 'Column'
        }).then(response => {
          this.form.info.createColumnInfoList = response.data.select(a => {
            return {
              columnName: a.name,
              fieldCode: a.fieldCode,
              valueType: a.valueType,
              sort: a.sort,
              required: a.required
            }
          })
        })
      } else {
        this.form.info = Object.assign({}, this.form.info_null)
      }
    }
  },
  created() {},
  methods: {
    handleSave() {
      var t = this
      const tempData = Object.assign({}, t.form.info)
      tempData.createConditionInfoList.map((element, index) => {
        element.sort = index
        return element
      })
      tempData.createColumnInfoList.map((element, index) => {
        element.sort = index
        return element
      })
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.guid) {
            UpdateOneReport(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
              this.c_dialogVisible = false
              this.$emit('onSaveSuccess')
            })
          } else {
            CreateReport(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
              this.c_dialogVisible = false
              this.$emit('onSaveSuccess')
            })
          }
        }
      })
    }
  }
}
</script>
