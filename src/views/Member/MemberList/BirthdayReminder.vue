<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="form.rules"
      :model="form.info"
      label-position="left"
      label-width="110px"
    >
      <el-form-item label="提醒时间设置" prop="title">
        <el-input v-model="form.info.title" placeholder="据生日当天多少天前做生日提醒"/>
      </el-form-item>
      <el-form-item label="自动发送内容" prop="abstract">
        <el-input type="textarea" v-model="form.info.abstract" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="自动发送时间">
        <el-input v-model="form.info.title" placeholder/>
      </el-form-item>
      <el-button type="primary" @click="handleSave" icon="iconfont icon-save">保存</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        rules: {}, //验证
        info: {}
      }
    };
  },
  watch: {},
  methods: {
    handleSave() {
      alert("保存");
    }
  }
};
</script>

