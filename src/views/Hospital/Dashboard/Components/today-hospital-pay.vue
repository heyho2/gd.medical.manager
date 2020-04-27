<template>
  <div>
    <title-box
      :title="title"
      :update-time="updateTime"
    />
    <div
      ref="pie"
      class="pie"
    />
  </div>
</template>

<script>
import { GetDayWeChatScaleAsync } from '@/api/DataBoard'
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
      chart: null,
      title: '单日医院业绩占比',

      updateTime: new Date() + '',
      opt: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        title: {
          text: '',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 16,
            color: '#fff'
          }
        },
        legend: {
          bottom: '10',
          textStyle: {
            color: '#b6d7ff'
          },
          itemWidth: 10,
          itemHeight: 10,
          data: ['健安医院', '国丹中医院', '雪象医院', '罗岗医院', '仁康医院']
        },
        series: [
          {
			  cursor: 'default',
            name: '业绩占比',
            type: 'pie',
            radius: '45%',
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            label: {
              color: '#b6d7ff',
              formatter: '{b} \n  ({d}%)'
            },
            emphasis: {
              label: {
                fontWeight: 'bold',
                position: 'center'
              }
            },
            color: [],
            data: [],
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
    this.getData()
  },
  mounted() {
    this.chart = echarts.init(this.$refs.pie, 'macarons')
  },
  methods: {
    getData() {
      GetDayWeChatScaleAsync().then(res => {
        res = res.data
        if (!res || !res.dayWeChatDetailList) return

        this.updateTime = res.updateDate
        this.opt.series[0].data = res.dayWeChatDetailList
          .filter(b => b.hospitalGuid != null)
          .map(a => {
            return {
              name: a.hospitalName,
              value: a.totalMoney,
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
        this.opt.legend.data = res.dayWeChatDetailList
          .filter(b => b.hospitalGuid != null)
          .map(a => {
            return a.hospitalName
          })
        this.opt.series[0].color = res.dayWeChatDetailList

          .filter(b => b.hospitalGuid != null)
          .map(a => {
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

        const totalCount = addAll(res.dayWeChatDetailList, 'totalMoney')

        this.opt.title.text = `总金额\n \n${totalCount}元`

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
