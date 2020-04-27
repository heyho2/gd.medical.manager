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
      <el-form-item label="题目类型" prop="questionType">
        <el-radio-group v-model="radio" @change="changeQuestionType">
          <el-radio-button
            v-for="(item ,index) in Object.keys(questionTypeEnum)"
            :key="index"
            :label="questionTypeEnum[item].key"
          >{{ questionTypeEnum[item].value }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="题目名称" prop="questionName">
        <el-input v-model="c_question.questionName" placeholder="请输入题目名称" />
      </el-form-item>
      <el-form-item
        v-show="this.radio == questionTypeEnum.Enum.key ||this.radio === questionTypeEnum.Bool.key ||this.radio === questionTypeEnum.Array.key"
        label="答案选项"
        prop="answers"
      >
        <Answer
          :list.sync="c_question.answers"
          :disable="radio===questionTypeEnum.Bool.key"
          @onDeleteDefore="onDeleteDefore($event)"
        />
      </el-form-item>
      <el-form-item v-if="radio==questionTypeEnum.String.key" label="答案提示文字" prop="promptText">
        <el-input v-model="c_question.promptText" placeholder="请输入答案提示文字" />
      </el-form-item>
      <el-form-item v-if="radio==questionTypeEnum.Decimal.key" label="单位" prop="unit">
        <el-input v-model="c_question.unit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="题目关联" prop="name">
        <el-select
          v-model="c_question.dependQuestion"
          placeholder="请选择"
          style="width:100%"
          @change="dependAnswerChange"
        >
          <el-option :label="`暂无关联`" :value="''" />
          <el-option
            v-for="(item,index) in c_questions"
            :key="index"
            :label="`${item.sort}.  ${item.questionName}(${questionTypeEnum2[item.questionType]})`"
            :value="item.questionGuid"
          />
        </el-select>
        <QuestionItem
          :item="selectQuestion"
          :disabled="false"
          :guid.sync="c_question.dependAnswer"
        />
      </el-form-item>
      <div style="text-align: center;">
        <el-button type="primary" size="mini" icon="iconfont icon-save" @click="handleSave()">完成编辑</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Drawer from '@/components/Drawer/Index'
import Answer from './Answer'
import QuestionItem from './QuestionItem'
import {
  CreateQuestionnaireQuestionAsync,
  SaveQuestionnaireAsync
} from '@/api/Questionnaire'
import { questionTypeEnum, questionTypeEnum2 } from '../enum'
import { log } from 'util'
export default {
  components: { Drawer, Answer, QuestionItem },
  props: {
    question: {
      type: Object
    },
    title: {
      type: String
    },
    questions: {
      type: Array
    }
  },
  data() {
    const validateAnswers = (rule, value, callback) => {
      value.forEach((element, index) => {
        if (!element.answerLabel) {
          callback(`【选项名称${index + 1}】必填`)
          return
        }
        if (
          value.some(
            (a, i) => a.answerLabel == element.answerLabel && index != i
          )
        ) {
          callback(`【选项名称${index + 1}】名字冲突`)
          return
        }
      })
      callback()
    }
    return {
      radio: 1,
      form: {
        info: {},
        rules: {
          questionType: [{ required: true, trigger: 'blur', message: '必填' }],
          questionName: [
            { required: true, trigger: 'blur', message: '必填' },
            { max: 30, trigger: 'blur', message: '长度不能超过30' }
          ],
          answers: [{ trigger: 'blur', validator: validateAnswers }],
          unit: [
            { max: 7, trigger: 'blur', message: '长度不能超过7' }
          ],
          promptText: [{ max: 80, trigger: 'blur', message: '长度不能超过80' }],
          phone: [{ required: true, trigger: 'blur', message: '必填' }]
        }
      },
      questionTypeEnum,
      questionTypeEnum2,
      selectQuestion: {}
    }
  },
  computed: {
    c_questions: {
      get() {
        return this.questions.filter(
          a =>
            [questionTypeEnum.Enum.key, questionTypeEnum.Bool.key].some(
              b => b == a.questionType
            ) && (this.c_question ? a.sort < this.c_question.sort : true)
        )
      }
    },
    c_question: {
      get() {
        return this.question
      }
    }
  },
  watch: {
    'c_question.dependQuestion'(val) {
      if (!val) this.selectQuestion = {}
      else {
        var item = this.questions.find(a => a.questionGuid == val)
        this.selectQuestion = item
      }
    },
    'question.questionType'(val) {
      this.radio = val
    }
  },
  methods: {
    handleSave() {
      if (this.c_question.dependQuestion && !this.c_question.dependAnswer) {
        return this.$message({
          message: '请选择关联题目选项！',
          type: 'warning',
          duration: 5 * 1000
        })
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          CreateQuestionnaireQuestionAsync(this.c_question).then(response => {
            var { questionGuid, dependDescription } = response.data
            this.c_question.questionGuid = questionGuid
            this.$emit('onSuccess', this.c_question)
            this.$notify({
              title: '成功',
              message: '成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    dependAnswerChange(val) {
      if (val) {
        var item = this.questions.find(a => a.questionGuid == val)
        this.selectQuestion = item
        console.log('this.selectQuestion', this.selectQuestion)
      } else {
        this.selectQuestion = null
      }
    },
    onDeleteDefore(e) {
      var answerGuid = (this.c_question.answers[e.index] || {}).answerGuid
      var qEntity = this.questions.find(a => a.dependAnswer == answerGuid)
      var confirmText = '此操作将永久删除该数据, 是否继续？'
      if (qEntity) {
        confirmText = `当前选项正在被【${qEntity.sort}. ${qEntity.questionName}】所依赖, 是否继续？`
        this.$confirm(confirmText, '确认删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          e.next(true)
        })
      } else {
        e.next(true)
      }
    },
    changeQuestionType(val) {
      this.c_question.questionType = val
      switch (val) {
        case questionTypeEnum.Bool.key:
          this.c_question.answers = [
            {
              answerLabel: '是',
              isDefault: false
            },
            {
              answerLabel: '否',
              isDefault: false
            }
          ]
          break
        case questionTypeEnum.String.key:
        case questionTypeEnum.Decimal.key:
          this.c_question.answers = []
          break
        default:
          this.c_question.answers = [
            {
              answerLabel: null,
              isDefault: false
            }
          ]
          break
      }
    }
  }
}
</script>

