<template>
  <div>
    <el-dialog
      v-loading="dialogLoading"
      :visible.sync="tDialogVisible"
      top="20px"
      width="70%"
      :title="`【${dialogTitle}】最多添加10个广告`"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="box">
        <el-card class="box-card-2" shadow="never">
          <el-form
            ref="dataForm"
            :rules="form.rules"
            :model="form.data"
            label-position="top"
            label-suffix="："
            size="mini"
          >
            <el-form-item label="专题名称" prop="name">
              <el-input v-model="form.data.decorationName" placeholder="专题名称" />
            </el-form-item>
            <div class="haha">
              <div v-for="(col,index) in form.info.columns" :key="index" class="item">
                <div class="img" @click="handleUploadImg(`UploadImg${index}`)">
                  <img v-if="col.picture" :src="col.picture" :alt="col.title">
                  <p v-else>
                    <span>+</span>
                    <span>添加图片</span>
                  </p>
                  <UploadImg
                    :ref="`UploadImg${index}`"
                    :hidden="true"
                    :not-cutting="true"
                    :size="500"
                    :url.sync="col.picture"
                    :value.sync="col.guid"
                  />
                </div>
                <div class="form">
                  <el-form-item label="跳转链接" prop="name">
                    <el-input v-model="col.link" placeholder="跳转链接" />
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="tDialogVisible = false">关闭</el-button>
        <el-button type="primary" icon="iconfont icon-save" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetRuleConfigAsync,
  CreateDecorationRecordAsync,
  GetDecorationDetailsAsync
} from '@/api/Decoration'
import UploadImg from '@/components/UploadImg2/Button'
import { formatCurrency, parseTime } from '@/utils/index'
import draggable from 'vuedraggable'

export default {
  components: { draggable, UploadImg },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '查看会员'
    },
    guid: { type: String }
  },
  data() {
    return {
      dstyle: 2,
      classificationGuid: '87783a6fb4cc11e986ac00163e0c4296',
      form: {
        selectRowIndex: -1,
        data: {},
        info: {
          columns: []
        }
      },
      templates: [],
      options: {
        group: 'people',
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'chosenClass',
        scroll: true,
        scrollSensitivity: 200
      }
    }
  },
  computed: {
    tDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val && this.guid) {
        GetDecorationDetailsAsync({ decorationGuid: this.guid }).then(
          response => {
            this.form.data = response.data
            this.form.info = {
              columns: []
            }
            this.form.selectRowIndex = 0
            this.form.info = this.form.data.rows[0]
          }
        )
      } else if (val && !this.guid) {
        this.form.data = {
          decorationGuid: null,
          decorationName: '',
          classificationGuid: this.classificationGuid,
          rows: [
            {
              style: this.dstyle,
              ruleGuid: null,
              columns: [
                {
                  title: null,
                  picture: null,
                  link: null
                }
              ]
            },
            {
              style: this.dstyle,
              ruleGuid: null,
              columns: [
                {
                  title: null,
                  picture: null,
                  link: null
                },
                {
                  title: null,
                  picture: null,
                  link: null
                }
              ]
            }
          ]
        }
        this.form.selectRowIndex = 0
        this.form.info = this.form.data.rows[0]
      }
    }
  },
  created() {
    GetRuleConfigAsync({ classificationGuid: this.classificationGuid }).then(
      response => {
        this.templates = response.data.decorationRules
      }
    )
    this.form.info = this.form.data.rows[this.form.selectRowIndex]
  },
  methods: {
    handleSave() {
      CreateDecorationRecordAsync(this.form.data).then(response => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSelectModule(row, index) {
      this.form.selectRowIndex = index
      this.form.info = row
    },
    handleAddModule() {
      this.form.data.rows.push({
        style: this.dstyle,
        ruleGuid: null,
        columns: []
      })
    },
    handleSelectTemplate(temp) {
      var num = temp.rowNum * temp.columnNum
      var l = this.form.info.columns.length
      this.form.info.ruleGuid = temp.ruleGuid
      this.form.info.style = temp.style
      if (num > l) {
        for (let index = 0; index < num - l; index++) {
          this.form.info.columns.push({
            title: '没有title',
            picture: null,
            link: null
          })
        }
      } else {
        for (let index = 0; index < l - num; index++) {
          this.form.info.columns.pop()
        }
      }
    },
    handleUploadImg(uploadRef) {
      var sss = this.$refs[uploadRef]
      sss[0].selectFile()
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  display: flex;
  flex-direction: row;
  height: 100%;
  .box-card-2 {
    background-color: #f1f1f1;
    display: inline-block;
    width: calc(100% - 304px);
    height: 100%;
    .templates {
      border: 1px solid #ecdada;
      padding: 8px;
      background-color: #fff;
      cursor: pointer;
      .kuai {
        background-color: #fff;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        div {
          flex: 1;
          background-color: #ebf8fd;
          height: 100px;
          margin: 2px;
        }
      }

      span {
        display: block;
        text-align: center;
      }
      &.active {
        border: 1px solid #0099ff;
      }
    }
    .templates:hover {
      border: 1px solid #0099ff;
    }
    .haha {
      overflow-y: auto;
      height: 100%;
      .item {
        display: flex;
        flex-direction: row;
        background-color: #fff;
        padding: 10px;
        margin-bottom: 10px;
        .img {
          cursor: pointer;
          p {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 100%;
            padding: 0;
            margin: 0;
          }
          width: 100px;
          height: 100px;
          border: 1px dashed rgb(182, 181, 181);
          img {
            width: 100%;
            height: 100%;
          }
        }
        .form {
          margin-left: 20px;
          flex: 0.8;
        }
      }
    }
  }
}
</style>

