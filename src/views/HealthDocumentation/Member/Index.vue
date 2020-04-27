<template>
  <div class="app-container">
    <vip-table />
    <vip-dialog />
  </div>
</template>

<script>
import vipTable from "./Components/vipTable";
import vipDialog from "./Components/vipDialog";
export default {
  components: {
    vipTable,
    vipDialog
  },
  beforeDestroy() {
    // 清除vuex里面的缓存
  }
};
</script>
