<template>
  <el-dialog
    :visible.sync="c_dialogVisible"
    top="20px"
    width="50%"
    :title="`问答设置`"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form
      ref="dataForm"
      label-position="right"
      label-width="180px"
      label-suffix="："
      style="width:75%"
      :model="form"
    >
      <el-form-item
        v-for="(item,index) in form.list"
        :key="index"
        :label="item.configName"
        :prop="'list.' + index + '.extensionField'"
        :rules="[{ required: true, message: '必填', trigger: 'blur'}]"
      >
        <el-date-picker
          v-if="item.valueType==`datetime`"
          v-model="item.extensionField"
          type="datetime"
          :placeholder="`请输入${item.configName}`"
          value-format="yyyy-MM-dd HH:mm:ss"
          clearable
        ></el-date-picker>
        <el-input-number
          style="width:100%"
          v-else-if="item.valueType==`int`||item.valueType==`decimal`"
          oninput="value=value.replace(/[^\d]/g,'')"
          v-model="item.extensionField"
          :placeholder="`请输入${item.configName}（数字）`"
          :min="1"
          :precision="0"
          controls-position="right"
          clearable
        ></el-input-number>
        <el-input
          v-else
          v-model="item.extensionField"
          :placeholder="`请输入${item.configName}`"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="c_dialogVisible = false" icon="el-icon-close">关闭</el-button>
      <el-button type="primary" @click="handleSave" icon="iconfont icon-save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  GetFaqsSettingTypeAsync,
  SaveFaqsSettingAsync
} from "@/api/Dictionary";
import "@/utils/linq";

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    c_dialogVisible: {
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
      form: { list: [] }
    };
  },
  created() {
    GetFaqsSettingTypeAsync(this.query).then(response => {
      this.form.list = response.data;
    });
  },
  methods: {
    handleSave() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var tempData = this.form.list.select(row => {
            return {
              dicGuid: row.dicGuid,
              extensionField: row.extensionField
            };
          });

          SaveFaqsSettingAsync(tempData).then(response => {
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
            this.c_dialogVisible = false;
          });
        }
      });
    }
  }
};
</script>