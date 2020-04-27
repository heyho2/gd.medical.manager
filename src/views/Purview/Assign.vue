<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card" :body-style="{padding:`0px`}">
          <div slot="header" class="clearfix" style="height: 22px;">
            <span>角色</span>
          </div>
          <div :style="{height:`${height}px`,overflow: `auto`}">
            <el-table
              :data="roleList"
              highlight-current-row
              @current-change="currentChange"
              style="width: 100%"
            >
              <el-table-column align="center" label="序列" width="65">
                <template slot-scope="scope">{{ scope.$index+1 }}</template>
              </el-table-column>
              <el-table-column prop="roleName" label="名称"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" :body-style="{padding:`0px`}">
          <div slot="header" class="clearfix" style="height: 22px;">
            <span>菜单/按钮</span>
            <el-button
              v-permission="'handle_save'"
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleSave"
              icon="iconfont icon-save"
            >保存分配</el-button>
          </div>
          <div :style="{height:`${height}px`,overflow: `auto`,padding: `10px`}">
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
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  GetMenuTreeCacheAsync,
  GetRoleMenuAsync,
  SaveRoleMenuAsync
} from "@/api/Menu";
import { GetRoleListAsync } from "@/api/User";

export default {
  data() {
    return {
      treeList: [],
      query: {},
      listLoading: false,
      selectTree: true,
      roleList: [],
      height: 0,
      form: {
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
  created() {
    const t = this;
    t.handleFilter();
    GetRoleListAsync({
      SortField: "sort",
      IsAscending: false,
      enable: true
    }).then(response => {
      t.roleList = response.data;
    });
    var h = document.documentElement.clientHeight;
    t.height = h - 200;
  },
  methods: {
    handleFilter() {
      GetMenuTreeCacheAsync(this.query)
        .then(response => {
          this.treeList = response.data;
        })
        .catch(function(err) {
          // error
        });
    },
    currentChange(currentRow, oldCurrentRow) {
      this.form.info.roleGuid = currentRow.roleGuid;
      GetMenuTreeCacheAsync(this.query)
        .then(response => {
          this.treeList = response.data;
          return GetRoleMenuAsync({ roleGuid: currentRow.roleGuid });
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
      if (!tempData.roleGuid) {
        t.$message({
          message: `必须选择一个角色噢`,
          type: "warning",
          duration: 5 * 1000
        });
        return;
      }
      if (!tempData.rightGuids || tempData.rightGuids.length == 0) {
        t.$message({
          message: `必须分配权限噢`,
          type: "warning",
          duration: 5 * 1000
        });
        return;
      }
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
