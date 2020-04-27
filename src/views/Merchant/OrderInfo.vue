<template>
  <el-form :inline="false" :model="info">
    <el-form-item label="收件人：">
      <span class="ssss">{{info.orderReceiver}}</span>
    </el-form-item>
    <el-form-item label="联系方式：">
      <span class="ssss">{{info.orderPhone}}</span>
    </el-form-item>
    <el-form-item label="订单号：">
      <span class="ssss">{{info.orderNo}}</span>
    </el-form-item>
    <el-form-item label="物流号：">
      <span class="ssss">暂无</span>
    </el-form-item>
    <el-form-item label="收货地址 ：">
      <span class="ssss">{{info.orderAddress}}</span>
    </el-form-item>
    <el-form-item label="订单金额：">
      <count-to
        :start-val="0"
        :end-val="(info.payablesAmount||0)"
        :decimals="2"
        separator=","
        prefix="￥"
        style="color: #F6416C;"
      />
    </el-form-item>
    <el-form-item label="优惠券抵扣金额：">
      <count-to
        :start-val="0"
        :end-val="(0)"
        :decimals="2"
        separator=","
        prefix="￥"
        style="color: #F6416C;"
      />
    </el-form-item>
    <el-form-item label="积分抵扣金额：">
      <count-to
        :start-val="0"
        :end-val="(info.pointAmount||0)"
        :decimals="2"
        separator=","
        prefix="￥"
        style="color: #F6416C;"
      />
    </el-form-item>
    <el-form-item label="运费：">
      <count-to
        :start-val="0"
        :end-val="(info.freight||0)"
        :decimals="2"
        separator=","
        prefix="￥"
        style="color: #F6416C;"
      />
    </el-form-item>
    <el-form-item label="用户备注：">{{info.remark||'无备注'}}</el-form-item>
    <el-form-item label="用户购买频次：">第{{shopCount}}次购买</el-form-item>
  </el-form>
</template>
<script>
/*{{info.logisticsName}} {{info.logisticsNo}}*/
import { GetUserShopCountAsync } from "@/api/Merchant";
import { GetMerchantOrderDetailPageAsync } from "@/api/Merchant";
import { GetOrderInfoAsync } from "@/api/Member";
import CountTo from "vue-count-to";
export default {
  components: { CountTo },
  props: {
    orderGuid: { type: String },
    productGuid: { type: String },
    userGuid: { type: String }
  },
  watch: {
    guid(val) {
      this.handleFilter();
    }
  },
  data() {
    return {
      info: {},
      shopCount: 0
    };
  },
  created() {
    GetUserShopCountAsync(this.productGuid, this.userGuid).then(response => {
      this.shopCount = response.data;
    });
    GetOrderInfoAsync(this.orderGuid).then(response => {
      this.info = response.data;
    });
  },
  methods: {}
};
</script>
<style scoped>
.ssss {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>