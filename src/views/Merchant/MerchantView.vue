<template>
  <div>
    <el-dialog :visible.sync="tDialogVisible" :title="dialogTitle" top="20px" width="90%">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <el-row>
          <el-col>
            <span class="info_label">商户名称：</span>
            {{info.merchantName}}
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col>
            <span class="info_label">经营范围：</span>
            <labels :list="getScopes(info.scope)"/>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card" shadow="never" style="margin-top: 20px;">
        <div slot="header" class="clearfix">
          <span>商品购买信息</span>
        </div>
        <order-detail :guid="info.merchantGuid" style="margin: 15px 0px;"/>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tDialogVisible = false" icon="el-icon-close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Labels from "@/views/Commons/Labels";
import OrderDetail from "./OrderDetail";

export default {
  components: { Labels, OrderDetail },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: "商户详细"
    },
    guid: { type: String },
    info: { type: Object }
  },
  watch: {},
  computed: {
    tDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    }
  },
  data() {
    return {};
  },
  created() {},

  methods: {
    getScopes(scope) {
      let scopes = [];
      if (scope) {
        scopes = scope.split(",");
      }
      return scopes;
    }
  }
};
</script>
<style scoped>
.ssss {
  display: inline-block;
  width: 320px;
  height: 42px;
  overflow-y: hidden;
}
</style>