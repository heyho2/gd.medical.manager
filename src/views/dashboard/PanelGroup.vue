<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-gd-order">
          <svg-icon icon-class="order" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">月总订单</div>
          <count-to :start-val="0" :end-val="OrderQty" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-gd-doctors">
          <svg-icon icon-class="医生" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">医生数量</div>
          <count-to :start-val="0" :end-val="DoctorsQty" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-gd-merchant">
          <svg-icon icon-class="商户" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">商户数量</div>
          <count-to :start-val="0" :end-val="MerchantQty" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-gd-user">
          <svg-icon icon-class="user" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">用户数量</div>
          <count-to :start-val="0" :end-val="UserQty" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import {
  GetUserQtyAsync,
  GetDoctorsQtyAsync,
  GetMerchantQtyAsync,
  GetOrderQtyAsync
} from '@/api/Home'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      UserQty: 0,
      DoctorsQty: 0,
      MerchantQty: 0,
      OrderQty: 0
    }
  },
  created() {
    GetUserQtyAsync().then(response => {
      this.UserQty = response.data
    })
    GetDoctorsQtyAsync().then(response => {
      this.DoctorsQty = response.data
    })
    GetMerchantQtyAsync().then(response => {
      this.MerchantQty = response.data
    })
    GetOrderQtyAsync().then(response => {
      this.OrderQty = response.data
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-gd-order {
        background: #40c9c6;
      }
      .icon-gd-doctors {
        background: #36a3f7;
      }
      .icon-gd-merchant {
        background: #f4516c;
      }
      .icon-gd-user {
        background: #34bfa3;
      }
    }
    .icon-gd-order {
      color: #40c9c6;
    }
    .icon-gd-doctors {
      color: #36a3f7;
    }
    .icon-gd-merchant {
      color: #f4516c;
    }
    .icon-gd-user {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
