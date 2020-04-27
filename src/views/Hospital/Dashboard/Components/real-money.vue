<template>
  <div class="box">
    <p
      v-for="(i,n) of countNum"
      :key="n"
      :class="{'box-item': !isNaN(i), 'mark-item': isNaN(i) }"
    >
      <template v-if="!isNaN(i)">
        <span ref="numberItem">
          0123456789
        </span>
      </template>
      <span
        v-else
        class="comma"
      >{{ i }}</span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      countNum: ['0', '0', ',', '0', '0', '0', ',', '0', '0', '0']
    }
  },

  watch: {
    num: {
      immediate: true,
      handler: function(v) {
        const count = v.toString().split('.')[0]

        if (v > 0 && count) {
          this.formaterNum(count)

          this.setNumberTransform()

          setInterval(() => {}, 1000)
        }
      }
    }
  },

  methods: {
    // 设置文字滚动
    setNumberTransform() {
      const numberItems = this.$refs.numberItem // 拿到数字的ref，计算元素数量
      const numberArr = this.countNum.filter(item => !isNaN(item))
      // 结合CSS 对数字字符进行滚动,显示订单数量
      for (let index = 0; index < numberItems.length; index++) {
        const elem = numberItems[index]
        elem.style.transform = `translate(-50%, -${numberArr[index] * 10}%)`
      }
    },

    formaterNum(num) {
      num = num.toString()
      // 把订单数变成字符串
      if (num.length < 8) {
        num = '0' + num // 如未满八位数，添加"0"补位
        this.formaterNum(num) // 递归添加"0"补位
      } else if (num.length === 8) {
        // 订单数中加入逗号
        num = num.slice(0, 2) + ',' + num.slice(2, 5) + ',' + num.slice(5, 8)
        this.countNum = num.split('') // 将其便变成数据，渲染至滚动数组
      } else {
        this.$error('金额已经高达1亿！🐂🐂🐂🐂🐂🐂')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  box-sizing: border-box;
}

.box {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.box-item {
  margin: 0 0.5rem;
  position: relative;
  display: inline-block;
  width: 3.5rem /* 54/14 */;
  height: 4rem /* 62/14 */;
  /* 背景图片 */
  background: url("./common/count-card.png") no-repeat center center;
  background-size: 100% 100%;
  font-size: 3.5rem /* 50/14 */;
  line-height: 4rem /* 62/14 */;
  text-align: center;
  color: #fff;
  position: relative;
  writing-mode: vertical-lr;
  text-orientation: upright;
  overflow: hidden;

  span {
    user-select: none;
    position: absolute;
    top: 0.1rem;
    left: 50%;
    transition: all 1s;
    transform: translateX(-50%);
    letter-spacing: 0.7 /* 10/14 */;
  }
}

.mark-item {
  width: 10px;
  height: 100px;
  margin-right: 5px;
  line-height: 10px;
  font-size: 48px;
  position: relative;
  user-select: none;
  span {
    position: absolute;
    width: 100%;
    bottom: 1.7rem;
    color: #fff;
    writing-mode: vertical-rl;
    text-orientation: upright;
  }
}
</style>
