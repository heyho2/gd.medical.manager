<template>
  <div>
    <el-card
      class="card"
      :body-style="{ padding: '0px' }"
      v-for="(item,index) in c_values"
      :key="index"
    >
      <div class="close">
        <el-button
          icon="el-icon-delete"
          size
          title="删除"
          type="text"
          @click="handleDelete(item,index,$event)"
        ></el-button>
      </div>
      <div class="card-cont">
        <div class="head">
          <el-select
            clearable
            v-model="item.scopeDicGuid"
            size="mini"
            style="width:150px"
            placeholder="请选择经营范围"
          >
            <el-option
              v-for="item in businessScopeList"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
              :disabled="__asdasd(item.guid)"
            ></el-option>
          </el-select>
        </div>
        <el-image
          class="image"
          :src="item.certificateUrl"
          preview="__3333"
          :preview-text="item.accessoryGuid"
          :alt="item.accessoryGuid"
          :title="`${item.accessoryGuid}`"
          fit="contain"
        >
          <div slot="placeholder" class="image-slot">
            加载中
            <span class="dot">...</span>
          </div>
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div class="button">
          <el-button
            type="small"
            icon="el-icon-upload"
            title="请选择图片"
            @click="selectFile('UploadImg2'+index)"
          >请选择图片</el-button>
        </div>
      </div>

      <UploadImgButton
        :ref="'UploadImg2'+index"
        :value.sync="item.accessoryGuid"
        :url.sync="item.certificateUrl"
        :hidden="true"
        :notCutting="true"
      />
    </el-card>
    <el-card class="card" :body-style="{ padding: '0px' }">
      <div class="card-cont2">
        <el-button type="small" icon="el-icon-circle-plus" title="添加经营范围" @click="add()">添加经营范围</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  GetBusinessScopeListAsync,
  DeleteBusinessScopeAsync
} from "@/api/Merchant";
import UploadImgButton from "@/components/UploadImg2/Button";
import "@/utils/linq";
export default {
  components: { UploadImgButton },
  props: {
    values: { type: Array }
  },
  computed: {
    c_values: {
      get() {
        return this.values;
      },
      set(val) {
        this.$emit("update:values", val);
      }
    }
  },
  data() {
    return {
      businessScopeList: [],
      scope: { scopeDicGuid: null, scopeDicName: null }
    };
  },
  created() {
    GetBusinessScopeListAsync().then(response => {
      this.businessScopeList = response.data;
    });
  },
  methods: {
    selectFile(refname) {
      var sss = this.$refs[refname][0];
      sss.selectFile();
    },
    add() {
      this.c_values.push({
        scopeGuid: null,
        accessoryGuid: null,
        scopeDicGuid: null,
        scopeDicName: null
      });
    },
    __asdasd(guid) {
      return this.c_values.first(a => a.scopeDicGuid == guid) ? true : false;
    },
    handleDelete(item, index, $event) {
      if (item.scopeGuid) {
        this.$confirm("此操作将永久删除该数据, 是否继续?", "确认删除", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          DeleteBusinessScopeAsync(item.scopeGuid).then(response => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.c_values.splice(index, 1);
          });
        });
      } else {
        this.c_values.splice(index, 1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card {
  display: inline-block;
  width: 200px;
  margin-right: 10px;
  position: relative;
  .close {
    z-index: 2;
    display: inline-block;
    position: absolute;
    right: 0px;
    top: 0px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    .el-button {
      padding: 0;
      color: #fff;
    }
  }
  .close:hover {
    border: 1px solid #fff;
  }
  .card-cont {
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .head {
      padding: 0px;
      height: 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .image {
      width: 100%;
      flex: 1;
    }
    .button {
      text-align: center;
    }
  }
  .card-cont2 {
    height: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>