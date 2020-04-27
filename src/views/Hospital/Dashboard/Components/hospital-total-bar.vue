<template>
  <div class="bar-section">
    <title-box :title="title" />
    <div class="content">
      <!-- 名字 -->
      <div class="name-list">
        <template v-for="(i, n) of list">
          <div
            :key="n"
            class="name"
          >
            <small>{{ i.hospitalName }}</small>
            <small
              v-if="i.monthGoal"
              :style="{ color: colors(i.hospitalName).text }"
            >
              <!-- (目标：{{ unitConvert(i.monthGoal, 0).num + unitConvert(i.monthGoal).unit }}) -->
              (目标：{{ turnWan(i.monthGoal) + unitConvert(i.monthGoal).unit }})

            </small>
          </div>
        </template>
      </div>

      <!-- bar图标 -->
      <div class="bar-content">
        <template v-for="(i, n) of list">
          <el-tooltip
            :key="n"
            placement="top"
            :class="{ vhidden: i.monthGoal <= 0 }"
          >
            <div slot="content">
              {{ `月目标：${(i.monthGoal / 10000).toFixed(2)} ` }}
              <br>
              <br>
              {{ `达成金额:${(i.monthCompleteGoal/ 10000).toFixed(2)}` }}
            </div>

            <div
              :key="n"
              class="bar"
              :style="{ width: i.width + '%' }"
            >
              <div
                class="bar-outer"
                :style="{ width: calBorder(i) + '%' }"
                :class="{ 'bar-outer-f': i.monthCompleteGoal > i.monthGoal }"
              >
                <div class="bar-txt-per">{{ calInnerPer(i) }}</div>
              </div>

              <div
                :class="[i.monthCompleteGoal <= 0 ? 'bar-border' : 'bar-inner']"
                :style="{ width: calInnerWidth(i) + '%', background: calcBackground(i) }"
              />
            </div>
          </el-tooltip>
        </template>

        <div class="bar-x">
          <div
            v-for="(i, n) of x"
            :key="n"
          >{{ i }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import titleBox from './title-box'
import { GetMonthDetailAsync } from '@/api/DataBoard'
import { colors } from './common/color'
import { unitConvert, turnWan } from '@/utils'
export default {
  components: {
    titleBox
  },
  data() {
    return {
      title: '医院本月累计已完成（万元）',
      linearColorList: [
        {
          hospitalName: '健安',
          start: 'rgba(17,174,225,1)',
          end: 'rgba(83,237,255,1)'
        },
        {
          hospitalName: '中',
          start: 'rgba(253,130,30,1)',
          end: 'rgba(255,211,115,1)'
        },
        {
          hospitalName: '雪象',
          start: 'rgba(137,6,249,1)',
          end: 'rgba(181,95,255,1)'
        },
        {
          hospitalName: '罗岗',
          start: 'rgba(229,46,46,1)',
          end: 'rgba(255,134,74,1)'
        },
        {
          hospitalName: '仁康',
          start: 'rgba(87,211,185,1)',
          end: 'rgba(131,233,212,1)'
        }
      ],
      list: [
        {
          hospitalName: '健安医院',
          monthGoal: 0,
          monthCompleteGoal: 0,
          width: 0
        },
        {
          hospitalName: '国丹中医院',
          monthGoal: 0,
          monthCompleteGoal: 0,
          width: 0
        },
        {
          hospitalName: '雪象医院',
          monthGoal: 0,
          monthCompleteGoal: 0,
          width: 0
        },
        {
          hospitalName: '罗岗医院',
          monthGoal: 0,
          monthCompleteGoal: 0,
          width: 0
        },
        {
          hospitalName: '仁康医院',
          monthGoal: 0,
          monthCompleteGoal: 0,
          width: 0
        }
      ],
      x: [],
      xMax: 0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      GetMonthDetailAsync().then(res => {
        this.list = res.data

        const num = this.list[0].month

        this.title = `医院${Number(num)}月份累计已完成（万元）`

        this.list.forEach(i => {
          if (!i.monthCompleteGoal) i.monthCompleteGoal = 0
          if (!i.monthGoal) i.monthGoal = 0
        })
        this.calcBarWidth()
      })
    },
    // 计算外层宽度
    calcBarWidth() {
      this.list.forEach(a => {
        a.max = Math.max.apply(null, [a.monthGoal, a.monthCompleteGoal])
      })

      const maxArr = this.list.map(a => a.max) // 本月目标值

      const max = Math.max.apply(null, maxArr)

      // 获取最大值搞坐标用的
      this.xMax = max

      this.calcX()

      this.list.forEach(a => {
        if (a.monthCompleteGoal <= 0) {
          a.width = (a.max / this.xMax) * 100
        }

        if (a.max === max) a.width = 100

        if (a.max < max) {
          a.width = (a.max / max) * 100
        }

        if (a.width <= 0) {
          a.width = (a.monthGoal / this.xMax) * 100
        }
      })
    },

    // 计算边框
    calBorder(i) {
      let res = (i.monthGoal / i.monthCompleteGoal) * 100

      if (i.monthGoal < i.monthCompleteGoal) {
        res = (i.monthCompleteGoal / i.monthGoal) * 100

        if (res > 100) res = 100
      }

      if (i.monthCompleteGoal <= 0) {
        i.width = (i.monthGoal / this.xMax) * 100
        res = (i.monthGoal / this.xMax) * 100
      }

      return res
    },

    // 计算内部宽度
    calInnerWidth(i) {
      const target = Number(i.monthGoal.toFixed(0))
      const finish = Number(i.monthCompleteGoal.toFixed(0))

      let res = 0

      if (finish < target) {
        res = (finish / target) * 100
      }

      if (finish >= target) {
        res = (target / finish) * 100
      }

      return res
    },

    // 计算百分比
    calInnerPer(i) {
      if (!i) return ''

      if (i.monthGoal == 0 || i.monthCompleteGoal == 0) return '0%'

      const target = Number(i.monthGoal.toFixed(0))
      const finish = Number(i.monthCompleteGoal.toFixed(0))

      const res = (finish / target) * 100

      let a = res.toString().split('.')[0]
      const b = res.toString().split('.')[1]

      if (b) {
        const ba = b.split('')[0]
        const bb = b.split('')[1]
        if (ba) {
          a += '.' + ba
          if (bb) {
            a += bb
          }
        }
      } else {
        a += '.00'
      }

      let per = a

      if (!a) {
        const per = parseInt(res)
      }

      per = typeof per === 'NaN' ? '' : per + '%'

      return per
    },

    // 计算X轴坐标值
    calcX(n) {
      if (this.xMax > 0) {
        this.x = new Array(5)

        for (let i = 1; i <= this.x.length; i++) {
          this.x[i - 1] = (((this.xMax / 5) * i) / 10000).toFixed(2)
        }
      }
    },

    // 计算背景颜色
    calcBackground(i) {
      // 如果完成值为0 返回透明
      if (i.monthCompleteGoal <= 0) return ''
      const item = colors(i.hospitalName)
      const start = item.start
      const end = item.end
      return `linear-gradient(-90deg,${start},${end})`
    },
    colors,
    unitConvert,
    turnWan
  }
}
</script>

<style lang="scss" scoped>
.bar-x {
  position: absolute;
  bottom: -1.071429rem /* 15/14 */;
  width: 100%;
  display: flex;
  div {
    text-align: right;
    width: 20%;
  }
}

.content {
  position: relative;
  width: 100%;
  height: calc(100% - 2rem);
  padding: 0 1rem 2rem 1rem;
  color: #fff;
  font-size: 0.9rem /* 14/14 */;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;

  .name-list {
    margin-right: 0.5rem;
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    // display: flex;
    // flex-direction: column;
    .name {
      //  flex: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: 6.4rem;
      margin: auto;

      small {
        &:nth-of-type(2) {
          margin-top: 0.3rem;
        }
      }
    }
  }

  .bar-content {
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    //     display: flex;
    // flex-direction: column;
    height: 100%;
    width: 79%;
    position: relative;
    border-left: 0.071429rem solid rgba(82, 139, 255, 0.4);
    border-bottom: 0.071429rem solid rgba(82, 139, 255, 0.4);

    .bar {
      // flex: 1;
      cursor: pointer;
      position: relative;
      height: 50%;
      margin: auto 0;
      transition: 2s ease-in-out;
      margin-left: -1px;

      &:hover {
        transition: 0.4s;
        transform: translateY(-10px);
        height: 55%;
      }

      .bar-outer,
      .bar-inner,
      .bar-border {
        max-width: 100%;
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        height: 100%;
        width: 0;
        border-top-right-radius: 1.071429rem /* 15/14 */;
        border-bottom-right-radius: 1.071429rem /* 15/14 */;
        box-shadow: 0 0 8px 0px rgba(255, 255, 255, 0.2);
        transition: all 2s ease-in-out;
      }
      .bar-border {
        border: solid #fff 1px;
      }

      .bar-outer {
        border: solid #fff 1px;
      }

      .bar-outer-f {
        position: relative;
        // background: linear-gradient(-180deg, #ff3232, #771515);
        background-color: #ff3232;
        border: none;
      }

      .bar-txt {
        font-size: 0.857143rem /* 12/14 */;
        transition: all 2s ease-in-out;
        z-index: 5;
        margin: auto;
      }

      .bar-inner {
        display: flex;
        z-index: 1;
      }
      .bar-txt-per {
        transition: all 2s ease-in-out;
        position: absolute;
        top: 25%;
        right: -4rem;
      }
    }
  }
}

.vhidden {
  visibility: hidden;
}
</style>
