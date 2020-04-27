<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input v-model="query.Keyword" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.articleType" clearable placeholder="文章类型" prop="password">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.releaseStatus" clearable placeholder="发布状态" prop="password">
          <el-option
            v-for="item in releaseStatusList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          class="filter-item"
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >添加健康管理</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      :border="false"
      fit
      highlight-current-row
      :row-class-name="tableRowClassName"
      @sort-change="handleOrderBy"
    >
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="文章标题" align="left">
        <template slot-scope="scope">
          <span class="assss">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章类型" width="150" align="center">
        <template slot-scope="scope">
          {{
            (typeList.first(a=>a.value==scope.row.articleTypeDic)||{}).name
          }}
        </template>
      </el-table-column>
      <el-table-column label="发布状态" width="90" align="center">
        <template slot-scope="scope">
          {{
            (releaseStatusList.first(a=>a.code==scope.row.actcleReleaseStatus)||{}).name
          }}
        </template>
      </el-table-column>
      <el-table-column label="浏览量" width="110" align="right" :sortable="'custom'" prop="like_count">
        <template slot-scope="scope">{{ scope.row.visitCount }}</template>
      </el-table-column>
      <el-table-column label="收藏量" width="110" align="right" :sortable="'custom'" prop="collection">
        <template slot-scope="scope">{{ scope.row.collection }}</template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="180"
        align="center"
        :sortable="'custom'"
        prop="creation_Date"
      >
        <template slot-scope="scope">{{ toDateString(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="是否禁用?" width="110" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
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
      width="75%"
      top="20px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="right"
        label-width="100px"
        style="width:95%;min-width:600px"
        label-suffix="："
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.info.title" placeholder="文章标题" />
        </el-form-item>
        <el-form-item label="简介" prop="abstract">
          <el-input v-model="form.info.abstract" type="textarea" placeholder="简介" />
        </el-form-item>
        <el-form-item label="文章类型" prop="articleTypeDic">
          <el-select
            v-model="form.info.articleTypeDic"
            placeholder="文章类型"
            style="width:100%"
            prop="password"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态" prop="actcleReleaseStatus">
          <el-select
            v-model="form.info.actcleReleaseStatus"
            style="width:100%"
            placeholder="发布状态"
            prop="password"
          >
            <el-option
              v-for="item in releaseStatusList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="外部链接" prop="externalLink">
          <el-input v-model="form.info.externalLink" placeholder="外部链接" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.info.enable" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="文章图片" prop="pictureGuid">
          <upload-img2
            :dialog-visible="true"
            :value.sync="form.info.pictureGuid"
            :url.sync="form.info.pictureUrl"
            :img-width="200"
            :auto-crop-width="200"
            :auto-crop-height="200"
          />
        </el-form-item>
        <el-form-item label="关键字" prop="keyword">
          <labels-edit :list="form.info.keyword" />
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <tinymce :height="300" :value.sync="form.info.content" :menubar="false" />
          <!-- <Editor v-model="form.info.content"/> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="form.dialogEditVisible = false">关闭</el-button>
        <el-button type="primary" icon="iconfont icon-save" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetArticleListAsync,
  AddArticleAsync,
  UpdateArticleAsync,
  GetArticleInfoAsync,
  DisableEnableArticleAsync,
  DeleteArticleAsync,
  GetArticleTypeAsync
} from '@/api/Article'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import { parseTime } from '@/utils/index'
import '@/utils/linq'
import UploadImg2 from '@/components/UploadImg2/Index'
import LabelsEdit from '@/views/Commons/LabelsEdit'
const _sourceType = 2
export default {
  components: { Pagination, Tinymce, UploadImg2, LabelsEdit },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 20,
        Keyword: null,
        SortField: null,
        IsAscending: true,
        sourceType: _sourceType, // 后台文章
        articleType: null,
        releaseStatus: null
      },
      total: 0,
      list: [],
      typeList: [],
      releaseStatusList: [
        { code: 1, name: '发布' },
        { code: 2, name: '未发布' }
        // { code: 3, name: "驳回" },
        // { code: 4, name: "审核通过" }
      ],
      listLoading: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          articleGuid: null,
          title: null,
          abstract: null,
          articleTypeDic: null,
          visible: true,
          content: '',
          enable: null,
          pictureGuid: null,
          pictureUrl: null,
          sourceType: _sourceType, // 后台文章
          actcleReleaseStatus: null,
          keyword: [],
          externalLink: null
        },
        // 表单验证
        rules: {
          title: [
            { required: true, message: '文章标题必填', trigger: 'change' },
            { max: 30, message: '长度不能超过30', trigger: 'change' }
          ],
          abstract: [
            { required: true, message: '简介必填', trigger: 'change' },
            { max: 160, message: '长度不能超过160', trigger: 'change' }
          ],
          articleTypeDic: [
            { required: true, message: '文章类型必填', trigger: 'change' }
          ],
          content: [
            { required: true, message: '文章内容必填', trigger: 'change' }
          ],
          keyword: [{ required: true, message: '必填', trigger: 'change' }],
          pictureGuid: [{ required: true, message: '必须上传图片' }],
          actcleReleaseStatus: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          externalLink: [
            { max: 200, message: '长度不能超过200', trigger: 'change' }
          ]
        }
      }
    }
  },
  watch: {},
  created() {
    GetArticleTypeAsync().then(response => {
      this.typeList = response.data
      this.handleFilter()
    })
  },
  methods: {
    getInfo(ArticleGuid) {
      var t = this
      return GetArticleInfoAsync({ ArticleGuid }).then(response => {
        var d = response.data
        t.form.info = Object.assign({}, response.data)
        t.form.info.content = d.content
      })
    },
    handleOrderBy(a) {
      this.query.SortField = a.prop
      this.query.IsAscending = a.order == 'ascending'
      this.handleFilter()
    },
    // 加载表格数据
    handleFilter() {
      this.listLoading = true
      GetArticleListAsync(this.query).then(
        response => {
          this.list = response.data.currentPage
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        },
        err => {
          this.listLoading = false
        }
      )
    },
    // 添加
    handleAdd() {
      this.form.info = {
        content: '',
        visible: true,
        enable: true,
        pictureUrl: null,
        pictureGuid: null,
        sourceType: _sourceType, // 后台文章,
        keyword: []
      }
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加文章'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      var t = this
      t.getInfo(row.articleGuid).then(response => {
        t.form.dialogEditVisible = true
        t.form.dialogEditStatus = 'update'
        t.form.dialogEditTitle = '修改文章'
      })
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    handleSave() {
      var t = this
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (t.form.dialogEditStatus == 'add') {
            AddArticleAsync(t.form.info).then(response => {
              t.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()
            })
          } else {
            UpdateArticleAsync(t.form.info).then(response => {
              t.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()
            })
          }
        }
      })
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableArticleAsync({
        Guid: row.articleGuid,
        enable: row.enable
      }).then(response => {
        t.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        t.handleFilter()
      })
    },
    // 删除
    handleDelete(row) {
      var t = this
      t.$confirm('此操作将永久删除该数据, 是否继续?', '确认删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteArticleAsync({ Guid: row.articleGuid }).then(response => {
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
    },
    toDateString(a, f) {
      return parseTime(new Date(a), f)
    },
    tableRowClassName({ row, rowIndex }) {
      if (!row.enable) {
        return 'disable-row'
      }
      return ''
    }
  }
}
</script>
<style>
.image {
  display: block;
  cursor: pointer;
}
.assss {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>

