<template>
  <div class="app-container">
    <el-dialog
      top="20px"
      :title="form.dialogEditTitle"
      :visible.sync="tDialogVisible"
      :close-on-click-modal="false"
      width="65%"
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="right"
        label-suffix="："
        label-width="100px"
        :style="{width:85+'%'}"
      >
        <el-form-item>
          <el-tree
            :data="treeList"
            ref="tree"
            show-checkbox
            default-expand-all
            node-key="menuGuid"
            :default-expanded-keys="form.info.rightGuids"
            :props="treeProps"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <svg-icon v-if="!data.menuUrl" :icon-class="data.menuClass||'按钮'"/>
              <svg-icon v-else :icon-class="data.menuClass||'系统'"/>
              <span v-if="!data.menuUrl" style="color: rgb(164, 170, 248);">{{node.label}}</span>
              <span v-else>{{node.label}}</span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tDialogVisible = false" icon="el-icon-close">关闭</el-button>
        <el-button type="primary" @click="handleSave" icon="iconfont icon-save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetMenuTreeCacheAsync,
  GetRoleMenuAsync,
  SaveRoleMenuAsync
} from "@/api/Menu";
import treeTable from "@/components/TreeTable";
export default {
  components: { treeTable },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    roleGuid: {
      type: String
    }
  },
  watch: {
    roleGuid(val) {
      this.form.info.roleGuid = val;
      this.handleFilter();
    }
  },
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
    return {
      treeList: [],
      query: {},
      listLoading: false,
      selectTree: true,
      form: {
        dialogEditTitle: "分配菜单",
        dialogEditStatus: "add",
        //表单数据
        info: {
          rightGuids: [],
          roleGuid: null
        }
      },
      treeProps: {
        label: "menuName",
        children: "children",
        id: "menuGuid",
        disabled(data, node) {
          return !data.enable;
        }
      }
    };
  },
  created() {},
  methods: {
    handleFilter() {
      GetMenuTreeCacheAsync(this.query)
        .then(response => {
          this.treeList = response.data;
          return GetRoleMenuAsync({ roleGuid: this.roleGuid });
        })
        .then(response => {
          response.data.forEach(element => {
            this.$refs.tree.setChecked(element, true, false);
          });
          // this.$refs.tree.setCheckedKeys(response2.data, false);
        })
        .catch(function(err) {
          // error
        });
    },
    handleSave() {
      const t = this,
        tempData = Object.assign({}, t.form.info);
      tempData.rightGuids = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ];
      SaveRoleMenuAsync(tempData).then(response => {
        t.$notify({
          title: "成功",
          message: "添加成功",
          type: "success",
          duration: 2000
        });
      });
    }
  }
};
</script>
