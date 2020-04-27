<template>
  <div>
    {{ sum }}
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: [Number, String],
      default: 0
    },
    speed: {
      type: [Number, String],
      default: 100
    },
    startNum: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      sum: 0,
      timer: null
    }
  },
  watch: {
    num: {
      immediate: true,
      handler: function(v) {
        if ((v + '') == 'NaN') return this.sum = ','
        this.numFun(v)
      }
    }
  },
  methods: {
    numFun(v) {
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.sum += 1
          if (v === this.sum) {
            clearInterval(this.timer)
          }
        }, this.speed * 30)
      }
    }
  }
}
</script>

<style>
</style>
