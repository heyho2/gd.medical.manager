<template>
  <div style="display:inline-block">
    <el-dialog
      :visible.sync="cDialogVisible"
      :title="`选择${types[type]}`"
      :close-on-click-modal="false"
      width="90%"
      top="20px"
    >
      <Product
        ref="product"
        v-show="type=='product'"
        :value.sync="cValue"
        @beforeSelect="handleSelect"
        @beforeSelectAll="handleSelectAll"
      />
      <Hospital
        ref="hostpital"
        v-show="type=='hostpital'"
        :value.sync="cValue"
        @beforeSelect="handleSelect"
        @beforeSelectAll="handleSelectAll"
      />
      <Course
        ref="course"
        v-show="type=='course'"
        :value.sync="cValue"
        @beforeSelect="handleSelect"
        @beforeSelectAll="handleSelectAll"
      />
      <Doctor
        ref="doctor"
        v-show="type=='doctor'"
        :value.sync="cValue"
        @beforeSelect="handleSelect"
        @beforeSelectAll="handleSelectAll"
      />
      <Office
        ref="office"
        v-show="type=='office'"
        :value.sync="cValue"
        @beforeSelect="handleSelect"
        @beforeSelectAll="handleSelectAll"
      />
      <Article
        v-show="type=='article'"
        ref="article"
        :value.sync="cValue"
        @beforeSelect="handleSelect"
        @beforeSelectAll="handleSelectAll"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cDialogVisible = false" icon="el-icon-close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetOwnerGuidsAsync,
  AddRecommendDetailAsync,
  DeleteRecommendDetail2Async,
  DeleteRecommendDetailAsync,
  SaveRecommendDetailAllAsync
} from "@/api/Recommend";
import Article from "@/views/Recommend/Article";
import Product from "@/views/Recommend/Product";
import Hospital from "@/views/Recommend/Hospital";
import Course from "@/views/Recommend/Course";
import Doctor from "@/views/Recommend/Doctor";
import Office from "@/views/Recommend/Office";
export default {
  components: { Article, Product, Hospital, Course, Doctor, Office },
  props: {
    dialogVisible: { type: Boolean, default: false },
    type: {
      type: String
    },
    recommendGuid: {
      type: String
    },
    value: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    recommendGuid(val) {
      var t = this;
      GetOwnerGuidsAsync({ guid: this.recommendGuid }).then(response => {
        this.cValue = response.data;
        this.$refs[t.type].handleFilter();
      });
    }
  },
  computed: {
    cDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    },
    cValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      }
    }
  },
  data() {
    return {
      types: {
        campaign: "活动",
        article: "文章",
        product: "商品",
        doctor: "医生",
        hostpital: "医院",
        office: "科室"
      }
    };
  },
  created() {},
  methods: {
    beforeDataload(rob) {
      GetOwnerGuidsAsync({ guid: this.recommendGuid }).then(response => {
        rob(response.data);
      });
    },
    handleSelect(guid, selected) {
      var t = this;
      if (selected) {
        AddRecommendDetailAsync({
          RecommendGuid: t.recommendGuid,
          OwnerGuids: [guid]
        }).then(response => {
          t.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
            duration: 2000
          });
        });
      } else {
        DeleteRecommendDetail2Async({
          RecommendGuid: t.recommendGuid,
          OwnerGuid: guid
        }).then(response => {
          t.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
        });
      }
    },
    handleSelectAll(list) {
      SaveRecommendDetailAllAsync({
        RecommendGuid: this.recommendGuid,
        OwnerGuids: list
      }).then(response => {
        this.$notify({
          title: "成功",
          message: "保存成功",
          type: "success",
          duration: 2000
        });
      });
    }
  }
};
</script>


      
  
