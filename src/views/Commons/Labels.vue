<template>
  <div style="display: inline-block;">
    <el-tag
      v-for="(item,index) in ((list&&list.length>0)?list:['暂无'])"
      class="tag"
      :key="index"
    >{{item}}</el-tag>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: null
    }
  }
};
</script>
<style scoped>
.tag {
  margin: 5px;
}
</style>

