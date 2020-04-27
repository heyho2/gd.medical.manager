<template>
  <div class="box-title">
    <div class="title">
      <span class="title-icon" />
      <span>{{ title || '' }}</span>
    </div>
    <div
      v-if="updateTime"
      class="data-update-time"
    >{{ updateTime?`上报时间：${parseTime(updateTime,'{y}-{m}-{d}')}`:'' }}</div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    updateTime: {
      type: String,
      default: ''
    }
  },
  methods: {
    parseTime
  }
}
</script>

<style lang="scss" scoped>
.box-title {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  height: 1.8rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;

  .title {
    text-align: left;

    .title-icon {
      background-image: url("./common/icon-data.png");
      background-position: 100% 100%;
      background-repeat: no-repeat;
      display: inline-block;
      height: 2rem;
      width: 2rem;
      vertical-align: bottom;
    }
  }

  .data-update-time {
    text-align: right;
    font-size: 0.5rem;
  }
}
</style>
