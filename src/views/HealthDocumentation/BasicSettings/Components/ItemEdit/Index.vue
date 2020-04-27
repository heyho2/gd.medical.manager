<template>
  <div>
    <div v-if="title" style="border-bottom: 1px solid #dcdfe6;">
      <span style="line-height: 40px;margin: 0 20px;">{{ title }}</span>
    </div>
    <el-form
      ref="dataForm"
      :rules="form.rules"
      :model="c_question"
      label-position="right"
      label-width="120px"
      label-suffix=":"
      size="mini"
      style="margin:20px"
    >
      <el-form-item label="题目类型" prop="informationType">
        <el-radio-group v-model="radio" @change="informationTypeChange">
          <el-radio-button
            v-for="(item ,index) in Object.keys(informationTypeEnum)"
            :key="index"
            :label="informationTypeEnum[item].key"
          >{{ informationTypeEnum[item].value }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="题目名称" prop="subjectName">
        <el-input v-model="c_question.subjectName" placeholder="请输入题目名称" />
      </el-form-item>
      <el-form-item
        v-show="[informationTypeEnum.Enum.key,informationTypeEnum.Bool.key,informationTypeEnum.Array.key].some(a=>a==c_question.informationType)"
        label="答案选项"
        prop="options"
      >
        <Answer
          :list.sync="c_question.options"
          :disable="c_question.informationType==informationTypeEnum.Bool.key"
        />
      </el-form-item>
      <el-form-item
        v-if="c_question.informationType==informationTypeEnum.String.key"
        label="是否单行文本"
        prop="isSingleLine"
      >
        <el-checkbox v-model="c_question.isSingleLine">（如‘姓名’）</el-checkbox>
      </el-form-item>
      <el-form-item
        v-if="c_question.informationType==informationTypeEnum.String.key"
        label="答案提示文字"
        prop="subjectPromptText"
      >
        <el-input v-model="c_question.subjectPromptText" placeholder="请输入答案提示文字" />
      </el-form-item>

      <el-form-item
        v-if="c_question.informationType==informationTypeEnum.Decimal.key"
        label="单位"
        prop="subjectUnit"
      >
        <el-input v-model="c_question.subjectUnit" placeholder="请输入单位" />
      </el-form-item>
      <div style="text-align: center;">
        <el-button type="primary" size="mini" icon="iconfont icon-save" @click="handleSave()">完成编辑</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Answer from './Answer'
import { informationTypeEnum, informationTypeEnum2 } from '../enum'
export default {
  components: { Answer },
  props: {
    data: {
      type: Object
    },
    title: {
      type: String
    }
  },
  data() {
    const validateAnswers = (rule, value, callback) => {
      value.forEach((element, index) => {
        if (!element.optionLabel) {
          callback(`【选项名称${index + 1}】必填`)
          return
        }
        if (
          value.some(
            (a, i) => a.optionLabel == element.optionLabel && index != i
          )
        ) {
          callback(`【选项名称${index + 1}】名字冲突`)
          return
        }
      })
      callback()
    }
    return {
      radio: null,
      form: {
        rules: {
          informationType: [
            { required: true, trigger: 'blur', message: '必填' }
          ],
          subjectName: [
            { required: true, trigger: 'blur', message: '必填' },
            { max: 30, trigger: 'blur', message: '长度不能超过30' }
          ],
          options: [{ trigger: 'blur', validator: validateAnswers }],
          subjectUnit: [
            { required: true, trigger: 'blur', message: '必填' },
            { max: 7, trigger: 'blur', message: '长度不能超过7' }
          ],
          subjectPromptText: [
            // { required: true, trigger: "blur", message: "必填" },
            { max: 80, trigger: 'blur', message: '长度不能超过80' }
          ],
          phone: [{ required: true, trigger: 'blur', message: '必填' }]
        }
      },
      informationTypeEnum: informationTypeEnum,
      informationTypeEnum2: informationTypeEnum2,
      selectQuestion: {}
    }
  },
  computed: {
    c_question: {
      get() {
        return this.data
      }
    }
  },
  watch: {
    'data.informationType'(val) {
      this.radio = val
    }
  },
  methods: {
    handleSave() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$emit('onSuccess', this.c_question)
        }
      })
    },
    informationTypeChange(val) {
      console.log('val:', val)
      console.log(
        'this.c_question.informationType:',
        this.c_question.informationType
      )
      this.$set(this.c_question, `informationType`, val)
      switch (val) {
        case informationTypeEnum.Bool.key:
          this.$set(this.c_question, `options`, [
            {
              optionLabel: '是',
              isDefault: false
            },
            {
              optionLabel: '否',
              isDefault: false
            }
          ])
          break
        case informationTypeEnum.String.key:
        case informationTypeEnum.Decimal.key:
          this.c_question.options = []
          break
        default:
          this.c_question.options = [
            {
              optionLabel: null,
              isDefault: false
            }
          ]
          break
      }
    }
  }
}
</script>

