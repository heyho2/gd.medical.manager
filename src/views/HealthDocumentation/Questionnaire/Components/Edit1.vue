<template>
  <Drawer :title="dialogTitle" :dialog-visible.sync="c_dialogVisible">
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
        <el-form-item label="问卷名称" prop="questionnaireName">
          <el-input v-model="form.info.questionnaireName" placeholder="请输入问卷名称" />
        </el-form-item>
        <el-form-item label="副标题" prop="subhead">
          <el-input v-model="form.info.subhead" placeholder="请输入副标题" />
        </el-form-item>
      </el-form>
      <div class="questionnaire">
        <div class="head">
          <span>*方块可自由拖动排序</span>
        </div>
        <el-popover
          v-for="(item,index) in form.info.questions"
          :key="index"
          :ref="`popover${index+1}`"
          placement="top"
          :width="`800`"
          trigger="click"
          @show="handleEdit(item)"
        >
          <ItemEdit
            :question="questionEdit.question"
            @onSuccess="handleQuestionSave($event,`popover${index+1}`,index)"
          />
          <div slot="reference" class="item">
            <div class="name">
              <div class="topic">{{ item.sort }}.</div>
              <div class="title">
                <span>{{ item.questionName }}({{ questionTypeEnum2[item.questionType] }})</span>
                <span />
              </div>
            </div>
            <div
              v-if="[questionTypeEnum.Enum.key,questionTypeEnum.Bool.key].some(a=>a==item.questionType)"
              class="question"
            >
              <ul>
                <li v-for="(answer,index2) in item.answers" :key="index2" style="width:60%;">
                  <el-radio :disabled="true" label="1">{{ answer.answerLabel }}</el-radio>
                </li>
                <div style="clear:both;" />
              </ul>
            </div>
            <div v-if="[questionTypeEnum.Array.key].some(a=>a==item.questionType)" class="question">
              <ul>
                <li v-for="(answer,index2) in item.answers" :key="index2" style="width:60%;">
                  <el-checkbox :disabled="true" label="1">{{ answer.answerLabel }}</el-checkbox>
                </li>
                <div style="clear:both;" />
              </ul>
            </div>
            <div
              v-if="[questionTypeEnum.Decimal.key].some(a=>a==item.questionType)"
              class="question"
            >
              <ul>
                <li style="width:60%;">
                  <el-input :disabled="true" :placeholder="`请输入${item.questionName}`">
                    <span slot="append">{{ item.unit }}</span>
                  </el-input>
                </li>
                <div style="clear:both;" />
              </ul>
            </div>
            <div
              v-if="[questionTypeEnum.String.key].some(a=>a==item.questionType)"
              class="question"
            >
              <ul>
                <li style="width:60%;">
                  <el-input :disabled="true" type="textarea" :placeholder="`请输入选项${index+1}`" />
                </li>
                <div style="clear:both;" />
              </ul>
            </div>
          </div>
        </el-popover>
        <div class="add">
          <el-popover
            v-model="questionEdit.dialogVisible"
            placement="top"
            :width="`800`"
            trigger="click"
            @show="handleAdd()"
          >
            <ItemEdit :question="questionEdit.question" @onSuccess="handleQuestionSave" />
            <el-button slot="reference" type="text" icon="el-icon-plus">点此添加题目</el-button>
          </el-popover>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <el-button icon="el-icon-close" @click="c_dialogVisible = false">关闭</el-button>
      <el-button type="primary" icon="iconfont icon-save" @click="handleSave()">保存</el-button>
    </template>
  </Drawer>
</template>
<script>
import { formatCurrency, parseTime } from '@/utils/index'
import draggable from 'vuedraggable'
import Drawer from '@/components/Drawer/Index'
// import ItemEdit from "./ItemEdit";
import ItemEdit from './ItemEdit/Index'
import { questionTypeEnum, questionTypeEnum2 } from './enum'

import {
  InitQuestionnaireForCreateQuestionnaireAsync,
  GetQuestionnaireInfoAsync,
  SaveQuestionnaireAsync
} from '@/api/Questionnaire'

export default {
  components: { draggable, Drawer, ItemEdit },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '查看会员'
    },
    guid: { type: String }
  },
  data: () => ({
    form: {
      info: {
        questionnaireGuid: null,
        questionnaireName: null,
        subhead: null,
        questions: []
      },
      null_info: {
        questionnaireGuid: null,
        questionnaireName: null,
        subhead: null,
        questions: []
      },
      rules: {
        questionnaireName: [
          { required: true, trigger: 'blur', message: '必填' },
          { max: 30, trigger: 'blur', message: '长度不能超过30' }
        ],
        subhead: [
          { required: true, trigger: 'blur', message: '必填' },
          { max: 200, trigger: 'blur', message: '长度不能超过200' }
        ]
      }
    },
    questionEdit: {
      dialogVisible: true,
      question: {
        questionGuid: null,
        questionName: null,
        questionType: questionTypeEnum.Enum.key,
        isDepend: true, // 是否依赖
        dependAnswer: null, // 依赖的问题答案guid
        dependQuestion: null, // 依赖答案所属问题guid
        dependDescription: null, // 依赖描述
        sort: 0,
        answers: [
          {
            answerLabel: null,
            isDefault: false
          }
        ]
      }
    },
    questionTypeEnum: questionTypeEnum,
    questionTypeEnum2: questionTypeEnum2
  }),
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
      if (!val) return
      if (this.guid) {
        GetQuestionnaireInfoAsync({ questionnaireGuid: this.guid }).then(
          response => {
            Object.assign(this.form.info, response.data)
          }
        )
      } else {
        InitQuestionnaireForCreateQuestionnaireAsync().then(response => {
          var { questionnaireGuid, questionnaireName, subhead } = response.data
          Object.assign(this.form.info, this.form.null_info)
          this.form.info.questionnaireGuid = questionnaireGuid
          this.form.info.questionnaireName = questionnaireName
          this.form.info.subhead = subhead
        })
      }
    }
  },
  methods: {
    handleQuestionSave(question, elRef, index) {
      if (elRef) {
        this.$refs[elRef][0].doClose()
        this.form.info.questions[index] = JSON.parse(JSON.stringify(question))
        this.$forceUpdate()
      } else {
        question.sort = this.form.info.questions.length + 1
        this.form.info.questions.push(question)
        this.questionEdit.dialogVisible = false
      }
    },
    handleEdit(item) {
      this.questionEdit.question = JSON.parse(JSON.stringify(item))
      Object.assign(this.questionEdit.question, {
        questionnaireGuid: this.form.info.questionnaireGuid
      })
    },
    handleAdd() {
      this.questionEdit.question = {
        questionnaireGuid: this.form.info.questionnaireGuid,
        questionGuid: null,
        questionName: null,
        questionType: questionTypeEnum.Enum.key,
        isDepend: true, // 是否依赖
        dependAnswer: null, // 依赖的问题答案guid
        dependQuestion: null, // 依赖答案所属问题guid
        dependDescription: null, // 依赖描述
        dimensionGuid: '',
        sort: 0,
        unit: null,
        promptText: null,
        answers: [
          {
            answerLabel: null,
            isDefault: false
          }
        ]
      }
      this.questionEdit.dialogVisible = true
    },
    handleSave() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          SaveQuestionnaireAsync(this.form.info).then(response => {
            this.$emit('onSuccess', this.c_question)
            this.$notify({
              title: '成功',
              message: '成功',
              type: 'success',
              duration: 2000
            })
            this.questionEdit.dialogVisible = false
            this.c_dialogVisible = false
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.questionnaire {
  .head {
    padding: 8px;
    margin: 20px;
    span {
      font-size: 12px;
      color: #999;
    }
  }
  .item {
    padding: 10px;
    margin: 20px;
    // border: 1px dashed #969696;
    &:hover {
      cursor: pointer;
      background-color: #e6e6e6;
    }
    .name {
      padding-top: 2px;
      font-size: 15px;
      color: #444444;
      font-weight: bold;
      height: auto;
      line-height: 20px;
      position: relative;
      .topic {
        width: 28px;
        float: left;
      }
      .title {
        overflow: hidden;
        zoom: 1;
      }
    }
    .question {
      padding-top: 0px;
      border-bottom: none;
      clear: both;
      padding-top: 5px;
      padding-left: 24px;
      padding-bottom: 2px;
      border-bottom: 1px solid #efefef;
      font-size: 15px;
      color: #333333;
      ul {
        margin: 0;
        padding: 4px;
        li {
          list-style-type: none;
          line-height: 30px;
        }
      }
    }
    .edit {
      border: 1px dashed #969696;
    }
  }
  .add {
    border: 1px dashed #d3d8d7;
    padding: 8px;
    margin: 8px;
    background-color: #fff;
    text-align: center;
  }
}
</style>
