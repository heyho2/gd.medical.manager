<template>
  <div>
    <div v-loading="loading" class="content">
      <div class="list">
        <div class="subject-name">
          <span>姓名</span>
          <span>：</span>
        </div>
        <div class="opts">
          <span>{{ form.userName||"无" }}</span>
        </div>
      </div>
      <div class="list">
        <div class="subject-name">
          <span>性别</span>
          <span>：</span>
        </div>
        <div class="opts">
          <span>{{ form.gender=="M"?"男":"女" }}</span>
        </div>
      </div>
      <div class="list">
        <div class="subject-name">
          <span>生日</span>
          <span>：</span>
        </div>
        <div class="opts">
          <span>{{ form.birthday?parseTime(form.birthday,'{y}-{m}-{d}'):"无" }}</span>
        </div>
      </div>
      <div class="list">
        <div class="subject-name">
          <span>身份证号</span>
          <span>：</span>
        </div>
        <div class="opts">
          <span>{{ form.identityNumber||"无" }}</span>
        </div>
      </div>
      <div v-for="(item,index) of list" :key="index" class="list">
        <div class="subject-name">
          <span>{{ item.subjectName }}</span>
          <span>：</span>
        </div>
        <div class="opts">
          <span
            v-if="['String','Decimal'].indexOf(item.informationType)!=-1"
          >{{ item.resultValue||"无" }}</span>
          <span v-if="item.informationType==='Bool'">{{ item.resultValue=="true"?"是":"否" }}</span>
          <span
            v-if="['Enum','Array'].indexOf(item.informationType)!=-1"
          >{{ getOptionLabel(item.optionList,item.optionGuids)||"无" }}</span>
          <div v-if="item.resultValue" class="subject-unit">{{ item.subjectUnit }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { parseTime } from '@/utils/index'

import {
  GetHealthInformationAsync,
  UpdateHealthInformationAsync
} from '@/api/HealthDocumentation/HealthInformation'
export default {
  data() {
    return {
      loading: false,
      list: [],
      form: {}
    }
  },
  computed: {
    ...mapState({
      userGuid: state => state.member.member_vip_id
    })
  },
  created() {
    this.getData()
  },
  methods: {
    ...mapMutations({
      set_dialog: 'SET_MEMBER_DIALOG_SHOW'
    }),

    getData() {
      this.loading = true
      GetHealthInformationAsync({ userGuid: this.userGuid }).then(res => {
        var { healthInformationList } = res.data
        // 数组 // 枚举
        healthInformationList.forEach(i => {
          const result = ['Array', 'Enum'].some(a => i.informationType === a)
          if (result) {
            if (!i.optionValue || !i.optionGuids) {
              i.optionValue = []
              i.optionGuids = []
            } else {
              try {
                i.optionGuids = JSON.parse(i.optionGuids) || []
                if (typeof i.optionGuids === 'string') {
                  i.optionGuids = []
                }
              } catch (error) {
                i.optionGuids = []
              }

              try {
                i.optionValue = JSON.parse(i.optionValue) || []
                if (typeof i.optionValue === 'string') {
                  i.optionValue = []
                }
              } catch (error) {
                i.optionValue = []
              }
            }
          }
          // 枚举
          if (i.informationType === 'Enum') {
            i.optionGuid = i.optionValue.join()
          }
          // 布尔
          if (i.informationType === 'Bool') {
            i.resultValue = eval(i.resultValue)
          }
        })
        this.list = healthInformationList
        this.form = res.data
        setTimeout(() => {
          this.loading = false
        }, 200)
      })
    },
    getOptionLabel(optionList, optionGuids) {
      return optionList
        .filter(a => optionGuids.some(b => b == a.optionGuid))
        .map(a => a.optionLabel)
        .join(',')
    },
    parseTime
  }
}
</script>

<style lang="less" scoped>
@dfs: #dcdfe6;
.content {
  min-height: 300px;
  max-height: 500px;
  margin-top: 10px;
  overflow-y: auto;

  .list {
    display: flex;
    align-items: center;
    border: 1px solid @dfs;
    border-bottom: 0;
    align-items: center;
    &:last-child {
      border-bottom: 1px solid @dfs;
    }
    .subject-name {
      padding: 10px 10px;
      flex: 1;
      text-align: right;
    }
    .opts {
      flex: 1;
      padding: 15px 5px;
      border-left: 1px solid @dfs;
    }
    .subject-unit {
      text-indent: 1em;
      display: inline;
    }
  }
}

.foot-btn {
  margin-top: 20px;
  text-align: center;
}

/deep/.el-checkbox {
  min-width: 150px;
}
</style>
