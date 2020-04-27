<template>
  <Drawer :title="dialogTitle" :dialog-visible.sync="c_dialogVisible">
    <template>
      <div class="head">
        <h3>{{ form.info.questionnaireName }}</h3>
        <p>{{ form.info.subhead }}</p>
      </div>
      <div class="questionnaire">
        <div v-for="(item,index) in form.info.questions" slot="reference" :key="index" class="item">
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
          <div v-if="[questionTypeEnum.Decimal.key].some(a=>a==item.questionType)" class="question">
            <ul>
              <li style="width:60%;">
                <el-input :disabled="true" :placeholder="`请输入${item.questionName}`">
                  <span v-if="item.unit" slot="append">{{ item.unit }}</span>
                </el-input>
              </li>
              <div style="clear:both;" />
            </ul>
          </div>
          <div v-if="[questionTypeEnum.String.key].some(a=>a==item.questionType)" class="question">
            <ul>
              <li style="width:60%;">
                <el-input
                  :disabled="true"
                  type="textarea"
                  :placeholder="item.promptText||`请输入${item.questionName}`"
                />
              </li>
              <div style="clear:both;" />
            </ul>
          </div>
          <div v-if="item.dependDescription" class="rely">{{ item.dependDescription }}</div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <el-button icon="el-icon-close" @click="c_dialogVisible = false">关闭</el-button>
    </template>
  </Drawer>
</template>
<script>
import { formatCurrency, parseTime } from '@/utils/index'
import Drawer from '@/components/Drawer/Index'
import { questionTypeEnum, questionTypeEnum2 } from './enum'
import { GetQuestionnaireInfoAsync } from '@/api/Questionnaire'
export default {
  components: { Drawer },
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
        Object.assign(this.form.info, this.form.null_info)
      }
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.head {
  padding: 8px;
  margin: 20px;
  text-align: center;
  h3 {
    font-size: 18px;
  }
  p {
    font-size: 14px;
    color: #666;
    text-indent: 25px;
    text-align: left;
  }
}
.questionnaire {
  .item {
    padding: 10px;
    margin: 20px;
    // border: 1px dashed #969696;
    border-bottom: 1px solid #efefef;

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
    .rely {
      padding-left: 24px;
      color: red;
      display: flex;
      flex-direction: row;
      line-height: normal;
      font-weight: normal;
      font-size: 12px;
    }
  }
}
</style>
