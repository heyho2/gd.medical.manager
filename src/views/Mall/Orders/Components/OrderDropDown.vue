<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="8" class="orderDetailslist">
        <div class="grid-content bg-purple">
          <span class="name">付款时间：</span>
          {{ calTimeType(row.paymentDate) }}
        </div>
      </el-col>
      <el-col :span="4" class="orderDetailslist">
        <div class="grid-content bg-purple">
          <span class="name">支付方式：</span>
          {{ calPayType(row.payType) }}
        </div>
      </el-col>
      <el-col :span="6" class="orderDetailslist">
        <div class="grid-content bg-purple">
          <span class="name">订单总金额：</span>
          {{ row.payablesAmount }}元 (含运费{{ row.freight }}元)
        </div>
      </el-col>
      <el-col :span="6" class="orderDetailslist">
        <div class="grid-content bg-purple">
          <span class="name">优惠金额：</span>
          {{ row.discountAmout }}元
        </div>
      </el-col>
    </el-row>
    <div class="receiver-detail">
      <div>收货人：{{ row.orderReceiver }}</div>
      <div>联系方式：{{ row.orderPhone }}</div>
      <div>物流公司：{{ row.expressCompany }}</div>
      <div>物流单号：{{ row.expressNo }}</div>
      <div>收货地址：{{ row.orderAddress }}</div>
    </div>
    <el-table
      :data="row.products"
      :border="true"
      :header-cell-style="styleObj"
      style="width: 100%;margin-top: 20px;"
    >
      <el-table-column prop="configName" align="left" label="商品大类" />
      <el-table-column prop="productName" align="left" label="商品名称" />
      <el-table-column prop="productCount" align="left" label="商品数量" />
      <el-table-column prop="productPrice" align="left" label="商品单价">
        <template slot-scope="scope">{{ scope.row.productPrice }}元</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  props: {
    row: { type: Object }
  },
  data() {
    return {
      grid: { total: 0, list: [], listLoading: false },
      payTypeList: [
        {
          payTypeCode: 'Card',
          payTypeName: '刷卡'
        },
        {
          payTypeCode: 'Cash',
          payTypeName: '现金'
        },
        {
          payTypeCode: 'Apple',
          payTypeName: '苹果支付'
        },
        {
          payTypeCode: 'Score',
          payTypeName: '积分'
        },
        {
          payTypeCode: 'Wechat',
          payTypeName: '微信'
        },
        {
          payTypeCode: 'Alipay',
          payTypeName: '支付宝'
        },
        {
          payTypeCode: 'OffLinePay',
          payTypeName: '线下支付'
        }
      ],
      styleObj: { background: '#f5f7fa' }
    }
  },
  methods: {
    calTimeType(v) {
      return v ? parseTime(v) : `-`
    },
    calPayType(v) {
      let payTypeName = ''
      this.payTypeList.forEach(item => {
        if (item.payTypeCode === v) {
          payTypeName = item.payTypeName
        }
      })
      return payTypeName
    }
  }
}
</script>

<style lang="scss" scoped>
.receiver-detail {
  div {
    margin-top: 5px;
  }
}
</style>
