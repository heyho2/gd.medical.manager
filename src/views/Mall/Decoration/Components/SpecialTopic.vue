<template>
  <div>
    <el-dialog
      :visible.sync="tDialogVisible"
      top="20px"
      width="70%"
      :title="dialogTitle"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="box">
        <el-card class="box-card" shadow="never">
          <draggable
            :list="form.data.rows"
            class="board-column-content"
            :options="{animation: 150}"
          >
            <div v-for="(item,index) in form.data.rows" :key="index" class="board-item-f">
              <div v-if="form.data.ruleMode==2" class="close">
                <el-button
                  icon="el-icon-delete"
                  size
                  type="text"
                  @click="handleCloseModule(item,index)"
                />
              </div>
              <div
                v-if="item.columns.length==0"
                :class="`board-item ${form.selectRowIndex==index?'active':''}`"
                @click="handleSelectModule(item,index)"
              >点此编辑模块{{ index+1 }}</div>
              <div
                v-else
                :class="`board-item-preview ${form.selectRowIndex==index?'active':''}`"
                @click="handleSelectModule(item,index)"
              >
                <el-carousel v-if="item.style==1" height="100px">
                  <el-carousel-item v-for="(col,cindex) in item.columns" :key="cindex">
                    <!-- <img v-if="col.picture" :src="col.picture" alt /> -->
                    <el-image v-if="col.picture" :src="col.picture">
                      <div slot="placeholder" class="image-slot">
                        加载中
                        <span class="dot">...</span>
                      </div>
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </el-image>
                  </el-carousel-item>
                </el-carousel>
                <div v-for="(col,cindex) in item.columns" v-else :key="cindex">
                  <!-- <img v-if="col.picture" :src="col.picture" alt /> -->
                  <el-image v-if="col.picture" :src="col.picture">
                    <div slot="placeholder" class="image-slot">
                      加载中
                      <span class="dot">...</span>
                    </div>
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                  <p v-else style="height:100px;" />
                </div>
              </div>
            </div>

            <div v-if="form.data.ruleMode==2" style="text-align: center;">
              <el-button type="text" icon="el-icon-plus" @click="handleAddModule()">点此添加模块</el-button>
            </div>
          </draggable>
        </el-card>
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
            <el-form-item label="选择模板" prop="name">
              <el-row :gutter="10">
                <el-col
                  v-for="(temp,index) in templates"
                  :key="index"
                  :span="6"
                  @click.native="handleSelectTemplate(temp)"
                >
                  <div :class="`templates  ${form.info.ruleGuid==temp.ruleGuid?'active':''}`">
                    <div class="kuai a">
                      <div v-for="r in temp.rowNum" :key="r" class="row">
                        <div v-for="a in temp.columnNum" :key="a" class="column" />
                      </div>
                    </div>
                    <span v-if="temp.style==1">轮播图</span>
                    <span v-else>{{ temp.rowNum }}行{{ temp.columnNum }}个</span>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <div class="columns">
              <p class="prompt">提示：拖动图片可以更改排序。</p>
              <draggable :list="form.info.columns" :options="options">
                <div v-for="(col,index) in form.info.columns" :key="index" class="item">
                  <div class="img" @click="handleUploadImg(`UploadImg${index}`)">
                    <div class="close">
                      <el-button
                        icon="el-icon-delete"
                        size
                        title="重新上传"
                        type="text"
                        @click="handleReupload(col,index,$event)"
                      />
                    </div>
                    <!-- <img v-if="col.picture" :src="col.picture" :alt="col.title" title="点击上传图片" /> -->
                    <el-image
                      v-if="col.picture"
                      style="width:100%;height:100%"
                      :src="col.picture"
                      :alt="col.title"
                      :fit="`contain`"
                      title="点击上传图片"
                    >
                      <div slot="placeholder" class="image-slot">
                        加载中
                        <span class="dot">...</span>
                      </div>
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </el-image>
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
                      :after-success="uploadAfterSuccess"
                    />
                  </div>
                  <div class="form">
                    <el-form-item label="跳转链接" prop="name">
                      <el-input v-model="col.link" placeholder="跳转链接" />
                    </el-form-item>
                  </div>
                  <div v-if="form.selectRule.style==1" class="close">
                    <el-button
                      icon="el-icon-delete"
                      size
                      type="text"
                      @click="handleCloseColumn(col,index)"
                    />
                  </div>
                </div>
              </draggable>
              <div v-if="form.selectRule.style==1" style="text-align: center;">
                <el-button type="text" icon="el-icon-plus" @click="handleAddColumn()">点此添加图片</el-button>
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
        selectRule: {},
        data: {},
        info: {
          columns: []
        },
        cacheInfo: { columns: [] },
        cacheRows: []
      },
      templates: [],
      options: {
        // group: "people",
        animation: 150,
        handle: '.img'
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
      if (!val) return
      if (this.guid) {
        GetDecorationDetailsAsync({ decorationGuid: this.guid }).then(
          response => {
            this.form.data = response.data
            this.form.selectRowIndex = 0
            this.form.info = this.form.data.rows[0]
            this.templates = response.data.decorationRules
            this.form.cacheRows = JSON.parse(
              JSON.stringify(this.form.data.rows)
            )
            this.form.selectRule = this.templates[
              this.templates.findIndex(
                a => a.ruleGuid === this.form.info.ruleGuid
              )
            ]
          }
        )
      } else {
        GetRuleConfigAsync({
          classificationGuid: this.classificationGuid
        }).then(response => {
          this.templates = response.data.decorationRules
          this.form.data = {
            decorationGuid: null,
            decorationName: '',
            classificationGuid: this.classificationGuid,
            ruleMode: 2,
            rows: [
              {
                style: this.dstyle,
                ruleGuid: null,
                columns: []
              },
              {
                style: this.dstyle,
                ruleGuid: null,
                columns: []
              }
            ]
          }
          this.form.data.ruleMode = 2
          this.form.selectRowIndex = 0
          this.form.info = this.form.data.rows[0]
        })
      }
    }
  },
  created() {
    // this.form.info = this.form.data.rows[this.form.selectRowIndex];
  },
  methods: {
    handleSave() {
      // form.data.rows.forEach(item => {

      // });
      CreateDecorationRecordAsync(this.form.data).then(response => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.tDialogVisible = false
        this.$emit('onSuccess', 123)
      })
    },
    handleSelectModule(row, index) {
      this.form.selectRowIndex = index
      this.form.info = row
      this.form.cacheInfo = JSON.parse(JSON.stringify(row))
    },
    handleAddModule() {
      this.form.data.rows.push({
        style: this.dstyle,
        ruleGuid: null,
        columns: []
      })
    },
    handleSelectTemplate(temp) {
      var t = this
      this.form.selectRule = temp

      if (this.form.data.ruleMode == 2) {
        this.form.info.ruleGuid = temp.ruleGuid
        this.form.info.style = temp.style
        if (this.form.cacheInfo.ruleGuid == temp.ruleGuid) {
          //   this.form.info = this.form.cacheInfo;
          this.form.info.columns = JSON.parse(
            JSON.stringify(this.form.cacheInfo.columns)
          )
          return
        }
        var num = temp.rowNum * temp.columnNum
        var l = this.form.info.columns.length

        if (num > l) {
          for (let index = 0; index < num - l; index++) {
            this.form.info.columns.push({
              title: null,
              picture: null,
              link: null
            })
          }
        } else {
          for (let index = 0; index < l - num; index++) {
            this.form.info.columns.pop()
          }
        }
      } else {
        var rows = this.form.data.rows
        if (
          this.form.cacheRows.length > 0 &&
          this.form.cacheRows[0].ruleGuid == temp.ruleGuid
        ) {
          this.form.data.rows = []
          for (let index = 0; index < temp.rowNum; index++) {
            const row = {
              style: temp.style,
              ruleGuid: temp.ruleGuid,
              columns: JSON.parse(
                JSON.stringify(this.form.cacheRows[index].columns)
              )
            }
            this.form.data.rows.push(row)
          }
          this.form.selectRowIndex = 0
          this.form.info = this.form.data.rows[this.form.selectRowIndex]
          return
        }
        // this.form.data.rows = [];
        var rows = this.form.data.rows
        this.form.data.rows.forEach(element => {
          element.style = temp.style
          element.ruleGuid = temp.ruleGuid
          if (temp.columnNum > element.columns.length) {
            t.__addColumn(
              temp.columnNum - element.columns.length,
              element.columns
            )
          } else {
            t.__deleteColumn(
              element.columns.length - temp.columnNum,
              element.columns
            )
          }
        })
        if (temp.rowNum > rows.length) {
          this.__addRow(temp.rowNum - rows.length, temp)
        } else {
          this.__deleteRow(rows.length - temp.rowNum)
        }
        this.form.selectRowIndex = 0
        this.form.info = this.form.data.rows[this.form.selectRowIndex]
      }
    },
    __addRow(rowNum, temp) {
      for (let index = 0; index < rowNum; index++) {
        const row = {
          style: temp.style,
          ruleGuid: temp.ruleGuid,
          columns: []
        }

        for (let c = 0; c < temp.columnNum; c++) {
          row.columns.push({
            title: null,
            picture: null,
            link: null
          })
        }
        this.form.data.rows.push(row)
      }
    },
    __deleteRow(rowNum) {
      for (let index = 0; index < rowNum; index++) {
        this.form.data.rows.pop()
      }
    },
    __addColumn(columnNum, columns) {
      for (let index = 0; index < columnNum; index++) {
        columns.push({
          title: null,
          picture: null,
          link: null
        })
      }
    },
    __deleteColumn(columnNum, columns) {
      for (let index = 0; index < columnNum; index++) {
        columns.pop()
      }
    },
    handleUploadImg(uploadRef) {
      var sss = this.$refs[uploadRef]
      sss[0].selectFile()
    },
    uploadAfterSuccess(url, guid) {
      this.form.cacheInfo = JSON.parse(JSON.stringify(this.form.info))
      this.form.cacheRows = JSON.parse(JSON.stringify(this.form.data.rows))
    },
    handleCloseModule(item, index) {
      this.$confirm('此操作将该模块删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.data.rows.splice(index, 1)
      })
    },
    handleCloseColumn(item, index) {
      this.$confirm('此操作将该模块删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.info.columns.splice(index, 1)
      })
    },
    handleAddColumn() {
      this.__addColumn(1, this.form.info.columns)
    },
    asdasd(ruleGuid) {
      var sss = (this.form.selectRule =
        this.templates[
          this.templates.findIndex(a => a.ruleGuid === ruleGuid)
        ] || {})
      return sss.style == 1
    },
    handleReupload(item, index, event) {
      event.stopPropagation()
      item.picture = null
      item.link = null
      item.title = null
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  display: flex;
  flex-direction: row;
  height: 100%;
  .box-card {
    width: 300px;
    height: 100%;
    overflow-y: auto;
    margin-right: 5px;
    flex: 1;
    .board-column-content {
      .board-item-f {
        position: relative;
        .close {
          z-index: 2;
          display: inline-block;
          position: absolute;
          right: 4px;
          top: 4px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.3);
          .el-button {
            padding: 0;
            color: #fff;
          }
        }
        .close:hover {
          border: 1px solid #fff;
        }

        .board-item {
          cursor: pointer;
          background-color: #ebf8fd;
          border: 1px dashed #fff;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          &.active {
            border: 1px dashed #0099ff;
          }
        }
        .board-item:hover {
          border: 1px dashed #0099ff;
        }
        .board-item-preview {
          cursor: pointer;
          background-color: #ebf8fd;
          border: 1px dashed #fff;
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          &.active {
            border: 1px dashed #0099ff;
          }
          div {
            flex: 1;
            border: 1px dashed #fff;
            img {
              width: 100%;
            }
          }
        }
      }
    }
  }

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
        flex-direction: column;
        height: 100px;
        .row {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          .column {
            flex: 1;
            background-color: #ebf8fd;
            // height: 100px;
            margin: 2px;
          }
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
    .columns {
      //   overflow-y: auto;
      //   height: 100%;
      .prompt {
        font-size: 12px;
        color: #9f9c9c;
      }
      .item {
        position: relative;
        display: flex;
        flex-direction: row;
        background-color: #fff;
        padding: 10px;
        margin-bottom: 10px;
        .close {
          display: inline-block;
          position: absolute;
          right: 4px;
          top: 4px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.3);
          .el-button {
            padding: 0;
            color: #fff;
          }
        }
        .close:hover {
          border: 1px solid #fff;
        }
        .img {
          cursor: pointer;
          position: relative;
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
          .close {
            z-index: 2;
            display: inline-block;
            position: absolute;
            right: 4px;
            top: 4px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.3);
            .el-button {
              padding: 0;
              color: #fff;
            }
          }
          .close:hover {
            border: 1px solid #fff;
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

//单一直责：
//里氏替换：子类不要去试图重写父类的方法，保证基类稳定，父类可以替换子类
//接口隔离：不要建一个庞大的接口，因为有的类在继承的时候用不着，接口是可以多继承，要细分
//迪米特：降低类于类之间的耦合，（无需通信就不要相互调用）
//依赖倒置：依赖抽象（ioc）
//开闭：对扩展开放修改封闭（抽象约束）

redis ：  key/vuele
          list：双向链表
          set:有顺序集合
          zset:有序无重复
          hash：简单对象

