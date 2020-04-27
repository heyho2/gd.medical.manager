<template>
  <div>
    <el-dialog
      :visible.sync="tDialogVisible"
      top="20px"
      width="90%"
      title="用户信息"
      :close-on-click-modal="false"
      append-to-body
      v-loading="dialogLoading"
    >
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <el-row style="margin-top: 0px">
          <el-col :span="8">
            <span class="info_label">姓名：</span>
            {{info.userName}}
          </el-col>
          <el-col :span="8">
            <span class="info_label">性别：</span>
            {{info.gender=="M"?"男":"女"}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="info_label">昵称：</span>
            {{info.nickName}}
          </el-col>
          <!-- <el-col :span="8">
            <span class="info_label">邮箱：</span>
            {{info.name}}
          </el-col>-->
          <el-col :span="8">
            <span class="info_label">出生日期：</span>
            {{
            formatterDate(info.birthday,'{y}-{m}-{d}') }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="info_label">联系方式：</span>
            {{info.phone}}
          </el-col>
          <el-col :span="8">
            <span class="info_label">注册时间：</span>
            {{formatterDate(info.creationDate)}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="info_label">上级分销：</span>
            {{info.recommended||'无'}}
          </el-col>
          <el-col :span="8">
            <span class="info_label">会员等级：</span>
            {{info.name||'普通会员'}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span class="info_label">地址：</span>
            {{info.address||'无'}}
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="8">
            <span class="info_label">标签：</span>
            {{info.name}}
          </el-col>
        </el-row>-->
      </el-card>
      <el-card class="box-card" shadow="never" style="margin-top: 20px;">
        <div slot="header" class="clearfix">
          <span>商品购买信息</span>
        </div>
        <el-row class="order_items" :gutter="20">
          <el-col :span="5">
            <el-card shadow="hover" class="order_item">
              <count-to
                :start-val="0"
                :end-val="info.orderTotalAmount"
                :duration="2000"
                :decimals="2"
                separator=","
                prefix="￥"
                class="order_item_num"
              />
              <span>消费金额</span>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card shadow="hover" class="order_item">
              <count-to
                :start-val="0"
                :end-val="info.orderQty"
                :duration="2000"
                class="order_item_num"
              />
              <span>消费次数</span>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card shadow="hover" class="order_item">
              <count-to
                :start-val="0"
                :end-val="variation"
                :duration="2000"
                :decimals="0"
                separator=","
                class="order_item_num"
              />
              <span>可用积分</span>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card shadow="hover" class="order_item">
              <count-to
                :start-val="0"
                :end-val="0"
                :duration="2000"
                :decimals="0"
                separator=","
                class="order_item_num"
              />
              <span>可用优惠券</span>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card" shadow="never" style="margin-top: 20px;">
        <div slot="header" class="clearfix">
          <span>商品购买信息</span>
        </div>
        <order-list :guid="info.userGuid"/>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tDialogVisible = false" icon="el-icon-close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetMemberInfoAsync, GetMemberOrderPageAsync } from "@/api/Member";
import { formatCurrency, parseTime } from "@/utils/index";
import CountTo from "vue-count-to";
import OrderList from "./OrderList";

export default {
  components: { CountTo, OrderList },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: "查看会员"
    },
    guid: { type: String },
    variation: { type: Number, default: 0 }
  },
  watch: {
    guid(val) {
      this.getInfo();
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
      info: {
        name: "无"
      },
      dialogLoading: false
    };
  },
  methods: {
    ///查询
    getInfo() {
      this.dialogLoading = true;
      GetMemberInfoAsync({ userGuid: this.guid }).then(
        response => {
          this.info = response.data;
          setTimeout(() => {
            this.dialogLoading = false;
          }, 200);
        },
        err => {
          this.dialogLoading = false;
        }
      );
    },
    formatterDate(val, f) {
      return parseTime(new Date(val), f);
    },
    formatterMoney(val) {
      return formatCurrency(val);
    }
  }
};
</script>
<style scoped>
.gd_member_info .info_label {
  width: 100px;
  display: inline-block;
  text-align: right;
}
.el-row {
  margin-top: 10px;
}
 .order_items .order_item {
  text-align: center;
}
 .order_items .order_item .order_item_num {
  display: inline-block;
  width: 100%;
  line-height: 90px;
  font-size: 36px;
  color: #f6416c;
}
</style>


      
  
