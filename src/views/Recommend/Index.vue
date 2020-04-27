<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-select v-model="query.type" clearable placeholder="请选择推荐类型">
          <el-option v-for="item in types" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="listLoading"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          class="filter-item"
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >添加推荐</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" :border="false" fit highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <Detail :recommend-guid="scope.row.recommendGuid" :type="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="序列" width="65" type="index" />
      <el-table-column label="图标" align="center" width="60">
        <template slot-scope="scope">
          <div class="avatar">
            <img
              v-if="scope.row.pictureUrl"
              :src="scope.row.pictureUrl"
              preview="4"
              :alt="scope.row.name"
              :title="scope.row.name"
            >
            <img
              v-else
              src="@/assets/DEFORTDoctor.jpg"
              :alt="scope.row.name"
              :title="scope.row.name"
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="110">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.type=='campaign'"
            color="rgb(242, 168, 255)"
            style="color: #333;"
          >{{ getTypeName(scope.row.type) }}</el-tag>
          <el-tag
            v-else-if="scope.row.type=='article'"
            color="rgb(147, 241, 150)"
          >{{ getTypeName(scope.row.type) }}</el-tag>
          <el-tag
            v-else-if="scope.row.type=='product'"
            color="rgb(237, 245, 112)"
          >{{ getTypeName(scope.row.type) }}</el-tag>
          <el-tag
            v-else-if="scope.row.type=='doctor'"
            color="#rgb(178, 244, 251)"
          >{{ getTypeName(scope.row.type) }}</el-tag>
          <el-tag
            v-else-if="scope.row.type=='office'"
            color="#f56c6c"
            style="color: #fff;"
          >{{ getTypeName(scope.row.type) }}</el-tag>
          <el-tag
            v-else-if="scope.row.type=='hostpital'"
            color="#fff"
          >{{ getTypeName(scope.row.type) }}</el-tag>
          <el-tag
            v-else-if="scope.row.type=='course'"
            color="#909399"
            style="color: #fff;"
          >{{ getTypeName(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="left" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="响应目标" align="left" min-width="110">
        <template slot-scope="scope">
          <span class="assss">{{ scope.row.target||"无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效" width="110" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="显示顺序" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">{{ toDateString(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type!=`campaign`"
            type
            :disabled="!$checkPermission('handle_recommend')"
            size="mini"
            @click="handleShow(scope.row)"
          >{{ `选择${getTypeName(scope.row.type) }` }}</el-button>

          <el-button
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            :disabled="!$checkPermission('handle_delete')"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :border="false"
      @pagination="handleFilter"
    />

    <el-dialog
      :title="form.dialogEditTitle"
      :visible.sync="form.dialogEditVisible"
      :close-on-click-modal="false"
      top="20px"
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="right"
        label-width="100px"
        label-suffix="："
      >
        <el-form-item label="图标" prop="pictureGuid">
          <upload-img2
            :dialog-visible="true"
            :value.sync="form.info.pictureGuid"
            :url.sync="form.info.pictureUrl"
            :img-width="150"
            :auto-crop-width="100"
            :auto-crop-height="100"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.info.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.info.type" clearable placeholder="请选择推荐类型">
            <el-option v-for="item in types" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.info.type=='Campaign'.toLowerCase()" label="响应目标" prop="target">
          <el-input v-model="form.info.target" placeholder="响应目标只有推荐类型为【活动】才需要添加" />
        </el-form-item>
        <el-form-item label="是否有效" prop="enable">
          <el-switch v-model="form.info.enable" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="form.info.sort" :min="1" :max="100" placeholder="显示顺序" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.info.remark" type="textarea" placeholder="简单描述一下推荐内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="form.dialogEditVisible = false">关闭</el-button>
        <el-button type="primary" icon="iconfont icon-save" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
    <AddDetailButton
      :type="detail.type"
      :recommend-guid="detail.recommendGuid"
      :value.sync="detail.values"
      :dialog-visible.sync="detail.dialogVisible"
    />
  </div>
</template>

<script>
import {
  GetRecommendPageAsync,
  GetRecommendTypes,
  AddRecommendAsync,
  DeleteRecommendAsync,
  UpdateRecommendAsync,
  DisableEnableRecommendAsync
} from '@/api/Recommend'
import AddDetailButton from '@/views/Recommend/AddDetailButton'
import Detail from '@/views/Recommend/Detail/Index'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import UploadImg2 from '@/components/UploadImg2/Index'

export default {
  components: { Pagination, AddDetailButton, Detail, UploadImg2 },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 20,
        type: null,
        sortField: null,
        isAscending: true
      },
      dlist: [],
      total: 0,
      list: [],
      types: [
        {
          code: 'Campaign'.toLowerCase(),
          name: '活动'
        },
        {
          code: 'Article'.toLowerCase(),
          name: '文章'
        },
        // {
        //   code: "Product".toLowerCase(),
        //   name: "商品"
        // },
        {
          code: 'Doctor'.toLowerCase(),
          name: '医生'
        },
        // {
        //   code: "Office".toLowerCase(),
        //   name: "科室"
        // },
        {
          code: 'Hostpital'.toLowerCase(),
          name: '医院'
        }
        // {
        //   code: "Course".toLowerCase(),
        //   name: "课程"
        // }
      ],
      listLoading: false,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          recommendGuid: null,
          name: null,
          target: null,
          pictureGuid: null,
          pictureUrl: null,
          sort: 0,
          type: null,
          remark: null,
          enable: true
        },
        // 表单验证
        rules: {
          name: [{ required: true, message: '必填', trigger: 'change' }],
          type: [{ required: true, message: '必填', trigger: 'change' }],
          remark: [{ max: 100, message: '不能超过100', trigger: 'change' }],
          pictureGuid: [
            { required: true, message: '请上传图片', trigger: 'change' }
          ]
        }
      },
      detail: {
        dialogVisible: false,
        type: null,
        values: []
      }
    }
  },
  watch: {},
  created() {
    this.handleFilter()
  },
  methods: {
    handleFilter() {
      this.listLoading = true
      GetRecommendPageAsync(this.query).then(
        response => {
          this.list = response.data.currentPage
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        },
        error => {
          this.listLoading = false
        }
      )
    },
    // 添加
    handleAdd() {
      this.form.info = {
        recommendGuid: null,
        sort: 1,
        type: 'campaign',
        enable: true
      }
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加推荐'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      this.form.info = Object.assign({}, row) // copy obj
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'update'
      this.form.dialogEditTitle = '修改推荐'
    },
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    handleSave() {
      const t = this
      const tempData = Object.assign({}, t.form.info)
      t.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (t.form.dialogEditStatus == 'add') {
            AddRecommendAsync(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.query.type = tempData.ownerGuid
              t.handleFilter()
            })
          } else {
            UpdateRecommendAsync(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.query.type = tempData.ownerGuid
              t.handleFilter()
            })
          }
        }
      })
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableRecommendAsync({
        guid: row.recommendGuid,
        enable: row.enable
      }).then(response => {
        if (response.code === 0) {
          t.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 删除
    handleDelete(row) {
      var t = this
      t.$confirm('此操作将永久删除该数据, 是否继续?', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteRecommendAsync({
            RecommendGuid: row.recommendGuid
          }).then(response => {
            if (response.code === 0) {
              t.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              t.handleFilter()
            }
          })
        })
        .catch(() => {
          t.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    toDateString(a) {
      return parseTime(new Date(a))
    },
    getTypeName(code) {
      var name
      this.types.forEach(item => {
        if (code.toLowerCase() == item.code.toLowerCase()) name = item.name
      })
      return name
    },
    handleShow(row) {
      this.detail.type = row.type
      this.detail.recommendGuid = row.recommendGuid
      this.detail.dialogVisible = true
    }
  }
}
</script>
<style >
.assss {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.avatar {
  display: flex;
  width: 40px;
  height: 40px;
  background-color: #57d3b9;
  border-radius: 50%;
  overflow: hidden;
  justify-content: center;
}
.avatar img {
  object-fit: cover;
  vertical-align: top;
  width: 100%;
  cursor: pointer;
}
</style>

