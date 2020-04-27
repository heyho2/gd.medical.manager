<template>
  <div class="settings">
    <el-card class="box-card">
      <div>
        <h3 style="text-align: center;">个人信息</h3>
      </div>
      <div class="questionnaire">
        <el-collapse v-model="collapseActive" accordion @change="handleCollapseChange($event)">
          <div class="lable" style>系统个人信息</div>
          <el-collapse-item :name="-1" :disabled="true">
            <template slot="title">
              <div class="item2">
                <div class="name">
                  <div class="topic">{{ 1 }}.</div>
                  <div class="title">
                    <span>真实姓名</span>
                    <span />
                  </div>
                </div>
                <div class="question">
                  <ul>
                    <li style="width:60%;">
                      <el-input :disabled="true" type="textarea" :placeholder="`请输入姓名`" />
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </el-collapse-item>
          <el-collapse-item :name="-1" :disabled="true">
            <template slot="title" class="collapse-item">
              <div class="item2">
                <div class="name">
                  <div class="topic">{{ 2 }}.</div>
                  <div class="title">
                    <span>性别</span>
                    <span />
                  </div>
                </div>
                <div class="question">
                  <ul>
                    <li style="width:60%;">
                      <el-radio :disabled="true" label="1">男</el-radio>
                    </li>
                    <li style="width:60%;">
                      <el-radio :disabled="true" label="1">女</el-radio>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </el-collapse-item>
          <el-collapse-item :name="-1" :disabled="true">
            <template slot="title" class="collapse-item">
              <div class="item2">
                <div class="name">
                  <div class="topic">{{ 3 }}.</div>
                  <div class="title">
                    <span>生日</span>
                    <span />
                  </div>
                </div>
                <div class="question">
                  <ul>
                    <li style="width:60%;">
                      <el-input :disabled="true" :placeholder="`请输入生日`" />
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </el-collapse-item>
          <el-collapse-item :name="-1" :disabled="true">
            <template slot="title" class="collapse-item">
              <div class="item2">
                <div class="name">
                  <div class="topic">{{ 4 }}.</div>
                  <div class="title">
                    <span>身份证号</span>
                    <span />
                  </div>
                </div>
                <div class="question">
                  <ul>
                    <li style="width:60%;">
                      <el-input :disabled="true" :placeholder="`请输身份证号`" />
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </el-collapse-item>
          <div class="lable">可配置的个人信息</div>
          <div class="head">
            <span>*方块可自由拖动排序</span>
          </div>
          <draggable
            class="board-column-content"
            :list="form.questions"
            :options="{animation: 150,handle:'.questionnaire .item'}"
            @end="draggableEnd"
            @start="draggableStart"
          >
            <el-collapse-item v-for="(item,index) in form.questions" :key="index" :name="index">
              <template slot="title" class="collapse-item">
                <div :class="`item ${collapseActive===index?'active':''}`">
                  <div class="name">
                    <div class="topic">{{ index + 5 }}.</div>
                    <div class="title">
                      <span>{{ item.subjectName }}({{ informationTypeEnum2[item.informationType] }})</span>
                      <span />
                    </div>
                  </div>
                  <div
                    v-if="[informationTypeEnum.Enum.key,informationTypeEnum.Bool.key].some(a=>a==item.informationType)"
                    class="question"
                  >
                    <ul>
                      <li v-for="(answer,index2) in item.options" :key="index2" style="width:60%;">
                        <el-radio :disabled="true" label="1">{{ answer.optionLabel }}</el-radio>
                      </li>
                    </ul>
                  </div>
                  <div
                    v-if="[informationTypeEnum.Array.key].some(a=>a==item.informationType)"
                    class="question"
                  >
                    <ul>
                      <li v-for="(answer,index2) in item.options" :key="index2" style="width:60%;">
                        <el-checkbox :disabled="true" label="1">{{ answer.optionLabel }}</el-checkbox>
                      </li>
                    </ul>
                  </div>
                  <div
                    v-if="[informationTypeEnum.Decimal.key].some(a=>a==item.informationType)"
                    class="question"
                  >
                    <ul>
                      <li style="width:60%;">
                        <el-input :disabled="true" :placeholder="`请输入${item.subjectName}`">
                          <span slot="append">{{ item.subjectUnit }}</span>
                        </el-input>
                      </li>
                    </ul>
                  </div>
                  <div
                    v-if="[informationTypeEnum.String.key].some(a=>a==item.informationType)"
                    class="question"
                  >
                    <ul>
                      <li style="width:60%;">
                        <el-input
                          :disabled="true"
                          type="textarea"
                          :placeholder="item.subjectPromptText||`请输入${item.subjectName}`"
                        />
                      </li>
                    </ul>
                  </div>
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
                :data="questionEdit.question"
                :title="questionEdit.title"
                :questions="form.questions"
                @onSuccess="handleQuestionSave($event,item,index)"
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
                :data="questionEdit.question"
                :questions="form.questions"
                @onSuccess="handleQuestionSave"
              />
            </el-collapse-item>
          </draggable>
        </el-collapse>
        <div v-show="!isEdit" class="mask" />
      </div>
    </el-card>
    <div class="foot-btn">
      <el-button v-show="!isEdit" type="primary" icon="el-icon-edit" @click="handleEdit()">编辑</el-button>
      <el-button v-show="isEdit" type="success" icon="iconfont icon-save" @click="handleSave()">保存</el-button>
      <el-button v-show="isEdit" type="danger" icon="el-icon-close" @click="handleClose()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { formatCurrency, parseTime } from '@/utils/index'
import draggable from 'vuedraggable'
import Drawer from '@/components/Drawer/Index'
import ItemEdit from './Components/ItemEdit/Index'
import { informationTypeEnum, informationTypeEnum2 } from './Components/enum'

import {
  SaveHealthInformationAsync,
  GetHealthInfoBasicDataAsync
} from '@/api/HealthDocumentation/HealthInformation'

export default {
  components: { draggable, Drawer, ItemEdit },
  props: {
    guid: { type: String }
  },
  data: () => ({
    collapseActive: 0,
    isEdit: false,
    form: {
      questions: [],
      null_questions: []
    },
    null_question: {
      informationGuid: null,
      informationType: informationTypeEnum.Enum.key,
      subjectName: null,
      subjectUnit: null,
      subjectPromptText: null,
      isSingleLine: false,
      sort: 0,
      options: [
        {
          optionGuid: null,
          sort: 0,
          optionLabel: null,
          isDefault: true
        }
      ]
    },
    questionEdit: {
      dialogVisible: true,
      title: null,
      isInsert: false,
      question: {
        informationGuid: null,
        informationType: null,
        subjectName: null,
        subjectUnit: null,
        subjectPromptText: null,
        isSingleLine: false,
        sort: 0,
        options: [
          {
            optionGuid: null,
            sort: 0,
            optionLabel: null,
            isDefault: true
          }
        ]
      }
    },
    informationTypeEnum: informationTypeEnum,
    informationTypeEnum2: informationTypeEnum2,
    cacheData: null
  }),
  computed: {},
  created() {
    this.collapseActive = null
    this.loadData()
  },
  methods: {
    handleQuestionSave(question, item, index) {
      this.collapseActive = null
      if (item) {
        if (this.questionEdit.isInsert) {
          this.form.questions.splice(index + 1, 0, question)
        } else {
          this.form.questions[index] = JSON.parse(JSON.stringify(question))
        }
        this.$forceUpdate()
      } else {
        question.sort = this.form.questions.length + 1
        this.form.questions.push(question)
      }
    },
    loadData(item) {
      GetHealthInfoBasicDataAsync().then(response => {
        this.form.questions = response.data
      })
    },
    handleCollapseChange(val) {
      if (val === null || val === '') {
        return
      }
      this.questionEdit.isInsert = false
      if (val === -1) {
        this.questionEdit.title = null
        this.questionEdit.question = JSON.parse(
          JSON.stringify(this.null_question)
        )
      } else {
        const item = this.form.questions[val]
        this.questionEdit.title = `编辑”${val + 1}.  ${item.subjectName}(${
          informationTypeEnum2[item.informationType]
        })“`
        this.questionEdit.question = JSON.parse(JSON.stringify(item))
        Object.assign(this.questionEdit.question, {
          questionnaireGuid: this.form.questionnaireGuid
        })
      }
    },
    handleSave() {
      SaveHealthInformationAsync({ Infos: this.form.questions }).then(
        response => {
          this.$notify({
            title: '成功',
            message: '成功',
            type: 'success',
            duration: 2000
          })
          this.collapseActive = null
          this.loadData()
          this.isEdit = false
        }
      )
    },
    handleRemove(e, row) {
      e.stopPropagation()
      this.form.questions.splice(this.form.questions.indexOf(row), 1)
    },
    handleInsert(e, row, collapseActive) {
      this.collapseActive = collapseActive
      this.questionEdit.title = `在”${this.form.questions.indexOf(row) + 1}.  ${
        row.subjectName
      }(${informationTypeEnum2[row.informationType]})“ 后插入新题`
      this.questionEdit.isInsert = true
      e.stopPropagation()
      this.questionEdit.question = JSON.parse(
        JSON.stringify(this.null_question)
      )
    },
    draggableStart() {},
    draggableEnd(evt) {
      this.collapseActive = null
    },
    handleEdit() {
      this.isEdit = true
    },
    handleClose() {
      this.isEdit = false
      this.collapseActive = null
      this.loadData()
    }
  }
}
</script>

<style lang="less" scoped>
.settings {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);
  .box-card {
    width: 900px;
    max-width: 100%;
    margin: 10px auto;
    overflow-y: auto;
    height: calc(100% - 50px);
  }
  .foot-btn {
    height: 50px;
    background-color: #fff;
    border-top: 1px solid #ffffff;
    box-shadow: 0px 0px 10px #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.questionnaire {
  position: relative;
  .head {
    padding: 8px;
    margin: 20px;
    span {
      font-size: 12px;
      color: #999;
    }
  }
  .lable {
    font-size: 14px;
    margin: 12px;
    color: #666;
    font-weight: 600;
    margin-top: 20px;
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
  .mask {
    cursor: not-allowed;
    z-index: 2000;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.7);
  }
  .item,
  .item2 {
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
