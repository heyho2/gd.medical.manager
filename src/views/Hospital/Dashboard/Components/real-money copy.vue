<template>
  <div>
    <!-- 获取当天营收总金额 -->
    <count-to
      :start-val="0"
      :end-val="num"
      :duration="2600"
    />
    <!-- :decimals="2" -->
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  props: {
    num: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  created() {}
}
</script>

<style scoped>
div {
  color: #fff;
  text-align: center;
  font-size: 3rem;
  display: inline-block;
  line-height: 1.8rem;
  text-align: center;
  padding: 0.7rem;
  text-indent: 0.2rem;
  animation: glow 2s ease-in-out both infinite;
}

@-webkit-keyframes glow {
  0%,
  100% {
    text-shadow: 0 0 8.33333px snow, 0 -25px 50px tomato, -25px 25px 50px yellow,
      25px 25px 50px tomato;
    /* -webkit-transform: rotate(0.95);
    transform: rotate(0.95); */
  }
  33% {
    text-shadow: 0 0 8.33333px snow, 0 -25px 50px cyan, -25px 25px 50px tomato,
      25px 25px 50px cyan;
  }
  50% {
    /* -webkit-transform: scale(1.05);
    transform: scale(1.05); */
  }
  66% {
    text-shadow: 0 0 8.33333px snow, 0 -25px 50px yellow, -25px 25px 50px cyan,
      25px 25px 50px yellow;
  }
}
@keyframes glow {
  0%,
  100% {
    text-shadow: 0 0 8.33333px snow, 0 -25px 50px tomato, -25px 25px 50px yellow,
      25px 25px 50px tomato;
    /* -webkit-transform: rotate(0.95);
    transform: rotate(0.95); */
  }
  33% {
    text-shadow: 0 0 8.33333px snow, 0 -25px 50px cyan, -25px 25px 50px tomato,
      25px 25px 50px cyan;
  }
  50% {
    /* -webkit-transform: scale(1.05); */
    /* transform: scale(1.05); */
  }
  66% {
    text-shadow: 0 0 8.33333px snow, 0 -25px 50px yellow, -25px 25px 50px cyan,
      25px 25px 50px yellow;
  }
}
</style>
