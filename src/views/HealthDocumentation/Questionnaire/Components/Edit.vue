<template>
  <Drawer :title="dialogTitle" :dialog-visible.sync="c_dialogVisible" width="1024px">
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
          <el-input
            v-model="form.info.questionnaireName"
            placeholder="请输入问卷名称"
            :maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="副标题" prop="subhead">
          <el-input
            v-model="form.info.subhead"
            type="textarea"
            placeholder="请输入副标题"
            :autosize="{ minRows: 2, maxRows: 4}"
            :maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div class="questionnaire">
        <div class="head">
          <span>*方块可自由拖动排序</span>
        </div>
        <el-collapse v-model="collapseActive" accordion @change="handleCollapseChange($event)">
          <draggable
            class="board-column-content"
            :list="form.info.questions"
            :options="{animation: 150,handle:'.questionnaire .item'}"
            @end="draggableEnd"
            @start="draggableStart"
          >
            <el-collapse-item
              v-for="(item,index) in form.info.questions"
              :key="index"
              :name="index"
            >
              <template slot="title" class="collapse-item">
                <div :class="`item ${collapseActive===index?'active':''}`">
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
                    </ul>
                  </div>
                  <div
                    v-if="[questionTypeEnum.Array.key].some(a=>a==item.questionType)"
                    class="question"
                  >
                    <ul>
                      <li v-for="(answer,index2) in item.answers" :key="index2" style="width:60%;">
                        <el-checkbox :disabled="true" label="1">{{ answer.answerLabel }}</el-checkbox>
                      </li>
                    </ul>
                  </div>
                  <div
                    v-if="[questionTypeEnum.Decimal.key].some(a=>a==item.questionType)"
                    class="question"
                  >
                    <ul>
                      <li style="width:60%;">
                        <el-input :disabled="true" :placeholder="`请输入${item.questionName}`">
                          <span v-if="item.unit" slot="append">{{ item.unit }}</span>
                        </el-input>
                      </li>
                    </ul>
                  </div>
                  <div
                    v-if="[questionTypeEnum.String.key].some(a=>a==item.questionType)"
                    class="question"
                  >
                    <ul>
                      <li style="width:60%;">
                        <el-input
                          :disabled="true"
                          type="textarea"
                          :placeholder="item.promptText||`请输入${item.questionName}`"
                        />
                      </li>
                    </ul>
                  </div>
                  <div v-if="item.dependDescription" class="rely">{{ item.dependDescription }}</div>
                  <div class="buttons">
                    <el-button
                      icon="el-icon-delete"
                      color="red"
                      size="mini"
                      type="text"
                      @click="handleRemove($event,item)"
                    >删除</el-button>
                    <el-button
                      icon="el-icon-circle-plus"
                      type="text"
                      size="mini"
                      @click="handleInsert($event,item,index)"
                    >在此题后插入新题</el-button>
                  </div>
                </div>
              </template>
              <ItemEdit
                class="edit"
                :question="questionEdit.question"
                :title="questionEdit.title"
                :questions="form.info.questions"
                @onSuccess="handleQuestionSave($event,`popover${index+1}`,index)"
              />
            </el-collapse-item>
            <el-collapse-item :name="-1">
              <template slot="title">
                <div :class="`add ${collapseActive===-1?'active':''}`">
                  <el-button slot="reference" type="text" icon="el-icon-plus">点此添加题目</el-button>
                </div>
              </template>
              <ItemEdit
                class="edit"
                :title="questionEdit.title"
                :question="questionEdit.question"
                :questions="form.info.questions"
                @onSuccess="handleQuestionSave"
              />
            </el-collapse-item>
          </draggable>
        </el-collapse>
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
import ItemEdit from './ItemEdit/Index'
import { questionTypeEnum, questionTypeEnum2 } from './enum'

import {
  InitQuestionnaireForCreateQuestionnaireAsync,
  GetQuestionnaireInfoAsync,
  SaveQuestionnaireAsync,
  RemoveQuestionnaireQuestionAsync,
  ChangeQuestionSortAsync
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
    collapseActive: 0,
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
        subhead: [{ max: 200, trigger: 'blur', message: '长度不能超过200' }]
      }
    },
    questionEdit: {
      dialogVisible: true,
      title: null,
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
    questionTypeEnum2: questionTypeEnum2,
    cacheData: null
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
      console.log(this.guid)

      if (this.guid) {
        this.form.info.questionnaireGuid = this.guid
        this.loadData()
      } else {
        InitQuestionnaireForCreateQuestionnaireAsync().then(response => {
          var { questionnaireGuid, questionnaireName, subhead } = response.data
          Object.assign(this.form.info, this.form.null_info)
          this.form.info.questionnaireGuid = questionnaireGuid
          this.form.info.questionnaireName = questionnaireName
          this.form.info.subhead = subhead
        })
      }
      this.collapseActive = null
    }
  },
  methods: {
    loadData() {
      GetQuestionnaireInfoAsync({
        questionnaireGuid: this.form.info.questionnaireGuid
      }).then(response => {
        Object.assign(this.form.info, response.data)
      })
    },
    loadDataList() {
      GetQuestionnaireInfoAsync({
        questionnaireGuid: this.form.info.questionnaireGuid
      }).then(response => {
        this.form.info.questions = response.data.questions
      })
    },
    handleQuestionSave(question, elRef, index) {
      this.loadDataList()
      this.collapseActive = null
    },
    handleCollapseChange(val) {
      if (val === null || val === '') {
        return
      }
      if (val === -1) {
        this.questionEdit.title = null
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
          sort: this.form.info.questions.length + 1,
          unit: null,
          promptText: null,
          answers: [
            {
              answerLabel: null,
              isDefault: false
            }
          ]
        }
      } else {
        const item = this.form.info.questions[val]
        this.questionEdit.title = `编辑”${item.sort}.  ${item.questionName}(${
          questionTypeEnum2[item.questionType]
        })“`
        this.questionEdit.question = JSON.parse(JSON.stringify(item))
        Object.assign(this.questionEdit.question, {
          questionnaireGuid: this.form.info.questionnaireGuid
        })
      }
    },
    handleSave() {
      // if (!this.form.info.questions || this.form.info.questions.length == 0) {
      //   this.$message({
      //     message: '请添加问答题目！',
      //     type: 'warning',
      //     duration: 5 * 1000
      //   })
      //   return
      // }
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
    },
    handleRemove(e, row) {
      e.stopPropagation()
      var confirmText = '此操作将永久删除该数据, 是否继续？'
      var qEntity = this.form.info.questions.find(
        a => a.dependQuestion == row.questionGuid
      )
      if (qEntity) {
        confirmText = `当前题目正在被【${qEntity.sort}. ${qEntity.questionName}】所依赖, 是否继续？`
      }
      this.$confirm(confirmText, '确认删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          RemoveQuestionnaireQuestionAsync({
            questionGuid: row.questionGuid
          }).then(response => {
            this.$notify({
              title: '成功',
              message: '成功',
              type: 'success',
              duration: 2000
            })
            this.loadDataList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleInsert(e, row, collapseActive) {
      this.collapseActive = collapseActive
      this.questionEdit.title = `在”${row.sort}.  ${row.questionName}(${
        questionTypeEnum2[row.questionType]
      })“ 后插入新题`
      e.stopPropagation()
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
        sort: row.sort + 1,
        unit: null,
        promptText: null,
        answers: [
          {
            answerLabel: null,
            isDefault: false
          }
        ]
      }
    },
    draggableStart() {
      this.cacheData = JSON.parse(JSON.stringify(this.form.info.questions))
    },
    draggableEnd(evt) {
      const { oldIndex, newIndex } = evt
      const oldItem = this.cacheData[oldIndex]
      const newNtem = this.cacheData[newIndex]
      if (oldIndex === newIndex) return
      this.collapseActive = null

      ChangeQuestionSortAsync({
        questionGuid: oldItem.questionGuid,
        Sort: newNtem.sort
      }).then(
        response => {
          this.loadDataList()
        },
        err => {
          this.form.info.questions = this.cacheData
          this.$forceUpdate()
          // this.loadData();
        }
      )
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
  /deep/ .el-collapse-item__header {
    height: auto;
    &:hover {
      cursor: pointer;
      background-color: #d6d6d6b6;
      .buttons {
        display: flex;
      }
    }
  }

  .item {
    flex: 1;
    padding: 20px;
    margin: 10px;
    padding-bottom: 30px;
    position: relative;
    &.active {
      border: 1px dashed #42f3d0;
      border-radius: 5px;
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
      clear: both;
      padding-top: 5px;
      padding-left: 24px;
      padding-bottom: 2px;
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
    .buttons {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 0 20px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      display: none;
    }
    .rely {
      padding: 7px 15px;
      padding-left: 48px;
      position: absolute;
      bottom: 0;
      left: 0;
      color: red;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      line-height: normal;
      font-weight: normal;
      font-size: 12px;
    }
  }
  .edit {
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
    border: 1px solid #e8e9eb;
    border-radius: 10px;
    position: relative;
    box-shadow: 0px 0px 10px #dcdfe6;
    &:before {
      position: absolute;
      content: "";
      top: 0;
      left: 50%;
      transform: translate(-50%, -100%);
      border-width: 10px;
      border-style: solid;
      border-top-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;
      border-bottom-color: #dcdfe6;
    }
    &:after {
      position: absolute;
      content: "";
      top: 0;
      left: 50%;
      transform: translate(-50%, -100%);
      border-width: 8.5px;
      border-style: solid;
      border-top-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;
      border-bottom-color: #fff;
    }
  }
  .add {
    flex: 1;
    // border: 1px dashed #d3d8d7;
    padding: 8px;
    margin: 8px;
    text-align: center;
    &.active {
      border: 1px dashed #42f3d0;
      border-radius: 5px;
    }
  }
}
</style>
