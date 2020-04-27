<template>
  <div style="position:relative">
    <div v-if="!option.xAxis[0].data.length" class="no-data">暂无数据</div>

    <template>
      <i class="el-icon-caret-left icon" @click="prev" />
      <i class="el-icon-caret-right icon" @click="next" />
      <div ref="lineChart" v-loading="list.loading" class="lineChart" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { parseTime } from '@/utils'
import echarts from 'echarts'
import { GetHealthIndicatorDetails } from '@/api/HealthDocumentation/HealthIndicator'
export default {
  props: {
    guid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: {
        loading: false, // 前端的
        userGuid: '',
        indicatorGuid: '',
        pageIndex: 1,
        pageSize: 5
      },
      totalCount: 0,
      option: {
        type: 'line',

        // x轴
        xAxis: [
          {
            // 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
            type: 'category',

            // 坐标轴名称的文字样式。
            nameTextStyle: {},

            // 数据从y轴开始
            boundaryGap: false,

            // x轴数据
            data: [],

            axisTick: {
              // 可以保证刻度线和标签对齐
              alignWithLabel: true
            },

            // 坐标轴轴线相关设置。
            axisLine: {
              // X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上
              onZero: true,
              lineStyle: {
                color: '#99999'
              }
            },
            scale: true
          }
        ],

        // y轴
        yAxis: [
          {
            // 数值轴，适用于连续数据。
            type: 'value',

            // 坐标轴轴线相关设置。
            axisLine: {
              // X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上
              onZero: true,
              lineStyle: {
                color: '#99999'
              }
            },
            nameTextStyle: {
              fontStyle: 'oblique'
            }
          }
        ],

        // 提示框组件。
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#409EFF'
            }
          }
        },

        // 指示标
        legend: {
          data: []
        },

        // 布局
        grid: {
          top: '15%',
          bottom: '10%',
          left: '10%',
          right: '10%',
          containLabel: true
        },

        // 数据
        series: [],

        // toolbox: {
        //   show: true,
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },

        // 颜色
        color: [
          '#2196F3',
          '#AB47BC',
          '#FF8A80',
          '#FF80AB',
          '#EA80FC',
          '#673AB7',
          '#3F51B5',
          '#EF5350',
          '#29B6F6',
          '#00ACC1',
          '#FFEA00',
          '#FFAB00',
          '#FF6D00'
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userGuid: state => state.member.member_vip_id,
      indicatorGuid: state => state.member.current_openDrawer_id
    }),
    totalPage() {
      return Math.ceil(this.totalCount / this.list.pageSize)
    }
  },
  created() {
    this.list.loading = true
    this.getData()
  },
  mounted() {
    this.lineChart = echarts.init(this.$refs.lineChart)
    // this.lineChart.setOption(this.option);
  },
  methods: {
    getData() {
      this.list.userGuid = this.userGuid
      this.list.indicatorGuid = this.indicatorGuid

      GetHealthIndicatorDetails(this.list)
        .then(res => {
          this.handleData(res.data)
          this.totalCount = res.data.totalCount
          this.list.loading = false
        })
        .catch(() => {
          this.list.loading = false
        })

      // setTimeout(() => {
      //   this.list.currentPage = val;
      //   this.list.loading = false;
      // }, 555);
    },
    handleData(data) {
      // 指示标（名称）
      this.option.legend.data = data.detailList.map(
        a => a.optionName + (a.optionUnit ? `(${a.optionUnit})` : '')
      )

      // x轴数据（日期）
      this.option.xAxis[0].data = data.dateList.map(
        i => parseTime(i)
        // , "{y}-{m}-{d}"
      )

      // 数据
      this.option.series = data.detailList.map(i => {
        return {
          name: i.optionName + (i.optionUnit ? `(${i.optionUnit})` : ''),
          type: 'line',
          data: i.optionList.map(a => a.value),
          markLine: {
            symbol: 'none',
            label: {
              position: 'middle' // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
            },
            data: [
              {
                silent: true,
                yAxis: i.minValue ? i.minValue : 'null'
              },
              {
                silent: true,
                yAxis: i.maxValue ? i.maxValue : 'null'
              }
            ]
          }
        }
      })
      // console.log(data);
      // console.log(this.option);

      this.lineChart.setOption(this.option)

      window.addEventListener('resize', () => {
        this.lineChart.resize()
      })
    },
    prev() {
      if (this.totalPage === this.list.pageIndex) {
        this.$error('已无更多数据。')
        return
      }
      this.list.pageIndex++

      this.getData()
    },
    next() {
      if (this.list.pageIndex === 1) {
        this.$error('已无更多数据。')
        return
      }
      this.list.pageIndex--

      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.lineChart {
  height: 400px;
  padding: 0 20px;
  padding-bottom: 20px;
}

.icon {
  opacity: 0.5;
  z-index: 1;
  position: absolute;
  transition: 0.2s ease;
  transform: scale(5);
  top: 49%;

  &:hover {
    opacity: 0.8;
    color: #409eff;
  }
}

.el-icon-caret-left {
  left: 10px;
}

.el-icon-caret-right {
  right: 30px;
}

.no-data {
  position: absolute;
  left: 40%;
  top: 50%;
  font-size: 36px;
  line-height: 50px;
  font-weight: bold;
  text-shadow: 5px 5px 5px #9999;
  margin-top: calc(-50px / 2);
}
</style>
