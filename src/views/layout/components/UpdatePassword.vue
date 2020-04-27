<template>
  <Drawer :title="'修改密码'" :dialog-visible.sync="dialogEditVisible" width="300px" style>
    <el-form
      ref="dataForm"
      :rules="loginRules"
      :model="form"
      label-position="right"
      label-width="80px"
      style="width:95%;"
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="qpassword">
        <el-input v-model="form.qpassword" type="password" placeholder="请输入确认新密码" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" @click="dialogEditVisible = false">关闭</el-button>
      <el-button type="primary" icon="iconfont icon-save" @click="handleSave">保存</el-button>
    </div>
  </Drawer>
</template>

<script>
import { UpdateAccountPasswordAsync } from '@/api/User'
import { isvalidUsername } from '@/utils/validate'
import { md5 } from '@/utils/md5'
import Drawer from '@/components/Drawer/Index'
export default {
  components: {
    Drawer
  },
  data() {
    const validateq = (rule, value, callback) => {
      if (value != this.form.password) {
        callback(new Error('密码不相同'))
      } else {
        callback()
      }
    }
    return {
      dialogEditVisible: false,
      form: { oldPassword: null, password: null, qpassword: null },
      loginRules: {
        oldPassword: [
          { required: true, trigger: 'blur', message: '旧密码必填' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码必填' },
          { max: 20, trigger: 'blur', message: '密码不能大于20位' },
          { min: 6, trigger: 'blur', message: '密码不能小于6位' }
        ],
        qpassword: [{ trigger: 'blur', validator: validateq }]
      }
    }
  },
  methods: {
    showDialog() {
      this.dialogEditVisible = true
      this.form = {}
    },
    handleSave() {
      const t = this
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const form = {
            oldPassword: md5(t.form.oldPassword).toUpperCase(),
            password: md5(t.form.password).toUpperCase(),
            qpassword: md5(t.form.qpassword).toUpperCase()
          }
          UpdateAccountPasswordAsync(form).then(response => {
            t.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            t.dialogEditVisible = false
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>

