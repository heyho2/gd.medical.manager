<template>
  <div>
    <div class="app-container">

      <div class="content"
           ref="leftContent"
           @scroll="handleScroll"
           v-loading="listLoading">
        <draggable :disabled="!isEdit"
                   :list="list"
                   :options="{animation: 1000}"
                   @end="draggableEnd"
                   @start="draggableStart">

          <div v-for="(i,n) of list"
               :key="n"
               class="content-box"
               :class="[currentIndex===i.index?'active_box':'']"
               title="方块可自由预设排序"
               @click.prevent="handleClick(i.index)"
               @drop.prevent="handleDrop(i.index)">

            <i v-if="isEdit && list.length>1"
               class="el-icon-delete-solid delete-icon"
               @click.stop="deleteLeft(n,i.index)" />
            <!-- 单指标 -->
            <div v-if="!i.indicatorType"
                 class="item">
              <span>{{ n+1 }}.{{ i.indicatorName }}</span>
              <span style="width:40%">参考范围：{{ i.minValue }} <span v-if="(i.minValue>=0)&&(i.maxValue>=0) ">-</span> {{ i.maxValue }}
                <template v-if="calNum(i)">
                  <template v-if="i.maxValue"
                            style="width:20%">（最高值）</template>
                  <template v-if="i.minValue"
                            style="width:20%">（最低值）</template>
                </template></span>

              <span>单位：{{ i.optionUnit }}</span>
            </div>

            <!-- 多指标 -->
            <div v-else
                 class="more">
              <p class="title">{{ n+1 }}.{{ i.indicatorName }}</p>

              <!-- 占位 -->
              <div v-if="!i.options || (!i.options && !i.options.length) "
                   class="item m-10">
                请设置指标！
              </div>

              <div v-for="(item,index) of i.options"
                   v-else
                   :key="index"
                   class="item m-10">
                <span>{{ item.optionName }}</span>
                <span style="width:40%">参考范围：{{ item.minValue }} <span v-if="item.minValue>=0&&item.maxValue>=0 ">-</span> {{ item.maxValue }}
                  <template v-if="calNum(item)">
                    <template v-if="item.maxValue"
                              style="width:20%">（最高值）</template>
                    <template v-if="item.minValue"
                              style="width:20%">（最低值）</template>
                  </template>
                </span>
                <span>单位：{{ item.optionUnit }}</span>
              </div>

            </div>

          </div>
        </draggable>

        <div v-if="isEdit"
             class="content-box add-index"
             @click="addLeftIndex">
          <h1 style="margin:0">+</h1>
        </div>
      </div>

      <div style="width:50%"
           :style="{overflow:listLoading?'':'hidden'}"
           v-loading="listLoading">
        <div class="right-wrap">
          <div class="content"
               style="width:95%">
            <!-- <div>
              <pre style="font-size:10px">{{list}}</pre>
            </div> -->

            <el-form ref="ruleForm"
                     :model="ruleForm"
                     :rules="rules"
                     label-width="120px"
                     style="margin-top:40px">

              <h5 class="right-title">设置指标</h5>

              <div class="display">
                <el-form-item label="是否显示到用户端："
                              label-width="200">
                  <el-switch v-model="ruleForm.display"
                             class="switchStyle"
                             active-text="是"
                             inactive-text="否" />
                </el-form-item>
              </div>

              <el-form-item label="指标类型："
                            prop="indicatorType">
                <el-radio v-model="ruleForm.indicatorType"
                          :label="0">单一值</el-radio>
                <el-radio v-model="ruleForm.indicatorType"
                          :label="1">多个值</el-radio>
              </el-form-item>

              <!-- 单一值 -->
              <div v-if="ruleForm.indicatorType===0">
                <el-form-item label="指标名称："
                              prop="indicatorName">
                  <el-input v-model="ruleForm.indicatorName"
                            size="mini"
                            :maxlength="10" />

                </el-form-item>

                <el-form-item label="单位："
                              prop="optionUnit">
                  <el-input v-model="ruleForm.optionUnit"
                            size="mini"
                            :maxlength="7"
                            placeholder="请输入单位" />

                </el-form-item>

                <el-form-item label="参考范围："
                              prop="range">

                  <el-input-number v-model="ruleForm.minValue"
                                   size="small"
                                   style="width:140px"
                                   placeholder="请输入最低参考值"
                                   :controls="false"
                                   :precision="3"
                                   :min="-999999"
                                   :max="999999" />
                  ~

                  <el-input-number v-model="ruleForm.maxValue"
                                   size="small"
                                   style="width:140px"
                                   placeholder="请输入最高参考值"
                                   :controls="false"
                                   :precision="3"
                                   :min="-999999"
                                   :max="999999" />
                </el-form-item>

              </div>

              <!-- 多个值 -->
              <div v-else>

                <el-form-item label="主指标名称："
                              prop="indicatorName">
                  <el-input v-model="ruleForm.indicatorName"
                            size="mini"
                            :maxlength="10" />

                </el-form-item>

                <draggable :list="ruleForm.options"
                           :options="{animation: 150}">
                  <div v-for="(i,n) of ruleForm.options"
                       :key="n"
                       class="content-box">

                    <i v-if="!!ruleForm.options && ruleForm.options.length>2"
                       class="el-icon-delete-solid delete-icon"
                       @click.stop="deleteRight(n)" />

                    <el-form-item label="子指标名称："
                                  :prop="`options.${n}.optionName`"
                                  :rules="rules.optionName">
                      <el-input v-model="i.optionName"
                                size="mini"
                                :maxlength="10"
                                placeholder="请输入子指标名称" />

                    </el-form-item>

                    <el-form-item label="单位："
                                  :prop="`options.${n}.optionUnit`"
                                  :rules="rules.optionUnit">
                      <el-input v-model="i.optionUnit"
                                size="mini"
                                :maxlength="7"
                                placeholder="请输入单位" />

                    </el-form-item>

                    <el-form-item label="参考范围：">

                      <el-input-number v-model="i.minValue"
                                       size="small"
                                       style="width:140px"
                                       placeholder="请输入最低参考值"
                                       :controls="false"
                                       :precision="3"
                                       :min="-999999"
                                       :max="999999" />
                      ~

                      <el-input-number v-model="i.maxValue"
                                       size="small"
                                       style="width:140px"
                                       placeholder="请输入最高参考值"
                                       :controls="false"
                                       :precision="3"
                                       :min="-999999"
                                       :max="999999" />
                    </el-form-item>

                    <el-form-item label="是否必填：">
                      <el-switch v-model="i.required"
                                 class="switchStyle"
                                 active-text="是"
                                 inactive-text="否" />
                    </el-form-item>

                  </div>
                </draggable>

              </div>
            </el-form>

            <div v-if="ruleForm.indicatorType===1"
                 class="content-box add-index"
                 @click="addRightIndex">
              <h4 style="margin:0">添加子指标</h4>
            </div>

          </div>

          <div ref="selector"
               class="selector"
               :class="[isEdit?'':'is-edit-selector']"
               :style="{top:selectTop+'px'}" />

          <transition name="el-fade-in-linear">
            <div v-show="!isEdit"
                 class="mask"
                 title="查看状态不可编辑" />
          </transition>
        </div>

      </div>
      <div class="foot-btn">
        <el-button v-if="!isEdit"
                   :loading="listLoading"
                   @click="edit">编 辑</el-button>

        <template v-else>
          <el-button :loading="listLoading"
                     @click="cancel">取 消</el-button>
          <el-button type="primary"
                     :loading="listLoading"
                     @click="save('ruleForm')">保 存</el-button>
        </template>

      </div>
    </div>

  </div>
</template>

<script>
import draggable from "vuedraggable";
import {
  GetHealthIndicators,
  SaveHealthIndicators
} from "@/api/HealthDocumentation/HealthIndicator";
export default {
  components: {
    draggable
  },

  data() {
    return {
      selectTop: 0,
      leftScrollHeight: 0,
      currentIndex: NaN,
      listLoading: false,
      isEdit: false,
      editList: null,
      timer: null,
      list: [
        {
          index: 0,
          indicatorType: 0,
          display: true,
          indicatorName: "",
          minValue: null,
          maxValue: null,
          optionUnit: ""
        },
        {
          index: 1,
          indicatorType: 1,
          display: true,
          indicatorName: "",
          options: [
            {
              optionName: "",
              minValue: null,
              maxValue: null,
              optionUnit: "",
              required: false
            },
            {
              optionName: "",
              minValue: null,
              maxValue: null,
              optionUnit: "",
              required: false
            }
          ]
        },
        {
          index: 2,
          indicatorType: 0,
          display: true,
          indicatorName: " ",
          minValue: null,
          maxValue: null,
          optionUnit: ""
        }
      ],

      ruleForm: {
        indicatorType: 0,
        display: true,
        options: [
          {
            required: true
          }
        ]
      },

      rules: {
        optionName: [
          { required: true, message: "必填", trigger: "blur" },
          { min: 1, max: 10, message: "长度在1 到 10个字符", trigger: "blur" }
        ],
        indicatorName: [
          { required: true, message: "必填", trigger: "blur" },
          { min: 1, max: 10, message: "长度在1 到 10个字符", trigger: "blur" }
        ],
        optionUnit: [
          // { required: true, message: "必填", trigger: "blur" },
          { min: 1, max: 7, message: "长度在1 到 7个字符", trigger: "blur" }
        ]
      }
    };
  },

  created() {
    this.getData();
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      // 初始化选择的dom
      this.currentIndex = 0;
      this.chageIndex();
    },
    getData(cb) {
      GetHealthIndicators().then(res => {
        res.data.healthIndicators.forEach((i, n) => {
          i.index = n;

          // 如果获取的数据为单一指标
          if (!i.indicatorType && !!i.options && !!i.options.length) {
            i.minValue = i.options[0].minValue;
            i.maxValue = i.options[0].maxValue;
            i.optionUnit = i.options[0].optionUnit;
            i.optionGuid = i.options[0].optionGuid;
            i.indicatorName = i.options[0].optionName;
          }
        });

        this.list = res.data.healthIndicators;

        if (!Array.isArray(this.list)) {
          this.list = [];
          this.addLeftIndex();
          this.list.forEach((i, n) => {
            i.index = n;
          });
        }

        if (!this.list.length) {
          this.addLeftIndex();
          this.list.forEach((i, n) => {
            i.index = n;
          });
        }
        cb && cb();
      });
    },

    addLeftIndex() {
      const opt = {
        optionUnit: "",
        optionName: "",
        required: true
      };

      const temp = {
        indicatorType: 0,
        display: true,
        options: [
          JSON.parse(JSON.stringify(opt)),
          JSON.parse(JSON.stringify(opt))
        ]
      };

      if (!!this.list && this.list.length) {
        temp.index = this.list[this.list.length - 1].index + 1;
      }
      this.list.push(temp);
    },

    addRightIndex() {
      const temp = { required: true };
      if (!this.ruleForm.options) {
        this.$set(this.ruleForm, "options", []);
      }
      this.ruleForm.options.push(temp);
    },

    save(formName) {
      this.listLoading = true;

      this.$refs[formName].validate(valid => {
        if (valid) {
          let isPass = this.checkParams();

          if (!isPass) return;

          const params = this.handleData();

          SaveHealthIndicators({ items: params })
            .then(res => {
              this.isEdit = !this.isEdit;

              setTimeout(() => {
                this.$success("保存成功。");

                this.getData();
                this.listLoading = false;
              }, 300);
            })
            .catch(() => {
              this.$error("保存失败。");
              this.listLoading = false;
            });

          // 模拟时使用
          // setTimeout(() => {
          // this.editList = JSON.parse(JSON.stringify(this.list));

          // this.isEdit = !this.isEdit;
          //   this.listLoading = false;
          // }, 500);
        } else {
          this.listLoading = false;
          this.errorLog("保存失败，请检查填写情况。");
        }
      });
    },

    // 数据处理
    handleData() {
      const params = this.list.map(i => {
        // 单一指标情况
        if (!i.indicatorType) {
          return {
            indicatorGuid: i.indicatorGuid,
            indicatorName: i.indicatorName.trim(),
            indicatorType: i.indicatorType,
            display: i.display,
            options: [
              {
                optionName: i.indicatorName,
                optionGuid: i.optionGuid,
                optionUnit: i.optionUnit,
                maxValue: i.maxValue,
                minValue: i.minValue
              }
            ]
          };
        } else {
          // 多指标情况
          return {
            indicatorGuid: i.indicatorGuid,
            indicatorName: i.indicatorName.trim(),
            indicatorType: i.indicatorType,
            display: i.display,
            options: i.options
          };
        }
      });

      return params;
    },

    // 参数验证
    checkParams() {
      const errorList = [];

      this.list.forEach((i, index) => {
        const temp = {
          index: index + 1
        };

        if (!i.indicatorName) {
          temp.msg = "未设置指标名称";
          errorList.push(temp);
        }

        if (i.indicatorType === 1) {
          if (!i.options || i.options.length === 0) {
            temp.msg = "未设置子指标";
            errorList.push(temp);
          }

          if (i.options && i.options.length > 0) {
            const hasName = i.options.every(a => !!a.optionName === true);
            if (!hasName) {
              temp.msg = "未设置子指标名称";
              errorList.push(temp);
            }
          }
        }
      });

      if (!!errorList.length) {
        errorList.forEach(i => {
          setTimeout(() => {
            this.errorLog(`【第${i.index}条指标】:${i.msg}`);
          }, 500);
        });
        this.listLoading = false;
        return false;
      } else {
        return true;
      }
    },

    edit() {
      this.editList = JSON.parse(JSON.stringify(this.list));
      this.ruleForm = this.list.find(i => i.index === this.currentIndex);
      this.isEdit = !this.isEdit;
    },

    cancel() {
      this.getData(() => {
        this.init();
        this.isEdit = !this.isEdit;
      });

      // 模拟时打开
      // this.list = JSON.parse(JSON.stringify(this.editList));
      // this.currentIndex = this.list[0].index;
      // this.chageIndex();
      //  this.isEdit = !this.isEdit;
    },

    deleteLeft(n, i) {
      // 只有一条数据情况下
      if (this.list.length === 1) return;

      // 删除第一条的情况 （右屏变为未删数据前的列表第二条数据）
      if (n === 0) {
        this.ruleForm = this.list[1];
        this.list.splice(n, 1);
        return;
      }

      this.currentIndex = this.list[n - 1].index;

      this.chageIndex();

      this.list.splice(n, 1);
    },

    deleteRight(n) {
      this.ruleForm.options.splice(n, 1);
    },

    calNum(i) {
      // 两个值都存在 不显示               //当有一个有效值
      let res =
        !(i.minValue > 0 && i.maxValue > 0) &&
        (i.minValue > 0 || i.maxValue > 0);

      return res;
    },

    handleClick(i) {
      this.currentIndex = i;
      this.chageIndex();
    },
    handleDrop(i) {
      this.currentIndex = i;
      this.chageIndex();
    },

    handleScroll(e) {
      if (!this.timer) {
        this.timer = setInterval(() => {
          if (this.$refs.leftContent.scrollTop == this.leftScrollHeight) {
            clearInterval(this.timer);
            this.timer = null;
            this.chageIndex();
          }
        }, 1000);
      }
      this.leftScrollHeight = this.$refs.leftContent.scrollTop;
    },

    chageIndex() {
      this.ruleForm = this.list.find(i => i.index === this.currentIndex);

      // 设置指针移动
      setTimeout(() => {
        const el = document.querySelector(".content .active_box");

        this.selectTop = el.getBoundingClientRect().y - 104;
      }, 66);
    },

    errorLog(msg) {
      return this.$notify.error({
        message: msg
      });
    },
    draggableStart() {},
    draggableEnd(evt, vv) {}
  }
};
</script>

<style lang="less" scoped>
.app-container {
  background-color: #f0f2f5;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

.content {
  position: relative;
  box-sizing: border-box;
  overflow-y: auto;
  width: 50%;
  height: 760px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .content-box {
    position: relative;
    cursor: pointer;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    color: #999;
    transition: all 0.25s ease;
    border: dashed 1px #d7d7d7;
    font-size: 14px;
    &:hover {
      color: #655f5f;
      background-color: #3496ff3f;
      border: dashed 1px #6cb2ff;
    }

    .item {
      display: flex;
      justify-content: space-between;

      span {
        width: 30%;
      }
    }

    .title {
      margin: 0;
      padding-bottom: 5px;
      border-bottom: solid 1px #d7d7d7;
    }

    &:hover .delete-icon {
      display: block;
    }

    .delete-icon {
      position: absolute;
      right: 0;
      top: 0;
      display: none;

      &:hover {
        color: #6cb2ff;
      }
    }
  }

  .add-index {
    text-align: center;
    font-weight: bold;
    color: #d7d7d7;
    &:hover {
      border: dashed 1px #6cb2ff;
      color: #6cb2ff;
    }
  }
}

.foot-btn {
  padding-top: 7px;
  width: 100%;
  text-align: center;
  button {
    width: 150px;
  }
}

.m-10 {
  margin: 10px 0;
}

.right-wrap {
  position: relative;
  width: 100%;
  margin-left: 40px;

  .right-title {
    margin: 15px;
    position: absolute;
    top: 0;
    left: 10px;
    color: #655f5f;
  }
  .display {
    position: absolute;
    top: 0;
    right: 10px;
    width: 200px;
  }

  .selector {
    transition: all 0.25s ease;
    position: absolute;
    left: -30px;
    width: 0;
    height: 0;
    border-width: 15px;
    border-style: solid;
    border-color: transparent #fff transparent transparent;
  }

  .is-edit-selector {
    border-color: transparent #fff transparent transparent;
  }

  .mask {
    cursor: not-allowed;
    z-index: 9999999;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
  }
}

.active_box {
  color: #655f5f !important;
  border: dashed 1px #9cc9f8 !important;
  background-color: #3496ff3f !important;
}

/deep/.el-input--mini {
  width: 296px;
}

/deep/.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
/deep/.switchStyle .el-switch__label--left {
  z-index: 9;
  left: 30px;
}
/deep/.switchStyle .el-switch__label--right {
  z-index: 9;
  left: -3px;
}
/deep/.switchStyle .el-switch__label.is-active {
  display: block;
}
/deep/.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
</style>
