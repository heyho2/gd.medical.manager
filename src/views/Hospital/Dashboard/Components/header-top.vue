<template>
  <div class="c-top">

    <div class="c-top-left">
      <!-- <iframe width="225"
              scrolling="no"
              height="80"
              frameborder="0"
              allowtransparency="true"
              src="//i.tianqi.com/index.php?c=code&id=8&color=%23FFFFFF&icon=1&num=1&site=18"></iframe> -->
      <div
        v-if="weather.high"
        class="high"
      >{{ `${weather.high}℃` }}</div>
      <div class="wea">
        <div>{{ weather.cityName||'' }}</div>
        <div v-if="weather.low&&weather.high">{{ `${weather.low}℃  ~  ${weather.high}℃` }}　 {{ weather.wea||'' }}</div>
      </div>
      <div class="space" />
    </div>

    <transition name="el-fade-in-linear">
      <div
        v-if="nowTime"
        class="c-top-right"
      >
        <div>
          {{ parseTime(nowTime,`{y}-{m}-{d}`) }}
        </div>
        <div>
          {{ parseTime(nowTime,`{h}:{i}:{s}`) }}
        </div>
      </div>
    </transition>
  </div>

</template>

<script>
import { SystemTime, GetWeatherForecast } from '@/api/Common'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      time: null, // 现实时间
      nowTime: null,
      ip: null,
      weather: {
        cityName: '',
        low: '',
        high: '',
        wea: ''
      }
    }
  },
  created() {
    SystemTime().then(res => {
      this.setTime = res.data
      this.time = setInterval(() => {
        res.data += 1000
        this.nowTime = res.data
      }, 1000)
    })
  },
  mounted() {
    this.ip = returnCitySN['cip']

    this.getWeather()
  },
  methods: {
    getWeather() {
      GetWeatherForecast(this.ip).then(res => {
        this.weather = res.data

        setTimeout(() => {
          this.GetWeatherForecast()
        }, 1000 * 60 * 60 * 3)
      })
    },
    parseTime
  }
}
</script>

<style lang="scss" scoped>
.c-top {
  background-image: url("./common/head.png");
  background-position: 50% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 7rem;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;

  .c-top-left {
    position: relative;
    color: #fff;
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    user-select: none;
    font-size: 0.8rem;

    .high {
      display: flex;
      align-items: center;
      height: 50%;
      font-size: 2.857143rem /* 40/14 */;
      border-right: 1px solid #fff;
      padding: 0 1rem;
    }
    .wea {
      height: 50%;
      padding: 0 1rem;
      display: flex;
      font-size: 1.142857rem /* 16/14 */;
      flex-direction: column;
      justify-content: space-between;
    }

    .space {
      position: absolute;
      top: 0%;
      left: 0%;
      right: 0%;
      bottom: 0%;
      width: 100%;
      height: 100%;
      z-index: 1000;
      user-select: none;
    }
  }
  .c-top-right {
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    // font-family: "Share Tech Mono", monospace;
    color: #fff;
    // text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
    font-size: 1rem /* 14/14 */;

    div {
      text-align: center;
      width: 100%;

      &:first-child {
        letter-spacing: 0.05em;
        font-size: 1.142857rem /* 16/14 */;
      }

      &:last-child {
        letter-spacing: 0.05em;
        font-size: 2.857143rem /* 40/14 */;
        padding: 0.357143rem /* 5/14 */ 0;
      }
    }
  }
}
</style>
