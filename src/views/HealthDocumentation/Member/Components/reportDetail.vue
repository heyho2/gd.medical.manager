<template>
  <div>
    <div class="flex">
      <div>
        <span class="lable">用户昵称：</span>
        <span>{{ info.nickName }}</span>
      </div>
      <div>
        <span class="lable">手机号：</span>
        <span>{{ info.phone }}</span>
      </div>
    </div>
    <div class="flex">
      <div class="lable">报告名称：</div>
      <div>{{ info.reportName }}</div>
    </div>
    <div class="flex">
      <div class="lable">报告建议：</div>
      <div>{{ info.suggestion }}</div>
    </div>

    <template v-for="(f,n) of info.attachments">
      <div :key="n" class="flex">
        <i class="el-icon-link item-icon" />
        <span>{{ f.name }}</span>

        <gd-img
          v-if="calUrl(f.url)"
          :ref="f.name+n"
          :src="f.url"
          preview="1354654354351351"
          hidden
        />

        <a
          v-if="isPdf(f.url)"
          :href="f.url"
          target="_blank"
          class="item-check"
          rel="noopener noreferrer"
        >查看</a>

        <span v-if="calUrl(f.url)" class="item-check" @click="check(f.name+n)">查看</span>
      </div>
    </template>

    <div class="foot-btn">
      <el-button type="primary" @click="back">返 回</el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import GdImg from '@/views/Commons/GdImg'
export default {
  components: {
    GdImg
  },

  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    ...mapMutations({
      set_ctx: 'SET_MEMBER_CTX' // 弹窗上下文显示开关
    }),
    back() {
      this.set_ctx('test')
    },
    check(ref) {
      this.$refs[ref][0].$el.click()
    },
    calUrl(url) {
      if (!url) return false
      const aaa = url.split('.')
      const last = aaa[aaa.length - 1]
      const bbb = ['jpg', 'png', 'jpeg']
      return bbb.some(b => b === last)
    },
    isPdf(url) {
      if (!url) return false
      const aaa = url.split('.')
      const last = aaa[aaa.length - 1]
      const bbb = ['pdf']
      return bbb.some(b => b === last)
    }
  }
}
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  flex-wrap: nowrap;
  div {
    width: 50%;
  }
}

.item-icon {
  display: inline-block;
  margin-bottom: 20px;
  padding: 0 15px 0 28px;
  font-weight: bold;
}
.item-check {
  cursor: pointer;
  padding-left: 28px;
  color: rgb(39, 130, 250);
}

.lable {
  width: 98px !important;
  display: inline-block;
  margin-bottom: 20px;
  padding-left: 28px;
  font-weight: bold;
}

.foot-btn {
  margin-top: 20px;
  text-align: center;
}
</style>
