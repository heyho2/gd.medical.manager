<template>
  <div>
    <h4 class="text-center">个人信息</h4>
    <div class="tab">
      <el-button-group class="btn-group">
        <el-button
          v-for="(i,index) of tab"
          :key="index"
          :type="n===index?'primary':''"
          @click="n=index"
        >{{ i }}</el-button>
      </el-button-group>
    </div>

    <dail-info v-if="n===0" style="margin-top:20px;" />
    <base-info v-else />
  </div>
</template>

<script>
import dailInfo from './dailyInfo'
import baseInfo from './baseInfo'
export default {
  components: {
    dailInfo,
    baseInfo
  },
  data() {
    return {
      tab: ['日常信息', '基础信息'],
      n: 0
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.tab {
  display: flex;

  .btn-group {
    margin: auto;
  }
}
.text-center {
  margin-top: -2.3rem;
  text-align: center;
}
</style>
