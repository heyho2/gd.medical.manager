<template>
  <div
    v-loading="listLoading"
    style="padding:0 5%;margin-top:-50px"
  >
    <h4 class="text-center">{{ list.questionnaireName }}</h4>
    <h6 class="text-left">
      {{ list.subhead }}
      <!-- 尊敬的安美贵宾： 为了对您的身体负责并更全面的了解您在健康方面的需求，针对有效地制定个性化健康解决方案，请您务必真实填写健康状况，感谢您的配合。 -->
    </h6>

    <div class="drag-content">
      <div
        v-for="(i,index) of list.questions"
        :key="index"
        class="question-box"
      >
        <div class="question-name">
          {{ i.sort || index+1 }}.{{ i.questionName }}
        </div>

        <div style="padding:10px 10px 10px 10px">

          <!-- 枚举，布尔，数组 -->
          <template v-if="[1,2,5].some(a=>a===i.questionType)">
            <template v-for="(item,n) of i.answers">
              <p
                :key="n"
                class="arr"
                :style="{
                  color:item.isSelected?'#ffff':'',
                  backgroundColor:item.isSelected?'#409EFF':''}"
              >
                {{ item.answerLabel }}
              </p>
            </template>

          </template>

          <!-- 数值，文本 -->
          <template v-if="[3,4].some(a=>a===i.questionType)">
            <p>
              {{ i.result }}
              <span v-if="i.questionType===3">{{ i.unit }}</span>
            </p>
          </template>

        </div>
      </div>
    </div>

    <template>
      <p style="margin-top:30px">请填写建议:</p>
      <el-input
        v-model="list.comment"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        :maxlength="500"
      />

      <div class="foot-btn">
        <el-button
          type="danger"
          :loading="listLoading"
          @click="cancel"
        >取 消</el-button>
        <el-button
          type="primary"
          :loading="listLoading"
          @click="updateData"
        >更 新</el-button>
      </div>
    </template>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState, mapGetters, mapMutations } from 'vuex'
import {
  GetConumserQuestionnaireResultAsync,
  CommentConsumerQuestionnaireAsync
} from '@/api/HealthDocumentation/Member'

export default {
  components: {
    draggable
  },
  data() {
    return {
      listLoading: false,
      list: {
        questionnaireName: '',
        comment: '',
        questions: []
      }
    }
  },
  computed: {
    ...mapState({
      detailId: state => state.member.current_table_item_id,
      dialogName: state => state.member.member_dialog_name
    }),
    ...mapGetters({
      ctx: 'get_member_ctx'
    })
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 弹窗上下文显示开关
    ...mapMutations({
      set_ctx: 'SET_MEMBER_CTX' // 弹窗上下文显示开关
    }),

    getData() {
      this.listLoading = true
      GetConumserQuestionnaireResultAsync({ resultGuid: this.detailId })
        .then(res => {
          this.list = res.data
          setTimeout(() => {
            this.listLoading = false
          }, 300)
        })
        .catch(() => {
          setTimeout(() => {
            this.set_ctx(this.dialogName)
            this.listLoading = false
          }, 300)
        })

      // 模拟数据用
      // setTimeout(() => {
      //   this.list = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
      //   this.listLoading = false;
      // }, 300);
    },

    updateData() {
      if (!this.list.comment) return this.$error('建议必填。')
      this.listLoading = true

      CommentConsumerQuestionnaireAsync({
        resultGuid: this.detailId,
        comment: this.list.comment
      })
        .then(res => {
          this.$success('更新建议成功。')

          setTimeout(() => {
            this.listLoading = false
            this.set_ctx(this.dialogName)
          }, 300)
        })
        .catch(() => {
          setTimeout(() => {
            this.listLoading = false
          }, 300)
        })
    },
    cancel() {
      this.set_ctx(this.dialogName)
    }
  }
}
</script>

<style lang="less" scoped>
.drag-content {
  min-height: 100px;
  max-height: 300px;
  overflow-y: auto;
}

.question-box {
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #dcdee2;
  transition: all 0.25s ease;

  &:hover {
    border-color: #0099ff;
  }

  .question-name {
    font-size: 14px;
    font-weight: bold;
  }
}

.arr {
  color: rgb(59, 56, 56);
  margin: 5px 0;
  padding: 5px;
  border-radius: 5px;
}
.text-center {
  text-align: center;
}
.text-left {
  text-indent: 2em;
  text-align: left;
}
.foot-btn {
  margin-top: 20px;
  text-align: center;
}
</style>
