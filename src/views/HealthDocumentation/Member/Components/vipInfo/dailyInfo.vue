<template>
  <div>
    <div v-loading="vLoading" style="height:500px;overflow-y:auto">
      <el-row v-for="(item,index) of list.items" :key="index" class="item">
        <div class="header-item" @click.stop="changeActive(index,item.indicatorGuid)">
          <el-row>
            <el-col :span="1">
              <i class="el-icon-arrow-right" :class="calShowCollapse(index)?'header_is_active':''" />
            </el-col>
            <el-col :span="14">
              <span>{{ item.indicatorName }}</span>
              <span v-if="item.indicatorType">
                （
                <span style="color:#99999">包含多个指标</span>）
              </span>
              <template v-if="!!item.resultVale">
                <span
                  v-if="!item.indicatorType"
                >{{ item.resultVale }} {{ item.optionUnit?item.optionUnit:'' }}</span>
                <template v-if="(item.maxValue>=0)||(item.minValue>=0)">
                  <i v-if="!item.indicatorType" :class="calClass(item)" />
                  <!-- :title="item.resultVale>item.maxValue?'高于正常指标':'低于正常指标'" -->
                </template>
              </template>
              <p />
            </el-col>
            <el-col :span="9">
              <div class="header-right-text">
                <el-button type="" size="mini" @click.stop="handleAddWarning(item)">预警值设置</el-button>
                <el-button type="" size="mini" @click.stop="handleAddData(item)">新增</el-button>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-collapse-transition>
          <el-row v-if="calShowCollapse(index)" class="chart-content">
            <line-chart ref="line" :guid="currentId" />
          </el-row>
        </el-collapse-transition>
      </el-row>
      <el-input
        v-model="list.suggestion"
        class="suggestion"
        type="textarea"
        placeholder="填写健康建议"
        maxlength="500"
        show-word-limit
      />
    </div>
    <div class="foot-btn">
      <el-button type="danger" :loading="vLoading||is_drawer" @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="vLoading||is_drawer" @click="updateData">更 新</el-button>
    </div>
    <addData
      :dialog-visible.sync="addData.dialogVisible"
      :indicator-guid="addData.indicatorGuid"
      :user-guid="userGuid"
      @onSuccess="onSuccess"
    />
    <addWarning
      :dialog-visible.sync="addWarning.dialogVisible"
      :indicator-guid="addWarning.indicatorGuid"
      :user-guid="userGuid"
      @onSuccess="onSuccess"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import {
  GetHealthIndicatorList,
  UpdateConsumerHealthIndicatorSuggestion
} from '@/api/HealthDocumentation/HealthIndicator'

import lineChart from './lineChart'
import addData from './addData'
import addWarning from './addWarning'

export default {
  components: {
    lineChart,
    addData,
    addWarning
  },
  computed: {
    ...mapState({
      userGuid: state => state.member.member_vip_id,
      indicatorGuid: state => state.member.current_openDrawer_id
    })
  },
  data() {
    return {
      currentId: '',
      vLoading: false,
      is_drawer: false,
      lineChart: null,
      activeIndex: [],
      lineIndex: NaN,
      list: {
        items: [],
        suggestion: ''
      },
      addData: {
        dialogVisible: false,
        indicatorGuid: null
      },
      addWarning: {
        dialogVisible: false,
        indicatorGuid: null
      }
    }
  },
  created() {
    this.getData()
  },

  methods: {
    getData(cb) {
      this.vLoading = true
      GetHealthIndicatorList({ userGuid: this.userGuid }).then(res => {
        this.list = Object.assign(this.list, res.data)
        this.vLoading = false
        cb && cb()
      })
    },
    updateData() {
      this.activeIndex = []
      UpdateConsumerHealthIndicatorSuggestion({
        userGuid: this.userGuid,
        suggestion: this.list.suggestion
      }).then(res => {
        this.$success('更新健康建议成功。')
        this.getData()
      })
    },
    cancel() {
      this.set_dialog(false)
    },
    changeActive(n, id) {
      const status = this.activeIndex.some(i => i === n)

      if (status) {
        this.activeIndex = this.activeIndex.filter(i => i !== n)
        return
      }
      this.set_current_indicatorGuid(id)
      this.currentId = id

      if (!status) this.activeIndex.push(n)
    },

    handleAddData(row) {
      this.addData.dialogVisible = true
      this.addData.indicatorGuid = row.indicatorGuid
    },
    handleAddWarning(row) {
      this.addWarning.dialogVisible = true
      this.addWarning.indicatorGuid = row.indicatorGuid
    },
    onSuccess() {
      debugger
      this.getData(() => {
        if (!this.$refs.line) return
        this.$refs.line.forEach(i => {
          if (i.list.indicatorGuid === this.indicatorGuid) {
            i.getData()
          }
        })
      })
    },
    // 计算指标上下样式
    calClass(i) {
      let res = ''
      const sum = i.resultVale
      //  item.maxValue&&(item.resultVale>item.maxValue))?'el-icon-top icon':&&(item.minValue&&(item.resultVale<item.minValue))?'el-icon-bottom icon':''
      const maxB = Number(i.maxValue)
      const minB = Number(i.minValue)
      const maxV = i.maxValue
      const minV = i.minValue
      if (maxB) {
        if (sum > maxV) {
          res = 'el-icon-top icon'
        }
      }
      if (minB) {
        if (sum < minV) {
          res = 'el-icon-bottom icon'
        }
      }
      return res
    },
    calShowCollapse(n) {
      return this.activeIndex.some(i => i === n)
    },
    ...mapMutations({
      set_dialog: 'SET_MEMBER_DIALOG_SHOW',
      set_current_indicatorGuid: 'SET_MEMBER_CURRENT_OPENDRAWER_ID'
    })
  }
}
</script>

<style lang="less" scoped>
.item {
  cursor: pointer;
  box-shadow: 0 1px 0 0 #d2d2d2, 0 1px 0 0 #d2d2d2 inset;

  .header-item {
    padding: 20px;
  }
}
.header-right-text {
  text-align: right;
  transition: all 0.3s ease;
}
.header_is_active {
  transform: rotate(90deg);
}

.chart-content {
  transition: all 0.3s ease;
}

.suggestion {
  margin: 30px 0 30px;
}

.foot-btn {
  margin-top: 20px;
  text-align: center;
}

.icon {
  padding: 2px;
  margin: 0 2px;
  color: #fff;
  border-radius: 2px;
  font-weight: bold;
  vertical-align: middle;
  background: rgb(219, 87, 87);
}

.el-icon-arrow-right {
  transition: all 0.3s ease;
}

// .el-icon-top {
//   background: rgb(219, 87, 87);
// }

// .el-icon-bottom {
//   background: rgb(87, 133, 219);
// }
</style>
