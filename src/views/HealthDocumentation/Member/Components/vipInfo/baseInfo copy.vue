<template>
  <div>
    <div v-loading="loading" class="content">
      <div
        v-for="(i,n) of list"
        :key="n"
        class="list"
        :style="{
          alignItems:((i.informationType==='Array')||(i.informationType==='String'&&!i.isSingleLine)?'flex-start':'center')
        }"
      >
        <!-- 当为多行文本或复选框 弹性盒子为flex-start -->
        <div class="subject-name">{{ i.subjectName }} ：</div>

        <!-- 单行文本 -->
        <div class="opts">
          <el-input
            v-if="i.informationType==='String'&&i.isSingleLine"
            v-model="i.resultValue"
            style="width:200px;"
            :maxlength="255"
            size="mini"
          />

          <!-- 多行文本 -->
          <el-input
            v-if="i.informationType==='String'&&!i.isSingleLine"
            v-model="i.resultValue"
            type="textarea"
            style="width:300px"
            autosize
            :maxlength="255"
            size="mini"
            show-word-limit
          />

          <!-- 数值 -->
          <el-input-number
            v-if="i.informationType==='Decimal'"
            v-model="i.resultValue"
            style="width:200px;"
            size="mini"
            :controls="false"
            :min="-999999"
            :max="999999"
          />

          <!-- 布尔 -->
          <el-switch
            v-if="i.informationType==='Bool'"
            v-model="i.resultValue"
            active-color="#13ce66"
            inactive-color="#999999"
          />

          <!-- 枚举 -->
          <span v-if="i.informationType==='Enum'">
            <el-radio-group v-model="i.optionGuid">
              <el-radio
                v-for="(item,index) of i.optionList"
                :key="index"
                :label="item.optionGuid"
              >{{ item.optionLabel }}</el-radio>
            </el-radio-group>
          </span>

          <!-- 复选 -->
          <template v-if="i.informationType==='Array'">
            <el-checkbox-group v-model="i.optionValue">
              <el-checkbox
                v-for="(item,index) of i.optionList"
                :key="index"
                :label="item.optionGuid"
              >{{ item.optionLabel }}</el-checkbox>
            </el-checkbox-group>
          </template>
          <div class="subject-unit">{{ i.subjectUnit }}</div>
        </div>
      </div>
    </div>
    <div class="foot-btn">
      <el-button type="danger" @click="cancel">取 消</el-button>
      <el-button type="primary" @click="updateData">更 新</el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

import {
  GetHealthInformationAsync,
  UpdateHealthInformationAsync
} from '@/api/HealthDocumentation/HealthInformation'
export default {
  data() {
    return {
      loading: false,
      list: []
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
        res = res.data

        // 数组 // 枚举
        res.forEach(i => {
          const result = ['Array', 'Enum'].some(a => i.informationType === a)

          if (result) {
            if (!i.optionValue || !i.optionGuids) {
              i.optionValue = []
              i.optionGuids = []
            } else {
              i.optionGuids = JSON.parse(i.optionGuids)
              i.optionValue = JSON.parse(i.optionValue)
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

        this.list = res
        console.log(this.list)
        setTimeout(() => {
          // this.list = [{}, {}, {}, {}, {}];
          this.loading = false
        }, 200)
      })
    },

    updateData() {
      const items = this.list.map(i => {
        const temp = {
          informationGuid: i.informationGuid,
          resultValue: i.resultValue,
          optionGuids: []
        }

        if (i.informationType === 'Array') {
          temp.optionGuids = i.optionValue
        }

        if (i.informationType === 'Enum' && i.optionGuid) {
          temp.optionGuids = [i.optionGuid]
        }

        return temp
      })
      // console.log(items);

      // return;
      // console.log(this.list);
      this.loading = true

      UpdateHealthInformationAsync({
        userGuid: this.userGuid,
        items
      })
        .then(res => {
          this.$success('更新信息成功。')
          setTimeout(() => {
            this.loading = false
          }, 222)
        })
        .catch(() => {
          this.loading = false
        })
    },

    cancel() {
      this.set_dialog(false)
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  min-height: 300px;
  max-height: 500px;
  margin-top: 10px;
  overflow-y: auto;

  .list {
    padding: 10px 5px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;

    .subject-name {
      width: 200px;
      margin-right: 10px;
      text-align: right;
    }
  }
}

.opts {
  width: 70%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
}

.subject-unit {
  text-indent: 1em;
}
.foot-btn {
  margin-top: 20px;
  text-align: center;
}

/deep/.el-checkbox {
  min-width: 150px;
}
</style>
