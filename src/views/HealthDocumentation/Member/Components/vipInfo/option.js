const colors = [
  '#EF5350',
  '#EC407A',
  '#AB47BC',
  '#FF8A80',
  '#FF80AB',
  '#EA80FC',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#29B6F6',
  '#00ACC1',
  '#FFEA00',
  '#FFAB00',
  '#FF6D00'
]

const x = [
  {
    // 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
    type: 'category',

    // 坐标轴名称的文字样式。
    nameTextStyle: {},

    // x轴数据
    data: [],

    axisTick: {
      // 可以保证刻度线和标签对齐
      alignWithLabel: true
    },

    // 坐标轴轴线相关设置。
    axisLine: {
      // X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上
      onZero: false,
      lineStyle: {
        color: '#999'
      }
    }
  }
]

const y = [
  {
    // 数值轴，适用于连续数据。
    type: 'value',

    // 坐标轴轴线相关设置。
    axisLine: {
      // X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上
      onZero: false,
      lineStyle: {
        color: '#999'
      }
    }
  }
]

const legend = []

const series = []

export default {

  type: 'line',

  // x轴
  xAxis: x,

  // y轴
  yAxis: y,

  // 提示框组件。
  tooltip: {
    trigger: 'axis'
  },

  // 指示标
  legend: {
    data: legend
  },

  // 布局
  grid: {
    top: '10%',
    bottom: '10%',
    left: '10%',
    right: '10%'
  },

  // 数据
  series: series,

  toolbox: {
    show: true,
    feature: {
      saveAsImage: {}
    }
  },

  // 颜色
  color: colors
}
