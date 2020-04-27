<template>
  <transition name="vs-sidebar-animate">
    <div v-show="c_value" ref="sidebarbackground" class="content-sidebar">
      <div v-if="!hiddenBackground" class="background" />
      <div
        :class="[
          `vs-sidebar-${color}`,
          {
            'vs-sidebar-parent': parent != 'body',
            'vs-sidebar-staticPosition': staticPosition,
            'vs-sidebar-position-right': positionRight,
            'vs-sidebar-reduce': reduce,
            'vs-sidebar-reduceNotRebound': reduceNotRebound,
            'vs-sidebar-reduceNotHoverExpand': reduceNotHoverExpand
          }
        ]"
        class="vs-sidebar"
      >
        <header v-if="$slots.header">
          <slot name="header" />
        </header>
        <header v-else>
          <span>{{ title }}</span>
          <i class="el-icon-close close" @click.stop="c_value = false" />
        </header>

        <div class="vs-sidebar--items">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="vs-sidebar--footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    title: {
      default: null,
      type: String
    },
    value: {
      default: false
    },
    defaultIndex: {
      default: null,
      type: [String, Number]
    },
    color: {
      default: 'primary',
      type: String
    },
    parent: {
      default: null,
      type: [String, Object]
    },
    spacer: {
      default: false,
      type: Boolean
    },
    staticPosition: {
      default: false,
      type: Boolean
    },
    positionRight: {
      default: false,
      type: Boolean
    },
    clickNotClose: {
      default: false,
      type: Boolean
    },
    reduce: {
      default: false,
      type: Boolean
    },
    reduceNotRebound: {
      default: false,
      type: Boolean
    },
    reduceNotHoverExpand: {
      default: false,
      type: Boolean
    },
    hiddenBackground: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    currentIndex: 0
  }),
  computed: {
    c_value: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  },
  watch: {
    value() {
      if (this.value && !this.clickNotClose) {
        this.addEventClick()
      }
    }
  },
  created() {
    this.currentIndex = this.defaultIndex
  },
  mounted() {
    this.insertBody()
  },
  methods: {
    getActive() {
      return this.currentIndex
    },
    setIndexActive(index) {
      this.currentIndex = index
    },
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.vs-sidebar')
      if (!parent) {
        this.$emit('input', false)
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    insertBody() {
      if (this.parent) {
        const elx = this.$refs.sidebarbackground
        const parentx =
          typeof this.parent === 'string'
            ? document.querySelector(this.parent)
            : this.parent
        parentx.insertBefore(elx, parentx.firstChild)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content-sidebar {
  .background {
    background: rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 2011;
    transition: all 0.3s ease;
    opacity: 1;
  }
  header {
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
  .vs-sidebar {
    width: 90%;
    max-width: 90vw;
    background: #fff;
    z-index: 2012;
    position: fixed;
    height: 100vh;
    width: 100%;
    max-width: 260px;
    top: 0;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
    left: 0;
    transition: all 0.25s ease;
  }
}

.vs-sidebar-animate-enter-active,
.vs-sidebar-animate-leave-active {
  transition: all 0.25s ease;
  .vs-sidebar {
    transition: all 0.25s ease;
  }
}

.vs-sidebar-animate-enter {
  transform: translate(-100%);
  .vs-sidebar {
    transform: translate(-100%);
  }
}
.vs-sidebar-animate-enter,
.vs-sidebar-animate-leave-to {
  .background {
    opacity: 0;
  }
}
.vs-sidebar &.vs-sidebar-position-right {
  transform: translate(100%) !important;
}
</style>
