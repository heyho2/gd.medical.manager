<template>
  <div class>
    <el-table ref="multipleTable" :data="list">
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="按钮编码" align="center">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.showEdit"
            v-model="scope.row.buttonCode"
            size="mini"
            style="width:'80%'"
            clearable
            placeholder="按钮编码"
          />
          <span v-else>{{ scope.row.buttonCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="按钮名称">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.showEdit"
            v-model="scope.row.buttonName"
            size="mini"
            clearable
            placeholder="按钮名称"
          />
          <span v-else>{{ scope.row.buttonName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.showEdit">
            <el-button size="mini" @click="handleSave(scope.row)">保存</el-button>
            <el-button type="warning" size="mini" @click="handleCancel(scope.row)">取消</el-button>
          </div>
          <div v-else>
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- <ul class="list head">
      <li class="item" style="width: 60px">序列</li>
      <li class="item">按钮编码</li>
      <li class="item">按钮名称</li>
      <li class="item">操作</li>
    </ul>
    <ul class="list body" v-for="(item,i) in list" :key="i">
      <li class="item" style="width: 60px">{{i+1}}</li>
      <li class="item">
        <el-input v-if="item.showEdit" v-model="item.buttonCode" placeholder="按钮编码"></el-input>
        <span v-else>{{item.buttonCode}}</span>
      </li>
      <li class="item">
        <el-input v-if="item.showEdit" v-model="item.buttonName" placeholder="按钮名称"></el-input>
        <span v-else>{{item.buttonName}}</span>
      </li>
      <li class="item" v-if="item.showEdit">
        <el-button @click="handleSave(item)" size="mini">保存</el-button>
        <el-button @click="handleCancel(item)" size="mini">取消</el-button>
      </li>
      <li class="item" v-else>
        <el-button @click="handleEdit(item)" size="mini">编辑</el-button>
        <el-button @click="handleDelete(item)" type="danger" size="mini">删除</el-button>
      </li>
    </ul>-->
    <!-- <ul class="list body" v-if="form.info.showEdit">
      <li class="item" style="width: 60px">0</li>
      <li class="item">
        <el-input v-model="form.info.buttonCode" placeholder="按钮编码"></el-input>
      </li>
      <li class="item">
        <el-input v-model="form.info.buttonName" placeholder="按钮名称"></el-input>
      </li>
      <li class="item">
        <el-button @click="handleSave(form.info)" size="mini">保存</el-button>
        <el-button @click="handleCancel(form.info)" size="mini">取消</el-button>
      </li>
    </ul>-->
    <div class="buttons">
      <el-button size="mini" icon="el-icon-circle-plus" @click="handleAdd()">添加按钮</el-button>
    </div>
  </div>
</template>

<script>
import {
  GetButtonListAsync,
  AddButtonAsync,
  UpdateButtonAsync,
  DeleteButtonAsync
} from '@/api/Button'
import { parseTime } from '@/utils/index'
export default {
  components: {},
  props: {
    menuGuid: {
      type: String
    }
  },
  data() {
    return {
      listLoading: false,
      list: []
    }
  },
  watch: {
    menuGuid(val) {
      this.handleFilter()
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    handleFilter() {
      var t = this
      GetButtonListAsync(t.menuGuid).then(response => {
        t.list = response.data
      })
    },
    // 添加
    handleAdd() {
      var list = this.list || []
      list.push({
        showEdit: true,
        editStatus: 'add',
        buttonGuid: null,
        menuGuid: this.menuGuid,
        sort: 1,
        enable: true,
        buttonName: null,
        buttonCode: null
      })
    },
    // 修改
    handleEdit(row) {
      this.$set(row, 'showEdit', true)
      this.$set(row, 'editStatus', 'update')
    },
    handleSearch() {
      this.handleFilter()
    },
    _save(info) {
      var t = this
      const temp = {
        buttonGuid: info.buttonGuid,
        menuGuid: this.menuGuid,
        sort: 1,
        enable: true,
        buttonName: info.buttonName,
        buttonCode: info.buttonCode
      }
      if (info.editStatus == 'add') {
        return AddButtonAsync(temp).then(response => {
          return new Promise(resolve => {
            resolve('添加成功')
          })
        })
      } else {
        return UpdateButtonAsync(temp).then(response => {
          return new Promise(resolve => {
            resolve('修改成功')
          })
        })
      }
    },
    handleSave(info) {
      this._save(info).then(msg => {
        this.$notify({
          title: '成功',
          message: msg,
          type: 'success',
          duration: 2000
        })
        this.$set(info, 'showEdit', false)
        this.handleFilter()
      })
    },
    handleCancel(info) {
      if (info.editStatus == 'add') {
        var index = this.list.indexOf(info)
        if (index > -1) {
          this.list.splice(index, 1)
        }
      } else this.$set(info, 'showEdit', false)
    }, // 删除
    handleDelete(row) {
      var t = this
      t.$confirm('此操作将永久删除该数据, 是否继续?', '确认删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteButtonAsync({
            guid: row.buttonGuid
          }).then(response => {
            t.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            t.handleFilter()
          })
        })
        .catch(() => {
          t.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
.buttons {
  text-align: center;
  padding-top: 18px;
}
</style>

