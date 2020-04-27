<template>
  <div>
    <title-box
      :title="title"
      :update-time="updateTime"
    />
    <div
      ref="pop"
      class="pop"
    />
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from '@/mixins/resize'
import titleBox from './title-box'
import 'echarts-liquidfill/src/liquidFill.js'
import { colors } from './common/color'
import { GetDayAchievementAsync } from '@/api/DataBoard'
import { unitConvert } from '@/utils'
export default {
  components: {
    titleBox
  },
  mixins: [resize],
  data() {
    return {
      updateTime: '',
      title: '医院业绩日报(元)',
      chart: null,
      opt: null
    }
  },

  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      GetDayAchievementAsync().then(res => {
        res = res.data
        this.updateTime = res.updateDate
        const title = []
        const series = []

        if (!res.dayAchievementDetailList) return

        res.dayAchievementDetailList.forEach((item, index) => {
          // 字体

          const target = unitConvert(item.todayGoal) // 金钱
          const bi = item.chainRatio ? `${item.chainRatio}%` : '-' // 日环比

          const colorLiner = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            {
              offset: 0,
              color: colors(item.hospitalName).start
            },
            {
              offset: 1,
              color: colors(item.hospitalName).end
            }
          ])

          title.push(
            // 今日完成
            {
              text: item.todayCompleteGoal,
              left: index * 20 + 9 + '%',
              top: '10%',
              textAlign: 'center',
              textStyle: {
                fontWeight: 'bold',
                fontSize: '20',
                color: colors(item.hospitalName).text,
                textAlign: 'center'
              }
            },
            {
              text: `日目标： ${target.num + target.unit}`,
              left: index * 20 + 9.3 + '%',
              top: '65%',
              textAlign: 'center',
              textStyle: {
                fontWeight: 'normal',
                fontSize: '12',
                color: '#fff',
                textAlign: 'center'
              }
            },
            // 环比
            {
              text: `日环比： ${bi}`,
              left: index * 20 + 9.3 + '%',
              top: '73%',
              textAlign: 'center',
              textStyle: {
                fontWeight: 'normal',
                fontSize: '12',
                color: '#fff',
                textAlign: 'center'
              }
            },
            // 名字
            {
              text: item.hospitalName,
              left: index * 20 + 9.3 + '%',
              bottom: '10%',
              textAlign: 'center',
              textStyle: {
                fontWeight: 'normal',
                fontSize: '15',
                color: colors(item.hospitalName).text,
                textAlign: 'center'
              }
            }
          )

          // 水球数据
          let val = item.todayCompleteGoal / item.todayGoal

          if (val + '' === 'NaN') val = 0

          // 球
          series.push({
            type: 'liquidFill',
            name: item.hospitalName,
            radius: '30%',
            color: [
              colors(item.hospitalName).start,
              colors(item.hospitalName).end
            ],

            // 内发光
            itemStyle: {
              shadowBlur: 30,
              shadowColor: colors(item.hospitalName).start,
              borderColor: colorLiner
            },

            // 定位
            center: [index * 20 + 10 + '%', '40%'],
            data: val > 0 ? [val, val, val, val, val] : [],

            // 背景颜色
            backgroundStyle: {
              borderColor: val >= 98 ? colorLiner : 'rgba(0,0,0,0.2)',
              color: val >= 98 ? colorLiner : 'rgba(0,0,0,0.2)'
            },

            // 外层圈圈
            outline: {
              itemStyle: {
                // 发光
                shadowBlur: 35,
                borderWidth: 15,
                shadowColor: colors(item.hospitalName).start,
                borderColor: colorLiner
              }
            },

            // 中间字
            label: {
              normal: {
                formatter: val ? (val * 100).toFixed(2) + '%' : '暂未上报',
                textStyle: {
                  fontSize: 16,
                  color: '#fff'
                }
              }
            }
          })
        })

        this.opt = { title, series }

        this.chart = echarts.init(this.$refs.pop)

        this.chart.setOption(this.opt)
      })
    }
  }
}
</script>
<style>
	.pop div,.pie div,.bar div,.line div{
		margin: 0 auto !important;
	}
</style>
<style lang="scss" scoped>
.pop {
  width: 100%;
  height: calc(100% - 1.3rem);
}
</style>
