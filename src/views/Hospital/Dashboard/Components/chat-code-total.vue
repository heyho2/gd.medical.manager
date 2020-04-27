<template>
  <div>
    <title-box :title="title" />

    <div class="content">
      <div>
        <count-to :start-val="0"
                  :end-val="turnWan(form.yesterdayMoney)"
                  :duration="2600"
                  :decimals="2"
                  class="count c-green" />
        <div>昨日</div>
      </div>

      <div>
        <count-to :start-val="0"
                  :decimals="2"
                  :end-val="turnWan(form.thisMonth)"
                  :duration="2600"
                  class="count c-blue" />
        <div>本月</div>
      </div>

      <div>
        <count-to :start-val="0"
                  :decimals="2"
                  :end-val="turnWan(form.lastMonth)"
                  :duration="2600"
                  class="count c-red" />
        <div>上月</div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetWeChatDetailAsync } from "@/api/DataBoard";
import CountTo from "vue-count-to";
import titleBox from "./title-box";
import { turnWan } from "@/utils";
export default {
  components: {
    CountTo,
    titleBox
  },
  props: {
    num: {
      type: Number,
      default: 0
    }
  },
  watch: {
    num(v) {
      if (v > 0) {
        this.form.thisMonth += this.num;
      }
    }
  },
  data() {
    return {
      title: "微信扫码收款情况(万元)",
      form: {
        lastMonth: 0,
        thisMonth: 0,
        yesterdayMoney: 0
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取 微信扫码收款情况
    getData() {
      GetWeChatDetailAsync().then(res => {
        this.form = res.data;
      });
    },

    // 元转万元保留两位
    turnWan
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  div {
    font-size: 1rem;
    margin: 0.5rem 1rem;
    text-align: center;
  }

  .count {
    font-weight: bold;
    font-size: 1.5rem;
    text-align: center;
    display: block;
  }
}

.c-blue {
  color: rgb(49, 99, 210);
}

.c-red {
  color: #ff0849;
}

.c-green {
  color: #18e478;
}
</style>
