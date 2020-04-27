<template>
  <div>
    <div v-if="type=='statusName'">
      <el-tag type="danger" v-if="data=='reject'">{{ getStatusName(data) }}</el-tag>
      <el-tag v-else-if="data=='approved'">{{ getStatusName(data) }}</el-tag>
      <el-tag v-else-if="data=='submit'" type="warning">{{ getStatusName(data) }}</el-tag>
      <el-tag type="info" v-else-if="data=='draft'">{{ getStatusName(data) }}</el-tag>
    </div>
    <div v-else-if="type=='selectOption'">
      <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: { type: String, default: null },
    data: {
      type: String,
      default: "statusName"
    }
  },
  data() {
    return {
      typeList: [
        { label: "草案", value: "draft" },
        { label: "已通过", value: "approved" },
        { label: "待审核", value: "submit" },
        { label: "未通过", value: "reject" }
      ]
    };
  },
  methods: {
    getStatusName(code) {
      let aaa;
      this.typeList.forEach(item => {
        if (item.value == code) {
          aaa = item.label;
        }
      });
      return aaa;
    }
  }
};
</script>
