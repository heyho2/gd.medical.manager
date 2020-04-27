<template>
  <div class="icons-container">
    <!-- <p class="warn-content">
      <a
        href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/icon.html"
        target="_blank"
      >Add and use</a>
    </p>-->
    <div class="icons-wrapper">
      <div v-for="item of iconsMap" :key="item" @click="selectIcon2(item)">
        <el-tooltip placement="top">
          <div slot="content">{{ generateIconCode(item) }}</div>
          <div class="icon-item">
            <svg-icon :icon-class="item" class-name="disabled"/>
            <span class="assss">{{ item }}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import icons from "./requireIcons";
// import clipboard from '@/utils/clipboard'

export default {
  name: "Icons",
  props: {
    selectIcon: { type: Function, default: () => {} }
  },
  data() {
    return {
      iconsMap: icons
    };
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`;
    },
    selectIcon2(className) {
      this.selectIcon(className);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icons-container {
  overflow: hidden;
  .icons-wrapper {
    margin: 0 auto;
  }
  .icon-item {
    margin: 20px;
    height: 110px;
    text-align: center;
    width: 110px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 24px;
    margin-top: 10px;
  }
  .assss {
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .disabled {
    pointer-events: none;
  }
}
</style>
