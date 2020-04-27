<template>
  <Drawer :title="'医生信息'" :dialog-visible.sync="c_dialogVisible" width="90%" style>
    <template>
      <el-card class="box-card" shadow="never">
        <div class="gd_member_info">
          <el-row>
            <el-col :span="6">
              <span class="info_label">医生姓名：</span>
              {{ info.userName }}
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="6">
              <span class="info_label">执业医院：</span>
              {{ info.hospitalName }}
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="6">
              <span class="info_label">所在科室：</span>
              {{ info.officeName }}
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card" shadow="never" style="margin-top: 20px;">
        <div slot="header" class="clearfix">
          <span>咨询信息</span>
        </div>
        <topic :guid="info.doctorGuid" style="margin: 15px 0px;" />
      </el-card>
    </template>
    <template v-slot:footer>
      <el-button icon="el-icon-close" @click="c_dialogVisible = false">关闭</el-button>
    </template>
  </Drawer>
</template>

<script>
import Drawer from '@/components/Drawer/Index'
import { parseTime } from '@/utils/index'
import Topic from './Topic'
export default {
  components: { Topic, Drawer },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '医生详细'
    },
    info: { type: Object }
  },
  data() {
    return {}
  },
  computed: {
    c_dialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  watch: {},
  created() {},
  methods: {}
}
</script>

