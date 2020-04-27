<template>
  <el-drawer
    ref="drawer"
    :visible.sync="c_dialogVisible"
    :size="`900`"
    modal
    :with-header="false"
    custom-class="drawer"
    :wrapper-closable="false"
    :append-to-body="appendToBody"
  >
    <header>
      <span>{{ title }}</span>
      <input type="text" style>
      <i class="el-icon-close close" @click.stop="c_dialogVisible = false" />
    </header>
    <main>
      <slot />
    </main>
    <footer v-if="$slots.footer" class="dialog-footer">
      <slot name="footer" />
    </footer>
  </el-drawer>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String
    },
    width: {
      type: String
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    c_dialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  watch: {
    dialogVisible(val) {
      var el = document.getElementsByTagName('html')[0]
      if (val) {
        el.style.overflow = 'hidden'
      } else {
        el.style.overflow = 'auto'
      }
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.width) {
        const el = this.$refs.drawer.$el
        el.querySelector('.drawer').style.width = this.width
      }
    })
  }
}
</script>

<style lang="less" scoped>
/deep/.drawer {
  max-width: 100%;
  width: 900px;
  display: flex;
  flex-direction: row;
  header {
    input {
      border: 0px;
      width: 0px;
      height: 0px;
      &:focus {
        border: 0px;
      }
    }
    display: flex;
    justify-content: space-between;
    align-content: center;
    line-height: 50px;
    padding: 2px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    .close {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-weight: bold;
    }
  }
  main {
    padding: 5px;
    flex: 1;
    overflow-y: auto;
    height: calc(100% - 110px);
  }
  footer {
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    height: 55px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
