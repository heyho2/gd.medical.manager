<template>
  <div class="answer">
    <draggable
      class="board-column-content"
      :list="c_list"
      :options="{animation: 150,handle:'.answer .tuo'}"
    >
      <div v-for="(item,index) in c_list" :key="index" class="item2">
        <el-input
          v-model="item.answerLabel"
          :placeholder="`请输入选项${index+1}`"
          size="mini"
          :disabled="disable"
          :maxlength="20"
        >
          <el-button slot="prepend" class="tuo" icon="el-icon-rank" title="长按此处拖动" />
          <el-button v-if="!disable" slot="append" icon="el-icon-plus" @click="__add(index)" />
          <el-button
            v-if="!disable"
            slot="append"
            icon="el-icon-delete"
            @click="__delete(index,item)"
          />
          <!-- <el-checkbox
            v-model="item.isDefault"
            @change="__checkbox(index,item)"
            slot="append"
            style="margin-left:20px;"
          >是否默认值</el-checkbox>-->
        </el-input>
      </div>
    </draggable>
    <el-button v-if="!disable" type="text" icon="el-icon-plus" @click="__add(-1)">点此添加选项</el-button>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: { draggable },
  props: {
    disable: {
      type: Boolean
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    c_list: {
      get() {
        return this.list
      },
      set(val) {
        this.$emit('update:list', val)
      }
    }
  },
  methods: {
    __add(index) {
      if (index === -1) {
        this.c_list.push({ answerLabel: null, isDefault: false })
      } else {
        this.c_list.splice(index + 1, 0, {
          answerLabel: null,
          isDefault: false
        })
      }
    },
    __next() {
      return true
    },
    __delete(index) {
      var t = this
      var sss = this.$emit('onDeleteDefore', {
        index,
        next(pan) {
          if (pan) t.c_list.splice(index, 1)
        }
      })
    },
    __checkbox(index, item) {
      this.c_list.forEach(element => {
        // this.$set(this.c_list, "isDefault", false);
        element.isDefault = false
      })
      item.isDefault = true
    }
  }
}
</script>

<style lang="less" scoped>
.answer {
  display: flex;
  flex-direction: column;
  border: 1px dashed #969696;
  padding: 10px 0;
  .item2 {
    margin: 8px 40px;
  }
}
</style>
