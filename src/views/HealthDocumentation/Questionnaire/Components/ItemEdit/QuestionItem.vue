<template>
  <div>
    <div
      v-if="[questionTypeEnum.Enum.key,questionTypeEnum.Bool.key].some(a=>a==item.questionType)"
      class="question"
    >
      <ul>
        <li v-for="(answer,index2) in item.answers" :key="index2" style="width:60%;">
          <el-radio
            v-model="c_guid"
            :disabled="disabled"
            :label="answer.answerGuid"
          >{{ answer.answerLabel }}</el-radio>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { questionTypeEnum, questionTypeEnum2 } from '../enum'
export default {
  props: {
    item: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    guid: {
      type: String
    }
  },
  data: () => ({
    questionTypeEnum,
    questionTypeEnum2
  }),
  computed: {
    c_guid: {
      get() {
        return this.guid
      },
      set(val) {
        this.$emit('update:guid', val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
