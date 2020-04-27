<template>
  <div style="display: inline-block;">
    <el-tag
      v-for="(item,index) in ((cList&&cList.length>0)?cList:['暂无'])"
      :key="index"
      closable
      :hit="true"
      @close="handleClose(item)"
    >{{ item }}</el-tag>
    <el-input
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      placeholder="+新标签"
      :maxlength="10"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+新标签</el-button>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'LabelsEdit',
  components: { draggable },
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    cList: {
      get() {
        return this.list
      },
      set(val) {
        this.$emit('update:list', val)
      }
    }
  },
  methods: {
    handleClose(tag) {
      this.cList.splice(this.cList.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.cList.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
  margin-bottom: 5px;
}
.button-new-tag {
  margin-left: 10px;
  margin-bottom: 5px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  margin-bottom: 0px;
  vertical-align: bottom;
}
</style>
