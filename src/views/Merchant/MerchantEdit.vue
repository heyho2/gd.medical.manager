<template>
  <el-dialog
    :visible.sync="c_dialogVisible"
    top="20px"
    width="75%"
    :title="dialogTitle"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form
      ref="dataForm"
      :rules="form.rules"
      :model="form.info"
      label-position="right"
      label-width="100px"
      label-suffix="："
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商户名称" prop="merchantName">
            <el-input v-model="form.info.merchantName" placeholder="请输入商户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="form.info.telephone" placeholder="联系电话"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商户地址" prop="area_select">
            <el-cascader
              v-model="form.info.area_select"
              :options="areaData"
              placeholder="请选择商户地址"
              :props="{value: 'name',children: 'child',label:'name'}"
              style="width:100%"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="street">
            <el-input v-model="form.info.street" placeholder="详细地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="关联医院" prop="hospitalGuid">
            <el-select
              clearable
              v-model="form.info.hospitalGuid"
              style="width:100%"
              placeholder="请选择关联医院"
            >
              <el-option
                v-for="item in hospitalList"
                :key="item.guid"
                :label="item.name"
                :value="item.guid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经维度" prop="longitudelongitude">
            <map-input :value.sync="form.info.longitudelongitude"></map-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="账号" prop="account">
            <el-input v-model="form.info.account" placeholder="请输入账号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.info.password" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="password2" v-if="form.info.password!=defaultPassword">
            <el-input type="password" v-model="form.info.password2" placeholder="请输入确认密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="封面图片" prop="merchantPicture">
            <UploadImg2
              :value.sync="form.info.merchantPicture"
              :url.sync="form.info.merchantPictureUrl"
              :imgWidth="200"
              :size="500"
              :notCutting="true"
            />
            <span class="jianyi">建议尺寸：750*375像素，图片大小不能超过500k</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="证书" prop="certificates">
            <CertificateEdit :values.sync="form.info.certificates" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="经营范围证书" prop="scopes">
            <ScopeEdit :values.sync="form.info.scopes" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="c_dialogVisible = false" icon="el-icon-close">关闭</el-button>
      <el-button type="primary" @click="handleSave" icon="iconfont icon-save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  RegisterMerchantAsync,
  GetHospitalSelectAsync,
  GetMerchantInfoAsync,
  UpdateMerchantAsync,
  GetBusinessScopeLicenseListAsync,
  GetMerchantCertificateAsync
} from "@/api/Merchant";

import { GetMerchantDictionaryAsync } from "@/api/Dictionary";
import {
  validatPhone,
  validatCardNo,
  validatRegName,
  validatPassword
} from "@/utils/validate";

import UploadImg2 from "@/components/UploadImg2/Index";
import { parseTime } from "@/utils/index";
import { md5 } from "@/utils/md5";
import "@/utils/linq";
import areaData from "@/utils/china-city-area-zip";
import mapInput from "@/views/Commons/map/mapInput";

import ScopeEdit from "./ScopeEdit";
import CertificateEdit from "./CertificateEdit";

export default {
  components: {
    UploadImg2,
    mapInput,
    ScopeEdit,
    CertificateEdit
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: "商户注册"
    },
    merchantGuid: { type: String },
    onSuccess: { type: Function, default: () => {} }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        return;
      }
      if (this.merchantGuid) {
        GetMerchantInfoAsync({ merchantGuid: this.merchantGuid }).then(
          response => {
            this.form.info = Object.assign(this.form.info, response.data);
            this.form.info.longitudelongitude = [
              this.form.info.latitude,
              this.form.info.longitude
            ];
            this.form.info.area_select = [
              this.form.info.province,
              this.form.info.city,
              this.form.info.area
            ];
            this.form.info.password = this.defaultPassword;
            this.form.info.password2 = this.defaultPassword;
            GetBusinessScopeLicenseListAsync(this.merchantGuid).then(
              response => {
                this.form.info.scopes = response.data;
              }
            );
            GetMerchantCertificateAsync(this.merchantGuid).then(response => {
              this.form.info.certificates = response.data.select(a => {
                return {
                  certificateGuid: a.certificateGuid,
                  dicGuid: a.dicGuid,
                  configName: a.configName,
                  certificateUrl: a.certificateUrl,
                  accessoryGuid: a.accessoryGuid
                };
              });
            });
          }
        );
      } else {
        this.form.info = Object.assign(this.form.info, this.form.null_info);
        this.form.info.certificates = this.form.certificateList1.select(a => {
          return {
            certificateGuid: null,
            dicGuid: a.dicGuid,
            configName: a.configName,
            certificateUrl: null,
            accessoryGuid: null
          };
        });
        this.form.info.scopes = [];
      }
    }
  },
  created() {
    this.areaData = areaData;
    GetMerchantDictionaryAsync().then(response => {
      this.form.certificateList1 = response.data.select(a => {
        return {
          certificateGuid: null,
          dicGuid: a.guid,
          configName: a.name,
          certificateUrl: null,
          accessoryGuid: null
        };
      });
    });
    GetHospitalSelectAsync().then(response => {
      this.hospitalList = response.data;
    });
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
    let t = this;
    const validateq = (rule, value, callback) => {
      if (value != this.form.info.password) {
        callback(new Error("密码不相同"));
      } else {
        callback();
      }
    };

    const validateScopes = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("必须添加"));
        return;
      }
      value.forEach((element, index) => {
        if (!element.scopeDicGuid) {
          callback(`【经营范围${index + 1}】需要选择经营范围类型`);
          return;
        }
        if (!element.accessoryGuid) {
          callback(`【经营范围${index + 1}】需要上传证件图片`);
          return;
        }
      });
      callback();
    };

    const validateCertificate = (rule, value, callback) => {
      value.forEach((element, index) => {
        if (!element.accessoryGuid) {
          callback(`【证书${index + 1}】需要上传证件图片`);
          return;
        }
      });
      callback();
    };
    return {
      defaultPassword: "~~~~~~~~~~~~",
      area_select: [],
      hospitalList: [],
      form: {
        certificateList1: [],
        info: {
          area_select: [],
          longitudelongitude: [],
          telephone: null,
          merchantName: null,
          signatureGuid: null, //签名
          password: null,
          password2: null,
          merchantPicture: null, //商户图片
          certificates: [],
          scopes: [],
          longitude: 0,
          latitude: 0,
          account: null,
          city: null,
          province: null,
          area: null,
          street: null,
          hospitalGuid: null
        },
        null_info: {
          area_select: [],
          longitudelongitude: [],
          telephone: null,
          merchantName: null,
          signatureGuid: null, //签名
          password: null,
          password2: null,
          merchantPicture: null, //商户图片
          certificates: [],
          scopes: [],
          longitude: 0,
          latitude: 0,
          account: null,
          city: null,
          province: null,
          area: null,
          street: null,
          hospitalGuid: null
        },
        rules: {
          password: [{ trigger: "blur", validator: validatPassword }],
          telephone: [
            { required: true, trigger: "blur", message: "必填" },
            { max: 20, trigger: "blur", message: "长度不能超过20" }
          ],
          merchantName: [
            { required: true, trigger: "blur", message: "必填" },
            { max: 20, trigger: "blur", message: "长度不能超过20" }
          ],
          merchantPicture: [
            { required: true, trigger: "blur", message: "必填" }
          ],
          longitudelongitude: [
            { required: true, trigger: "blur", message: "必填" }
          ],
          area_select: [{ required: true, trigger: "blur", message: "必填" }],
          street: [{ required: true, trigger: "blur", message: "必填" }],
          account: [{ required: true, trigger: "blur", message: "必填" }],
          password: [{ required: true, trigger: "blur", message: "必填" }],
          password2: [
            { required: true, trigger: "blur", message: "必填" },
            { trigger: "blur", validator: validateq }
          ],
          scopes: [
            { required: true, trigger: "blur", message: "必填" },
            { trigger: "blur", validator: validateScopes }
          ],
          certificates: [{ trigger: "blur", validator: validateCertificate }]
        }
      }
    };
  },
  methods: {
    handleSave() {
      let t = this;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let tempData = Object.assign({}, t.form.info);
          tempData.longitude = tempData.longitudelongitude[1];
          tempData.latitude = tempData.longitudelongitude[0];
          tempData.province = tempData.area_select[0];
          tempData.city = tempData.area_select[1];
          tempData.area = tempData.area_select[2];
          if (tempData.password == this.defaultPassword) {
            tempData.password = null;
          } else {
            tempData.password = md5(tempData.password).toUpperCase();
            tempData.password2 = md5(tempData.password).toUpperCase();
          }
          if (!this.merchantGuid) {
            RegisterMerchantAsync(tempData).then(response => {
              t.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
                duration: 2000
              });
              t.c_dialogVisible = false;
              t.onSuccess();
              t.form.info = Object.assign({}, t.form.null_info);
            });
          } else {
            UpdateMerchantAsync(tempData).then(response => {
              t.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
                duration: 2000
              });
              t.c_dialogVisible = false;
              t.onSuccess();
            });
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.jianyi {
  color: #a2a2a2;
}
</style>



      
  
