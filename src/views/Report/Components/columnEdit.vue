<template>
  <draggable
    :list="c_values"
    class="board-column-content"
    :options=" {animation: 150}"
    :move="onMove"
  >
    <el-card
      v-for="(item,index) in c_values"
      :key="index"
      class="card"
      :body-style="{ padding: '0px' }"
    >
      <div class="close">
        <el-button
          icon="el-icon-delete"
          size
          title="删除"
          type="text"
          @click="handleDelete(item,index,$event)"
        />
      </div>
      <div class="card-cont">
        <el-form label-position="left" size="mini" label-suffix=":" label-width="45px">
          <el-form-item label="类型">
            <el-select v-model="item.valueType" clearable placeholder="请选择类型">
              <el-option
                v-for="item in Object.keys(types)"
                :key="item"
                :label="types[item]"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="字段">
            <el-input v-model="item.fieldCode" placeholder="请输入字段" clearable />
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="item.columnName" placeholder="请输入名称" clearable />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="card" :body-style="{ padding: '0px' }">
      <div class="card-cont2">
        <el-button type="small" icon="el-icon-circle-plus" title="添加列" @click="add()">添加列</el-button>
      </div>
    </el-card>
  </draggable>
</template>
<script>
import '@/utils/linq'
import draggable from 'vuedraggable'

export default {
  components: { draggable },
  props: {
    values: { type: Array }
  },
  data() {
    return {
      types: {
        string: '字符串',
        int: '整数',
        decimal: '浮点',
        datetime: '日期',
        bool: '布尔值'
      }
    }
  },
  computed: {
    c_values: {
      get() {
        return this.values
      },
      set(val) {
        this.$emit('update:values', val)
      }
    }
  },
  watch: { values(val) {} },
  created() {},
  methods: {
    add() {
      this.c_values.push({
        valueType: null,
        conditionName: null,
        fieldCode: null,
        sort: this.c_values.length
      })
    },
    handleDelete(item, index, $event) {
      this.c_values.splice(index, 1)
    },
    onMove(evt) {
      this.c_values[evt.draggedContext.index].sort = evt.relatedContext.index
      this.c_values[evt.relatedContext.index].sort = evt.draggedContext.index
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-form .el-form-item {
  margin-bottom: 18px;
}
.card {
  display: inline-block;
  margin-right: 10px;
  position: relative;
  .close {
    z-index: 2;
    display: inline-block;
    position: absolute;
    right: 2px;
    top: 2px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    .el-button {
      padding: 0;
      color: #fff;
    }
  }
  .close:hover {
    border: 1px solid #fff;
  }
  .card-cont {
    height: 180px;
    width: 200px;
    padding: 25px 10px 5px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .card-cont2 {
    height: 180px;
    width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
