<template>
  <div>
    <title-box :title="title" />
    <div ref="line"
         class="line" />
  </div>
</template>

<script>
import { GetTrendAsync } from "@/api/DataBoard";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/mixins/resize";
import titleBox from "./title-box";
import { colors } from "./common/color";
export default {
  components: {
    titleBox
  },
  mixins: [resize],
  data() {
    return {
      title: "医院业绩趋势统计(万元)",
      chart: null,
      opt: {
        // 鼠标经过提示
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            let temp =
              new Date().getMonth() +
              1 +
              "月" +
              params[0].axisValue +
              "日" +
              "<br>";

            for (var i = 0; i < params.length; i++) {
              var color = colors(params[i].seriesName).start; //图例颜色
              var span = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color}"></span>`;
              //名称
              var text = params[i].seriesName;
              //值
              var value = params[i].value;
              temp += span + text + " : " + value + "<br>";
            }
            return temp;
          }
        },
        // 示例
        legend: {
          icon: "roundRect", // icon为圆角矩形
          x: "center",
          bottom: "20",
          data: ["健安医院", "国丹中医院", "雪象医院", "罗岗医院", "仁康医院"],
          textStyle: {
            // 图例文字的样式
            color: "#fff"
          },
          itemWidth: 10,
          itemHeight: 10
        },
        // 定位
        grid: {
          left: 10,
          top: 20,
          right: 10,
          bottom: 60,
          containLabel: true
        },
        // 横坐标
        xAxis: {
          type: "category",
          axisLine: {
            show: true
          },
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            // 网格线
            lineStyle: {
              color: ["rgba(153，153,153,.3)"],
              type: "dashed" // 设置网格线类型 dotted：虚线   solid:实线
            },
            show: true // 隐藏或显示
          },
          axisLabel: {
            textStyle: {
              color: "#fff" // 坐标字体颜色
            }
          },
          axisLine: {
            lineStyle: {
              color: "rgba(82, 139, 255, 0.4)" // 更改坐标轴颜色
            }
          },
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },

        // 纵坐标
        yAxis: {
          type: "value",
          min: 0,
          scale: true, // 只在数值轴中有效
          splitLine: {
            // 网格线
            lineStyle: {
              color: ["rgba(153，153,153,.3)", "rgba(153,153,153,.3)"],
              type: "dashed" // 设置网格线类型 dotted：虚线   solid:实线
            },
            show: true // 隐藏或显示
          },
          axisLabel: {
            textStyle: {
              color: "#fff" // 坐标字体颜色
            }
          },
          axisLine: {
            lineStyle: {
              color: "rgba(82, 139, 255, 0.4)" // 更改坐标轴颜色
            }
          }
        },
        series: []
      }
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.chart = echarts.init(this.$refs.line);
  },
  methods: {
    getData() {
      GetTrendAsync().then(res => {
        res = res.data;

        const num = res.collectionDates[0].split("-")[1];

        this.title = `医院${Number(num)}月份业绩趋势统计(万元)`;

        this.opt.xAxis.data = res.collectionDates.map(a => {
          const day = a.split("-")[2];
          return /^0/.test(day) ? day.replace(/0/, "") : day;
        });

        this.opt.legend.data = res.hospitalList.map(a => {
          return a.value;
        });

        this.opt.series = res.datas.map(a => {
          const hospitalName = res.hospitalList.filter(
            b => b.key == a.hospitalGuid
          )[0].value;

          const linnerColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: colors(hospitalName).start
            },
            {
              offset: 1,
              color: colors(hospitalName).end
            }
          ]);

          return {
            name: res.hospitalList.filter(b => b.key == a.hospitalGuid)[0]
              .value,
            type: "line",
            itemStyle: {
              normal: {
                color: linnerColor,
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 2,
                  type: "solid",
                  color: linnerColor // 线条渐变色
                }
              },
              emphasis: {
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 10,
                  type: "dotted",
                  color: linnerColor
                }
              }
            }, // 线条样式
            data: a.value.map(c => (c / 10000).toFixed(2))
          };
        });
        this.chart.setOption(this.opt);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: calc(100% - 1.3rem);
}
</style>
