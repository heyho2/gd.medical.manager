<template>
  <div class="dashboard-container">
    <PanelGroup />
  </div>
</template>

<script>
import PanelGroup from './PanelGroup'

export default {
  name: 'Dashboard',
  components: { PanelGroup },
  data() {
    return {
      reverse: true
    }
  }
}
</script>

<style  lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
