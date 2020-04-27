<template>
  <img
    v-if="src"
    :src="src"
    :preview="preview"
    :alt="title"
    :title="title"
    :preview-text="title"
    :onerror="errorImg01"
    :style="style1"
    :class="preview?'shoushi':''"
  />
  <img
    v-else
    :src="require('@/assets/图片加载失败2.png')"
    :alt="title"
    :title="title"
    :preview-text="title"
  />
</template>
<script>
export default {
  props: {
    src: { type: String, default: null },
    title: { type: String },
    preview: { type: String },
    style1: { type: String }
  },
  //   watch: {
  //     src(val) {
  //       this.$previewRefresh();
  //     }
  //   },
  created() {
    this.$previewRefresh();
  },
  data() {
    return {
      errorImg01: 'this.src="' + require("@/assets/图片加载失败2.png") + '"'
    };
  }
};
</script>
<style scoped>
.shoushi {
  cursor: pointer;
}
</style>
<style>
.pswp--open {
  z-index: 99999;
}
</style>