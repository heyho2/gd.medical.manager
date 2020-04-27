
<template>
  <!-- 今日微信扫码收款情况(元) -->
  <div style="width:100%;height:100%">

    <title-box :title="title" />
    <div
      ref="bar"
      class="bar"
    />
  </div>
</template>

<script>
import echarts from 'echarts'
import { GetDayWeChatDetailAsync } from '@/api/DataBoard'
require('echarts/theme/macarons') // echarts theme
import { colors } from './common/color'
import resize from '@/mixins/resize'
import titleBox from './title-box'
import { turnWan } from '@/utils'

export default {
  components: {
    titleBox
  },
  mixins: [resize],
  props: {},
  data() {
    return {
      chart: null,
      title: '今日微信扫码收款情况(万元)',
      color: ['#1DB0B8', '#37C6C0', '#D0E9FF', '#c7353a', '#f5b91e'],
      opt: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // 布局
        grid: {
          top: '15',
          left: '10',
          right: '20',
          bottom: '0',
          containLabel: true
        },
        // 横坐标
        xAxis: [
          {
            type: 'category',
            data: [
              '健安医院',
              '国丹中医院',
              '雪象医院',
              '罗岗医院',
              '仁康医院'
            ],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#fff' // 坐标字体颜色
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(82, 139, 255, 0.4)' // 更改坐标轴颜色
              }
            },
            nameLocation: 'end', // 坐标轴名称显示位置。
            axisLabel: {
              // 坐标轴刻度标签的相关设置。
              interval: 0,
              rotate: '45',
              color: '#fff',
              fontSize: '10'
            }
          }
        ],
        // 纵坐标
        yAxis: {
          // min: 0,
          splitNumber: 5,
          // boundaryGap: [0.2, 0.2],
          type: 'value',
          scale: true, // 只在数值轴中有效
          splitLine: {
            // 网格线
            lineStyle: {
              color: ['rgba(153，153,153,.3)', 'rgba(153,153,153,.3)'],
              type: 'dashed' // 设置网格线类型 dotted：虚线   solid:实线
            },
            show: true // 隐藏或显示
          },

          axisLabel: {
            textStyle: {
              color: '#fff' // 坐标字体颜色
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(82, 139, 255, 0.4)' // 更改坐标轴颜色
            }
          }
        },
        series: [
          {
            cursor: 'default',
            name: '',
            type: 'bar',
            barWidth: '50%',
            data: []
          }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.chart = echarts.init(this.$refs.bar, 'macarons')
  },
  methods: {
    getData() {
      GetDayWeChatDetailAsync().then(res => {
        res = res.data

        if (!res || !res.dayWeChatDetailList) return

        this.opt.xAxis[0].data = res.dayWeChatDetailList.map(a => {
          return a.hospitalName
        })

        this.opt.series[0].data = res.dayWeChatDetailList.map(a => {
          return {
            name: a.hospitalName,
            color: '#fff',
            value: turnWan(a.totalMoney),
            itemStyle: {
              normal: {
                // 内发光
                shadowBlur: 5,
                shadowColor: colors(a.hospitalName).start,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colors(a.hospitalName).start
                  },
                  {
                    offset: 1,
                    color: colors(a.hospitalName).end
                  }
                ])
              },
              emphasis: {
                shadowBlur: 15,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
              }
            },
            label: {
              show: a.totalMoney > 0, // 开启显示
              position: 'inside', // 在内部显示
              textStyle: {
                // 数值样式
                color: '#fff'
              }
            }
          }
        })

        this.opt.xAxis[0].axisLabel.formatter = params => {
          // 坐标轴刻度标签的相关设置。

          const str = `${params} \n`

          // let money = `<span style="text-align:center;color:${
          //   colors(params).start
          // }">(${turnWan(
          //   res.dayWeChatDetailList.find(a => a.hospitalName === params)
          //     .totalMoney
          // )})</span>`;

          // let money = turnWan(
          //   res.dayWeChatDetailList.find(a => a.hospitalName === params)
          //     .totalMoney
          // );

          return str
        }

        this.chart.setOption(this.opt)
      })
    },
    turnWan
  }
}
</script>

<style lang="scss" scoped>
.bar {
  width: 100%;
  height: 65%;
}
</style>
