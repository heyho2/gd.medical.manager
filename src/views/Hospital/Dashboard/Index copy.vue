<template>
  <div
    class="data-section"
    @mousemove="move"
  >
    <div class="data-content">

      <!-- 顶部 -->
      <headerTop />

      <!-- 收缩导航 -->
      <transition name="el-fade-in-linear">
        <div
          v-show="isMove"
          class="hamberger"
          @click="toggleSideBar"
        >
          <img src="./Components/common/suojin.png">
        </div>
      </transition>

      <!-- 图表 -->
      <div class="c-c">
        <div class="c-left">
          <div
            class="c-box"
            style="height:50%;"
          >
            <!-- 微信扫码收款情况(元) -->
            <chat-code-total :num="monthNum" />

            <!-- 今日微信扫码收款情况(元) -->
            <chat-code-today ref="chatCodeToady" />
          </div>

          <!-- 昨日医院支付笔数占比 -->
          <yesterday-hospital-pay
            class="c-box"
            style="height:48%;"
          />
        </div>

        <div class="c-center">
          <!-- 实时金额 -->
          <real-money
            :num="realNum"
            style="height:8%;"
          />

          <!-- 医院业绩日报(元) -->
          <hospital-today-pop
            ref="hospitalTodayPop"
            class="c-box faguang"
            style="height:46%;"
          />

          <!-- 医院本月累计已完成（万元） -->
          <hospital-total-bar
            ref="hospitalTotalBar"
            class="c-box"
            style="height:46%;"
          />
        </div>

        <div class="c-right">
          <!-- 单日医院业绩占比 -->
          <today-hospital-pay
            ref="todayHospitalPay"
            class="c-box"
            style="height:50%;"
          />

          <!-- 医院业绩趋势统计(万元) -->
          <hospital-line
            ref="hospitalLine"
            class="c-box"
            style="height:48%;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<script>
import headerTop from "./Components/header-top";

import chatCodeTotal from "./Components/chat-code-total";
import chatCodeToday from "./Components/chat-code-today";
import yesterdayHospitalPay from "./Components/yesterday-hospital-pay";

import realMoney from "./Components/real-money";
import hospitalTodayPop from "./Components/hospital-today-pop";
import hospitalTotalBar from "./Components/hospital-total-bar";

import todayHospitalPay from "./Components/today-hospital-pay";
import hospitalLine from "./Components/hospital-line";

import { GetTodayTotalAsync } from "@/api/DataBoard";

export default {
  components: {
    headerTop, //头部
    chatCodeTotal, // <!-- 微信扫码收款情况(元) -->
    chatCodeToday, // <!-- 今日微信扫码收款情况(元) -->

    realMoney, // <!-- 实时金额 -->
    hospitalTotalBar, // <!-- 医院本月累计已完成（万元） -->
    hospitalTodayPop, // <!-- 医院业绩日报(元) -->

    yesterdayHospitalPay, // <!-- 昨日医院支付笔数占比 -->
    todayHospitalPay, // <!-- 单日医院业绩占比 -->
    hospitalLine // <!-- 医院业绩趋势统计(万元) -->
  },
  data() {
    return {
      realNum: 0,
      monthNum: 0,
      timer: null,
      isMove: true
    };
  },

  created() {
    GetTodayTotalAsync().then(res => {
      this.realNum = Number(res.data);
    });

    window.rabbitMQ(res => {
      res = JSON.parse(res.body);
      this.realNum += res.Amount;
      this.monthNum = res.Amount;

      switch (res.NotificationType) {
        case 1:
          this.$refs.chatCodeToady.getData();
          break;
        case 2:
          this.$refs.hospitalTodayPop.getData();
          this.$refs.hospitalTotalBar.getData();
          this.$refs.todayHospitalPay.getData();
          this.$refs.hospitalLine.getData();
          break;

        default:
          break;
      }
      //       Amount  微信扫码收款金额
      //       NotificationType  1表示微信收款通知；2表示医院业绩上报通知
      //       HospitalGuid  医院guid
    });

    setTimeout(() => {
      GetTodayTotalAsync().then(res => {
        this.realNum = Number(res.data);
      });
      this.$refs.chatCodeToady.getData();
      this.$refs.hospitalTodayPop.getData();
      this.$refs.hospitalTotalBar.getData();
      this.$refs.todayHospitalPay.getData();
      this.$refs.hospitalLine.getData();
    }, 1000 * 60 * 60);
  },

  destroyed() {
    // this.$store.dispatch("SetSiderbarType", true);
    clearTimeout(this.timer);
  },
  methods: {
    // 导航开关
    move(e) {
      this.isMove = true;
      // this.$store.dispatch("SetSiderbarType", true);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.$route.path == "/data/hospital") {
          this.isMove = false;
          // this.$store.dispatch("SetSiderbarType", false);
        }
      }, 3000);
    },

    toggleSideBar() {
      this.$store.dispatch("SetSiderbarType", !this.isMove);
    }
  }
};
</script>

<style lang="scss" scoped>
.data-section {
  background: linear-gradient(
    45deg,
    rgb(4, 4, 33),
    rgb(15, 8, 85) 50%,
    rgb(19, 5, 32)
  );

  .data-content {
    position: relative;
    height: 100vh;
    width: 100%;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .c-c {
      width: 100%;
      height: calc(100% - 7rem);
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .c-center {
        margin: 0.3rem;
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .c-left,
      .c-right {
        margin: 0.3rem;
        width: 25%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }

  .c-box {
    width: 100%;
    padding: 0.3rem 0.5rem;
    margin-bottom: 0.6rem;
    color: rgb(182, 215, 255);
    border: 1px solid rgba(0, 102, 153, 0.589);
    box-shadow: inset 0 0 10px 5px #1079f191;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    box-sizing: border-box;
  }

  .faguang {
    box-shadow: 0 0 10px 0px #304f8f, inset 0 0 20px 5px #1079f191;
  }
}

.hamberger {
  z-index: 999999;
  position: absolute;
  height: 1.2rem;
  width: 1.2rem;
  transition: all 0.5s;

  img {
    cursor: pointer;
    transition: all 0.5s;
    width: 100%;
    height: 100%;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
