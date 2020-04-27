<template>
  <div>
    <title-box :title="title" />
    <div
      ref="pie"
      class="pie"
    />
  </div>
</template>

<script>
import { GetLastDayWeChatPayCountAsync } from '@/api/DataBoard'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/mixins/resize'
import { colors } from './common/color'
import CountTo from 'vue-count-to'
import titleBox from './title-box'
import { addAll } from '@/utils'
export default {
  components: {
    CountTo,
    titleBox
  },
  mixins: [resize],
  data() {
    return {
      title: '昨日微信扫码支付笔数占比',
      updateTime: new Date() + '',
      opt: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          // type: "scroll",
          // orient: "vertical",
          bottom: '10',
          textStyle: {
            color: '#b6d7ff'
          },
          itemWidth: 10,
          itemHeight: 10,
          data: []
        },
        title: {
          text: '',
          x: 'center',
          y: '35%',
          textStyle: {
            fontSize: 14,
            color: '#fff'
          }
        },
        series: [
          {
            cursor: 'default',
            name: '支付占比',
            type: 'pie',

            radius: ['30%', '50%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: true,
            data: [
              { value: 0, name: '健安医院' },
              { value: 0, name: '国丹中医院' },
              { value: 0, name: '雪象医院' },
              { value: 0, name: '罗岗医院' },
              { value: 0, name: '仁康医院' }
            ],
            label: {
              textStyle: {
                color: '#b6d7ff'
              },
              formatter: '{b}\n     ({d}%)'
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function(idx) {
              return Math.random() * 200
            }
          }
        ]
      }
    }
  },
  created() {
    this.GetLastDayWeChatPayCount()
  },
  mounted() {
    this.chart = echarts.init(this.$refs.pie, 'macarons')
  },
  methods: {
    GetLastDayWeChatPayCount() {
      GetLastDayWeChatPayCountAsync().then(res => {
        res = res.data
        this.updateTime = res.updateDate

        this.opt.series[0].data = res.lastDayPayDetailList.map(a => {
          return {
            name: a.hospitalName,
            value: a.payCount,
            // 内发光
            itemStyle: {
              // shadowBlur: 5,
              shadowColor: colors(a.hospitalName).start,
              borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                {
                  offset: 0,
                  color: colors(a.hospitalName).start
                },
                {
                  offset: 1,
                  color: colors(a.hospitalName).end
                }
              ])
            }
          }
        })
        this.opt.series[0].color = res.lastDayPayDetailList.map(a => {
          return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            {
              offset: 0,
              color: colors(a.hospitalName).start
            },
            {
              offset: 1,
              color: colors(a.hospitalName).end
            }
          ])
        })

        this.opt.legend.data = res.lastDayPayDetailList.map(a => {
          return a.hospitalName
        })

        const totalCount = addAll(res.lastDayPayDetailList, 'payCount')

        this.opt.title.text = `总笔数\n \n${totalCount}`

        this.chart.setOption(this.opt)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pie {
  width: 100%;
  height: calc(100% - 1.8rem);
}
</style>
