<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-select v-model="query.type" placeholder="请选择位置" @change="handleSearch">
          <el-option
            v-for="item in typeList"
            :key="item.guid"
            :label="item.name"
            :value="item.guid"
          />
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
        <el-button v-permission="'handle_add'" icon="el-icon-circle-plus" @click="handleAdd">添加广告</el-button>
      </el-form-item>
    </el-form>
    <el-table
      element-loading-text="Loading"
      :data="list"
      :border="false"
      fit
      highlight-current-row
      @sort-change="handleOrderBy"
    >
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column label="图片" width="250" align="center">
        <template slot-scope="scope">
          <gd-img
            :src="scope.row.picture"
            :alt="scope.row.bannerName"
            :title="scope.row.bannerName"
            preview="1"
            style1="width:100%"
          />
        </template>
      </el-table-column>
      <el-table-column label="名字" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bannerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ (typeList.first(a=>a.guid==scope.row.ownerGuid)||{}).name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" align="left" min-width="250">
        <template slot-scope="scope">{{ scope.row.targetUrl }}</template>
      </el-table-column>
      <el-table-column label="排序" width="110" align="center" :sortable="'custom'" prop="sort">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="160"
        align="center"
        :sortable="'custom'"
        prop="creation_Date"
      >
        <template slot-scope="scope">{{ toDateString(scope.row.creationDate) }}</template>
      </el-table-column>

      <el-table-column label="是否显示?" width="110" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <!-- <el-button @click="handleDelete(scope.row)" type="text" size="small">查看</el-button> -->
          <el-button
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
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
      width="90%"
      top="20px"
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="right"
        label-width="100px"
        label-suffix="："
        width="90%"
      >
        <el-form-item label="图片" prop="pictureGuid">
          <upload-img2
            :value.sync="form.info.pictureGuid"
            :url.sync="form.info.picture"
            :img-width="300"
            :auto-crop-width="750"
            :auto-crop-height="300"
          />
        </el-form-item>
        <el-form-item label="位置" prop="ownerGuid">
          <el-select v-model="form.info.ownerGuid" placeholder="请选择位置">
            <el-option
              v-for="item in typeList"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="名字" prop="bannerName">
          <el-input v-model="form.info.bannerName" placeholder="名字" />
        </el-form-item>
        <el-form-item label="跳转链接" prop="targetUrl">
          <el-input v-model="form.info.targetUrl" placeholder="跳转链接" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="form.info.sort" :min="1" :max="1000" label="显示顺序" />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch v-model="form.info.enable" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>

        <el-form-item label="备注" prop="description">
          <el-input v-model="form.info.description" type="textarea" placeholder="备注" />
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
  GetBannerPageAsync,
  GetBannerType1,
  AddBannerAsync,
  UpdateBannerAsync,
  DisableEnableBannerAsync
} from '@/api/Banner'
import { parseTime } from '@/utils/index'
import '@/utils/linq'
import Pagination from '@/components/Pagination'
import GdImg from '@/views/Commons/GdImg'
import UploadImg2 from '@/components/UploadImg2/Index'
export default {
  components: { Pagination, UploadImg2, GdImg },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 5,
        type: null,
        SortField: 'sort',
        IsAscending: false
      },
      typeList: [],
      total: 0,
      list: [],
      listLoading: false,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加Banner',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          ownerGuid: null,
          description: null,
          bannerName: null,
          pictureGuid: null,
          targetUrl: null,
          sort: 0,
          enable: true,
          picture: null
        },
        // 表单验证
        rules: {
          ownerGuid: [{ required: true, message: '必填', trigger: 'change' }],
          bannerName: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 10, message: '长度不能超过10', trigger: 'change' }
          ],
          pictureGuid: [{ required: true, message: '必填', trigger: 'change' }],
          targetUrl: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 500, message: '长度不能超过500', trigger: 'change' }
          ],
          description: [
            { max: 100, message: '长度不能超过100', trigger: 'change' }
          ]
        }
      }
    }
  },
  watch: {},
  created() {
    this.GetBannerType().then(a => {
      this.handleFilter()
    })
  },
  methods: {
    GetBannerType() {
      var t = this
      return GetBannerType1({}).then(response => {
        t.typeList = response.data
      })
    },
    // 加载表格数据
    handleFilter() {
      this.listLoading = true
      GetBannerPageAsync(this.query).then(
        response => {
          this.list = response.data.currentPage
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        },
        error => {
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        }
      )
    },
    // 添加
    handleAdd() {
      this.form.info = { enable: true, sort: 1, ownerGuid: this.query.type }
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加Banner'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      this.form.info = Object.assign({}, row) // copy obj
      console.log(this.form.info)

      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'update'
      this.form.dialogEditTitle = '修改Banner'
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    handleSave() {
      const t = this
      const tempData = Object.assign({}, this.form.info)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (t.form.dialogEditStatus == 'add') {
            AddBannerAsync(tempData).then(response => {
              if (response.code === 0) {
                t.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success',
                  duration: 2000
                })
                t.form.dialogEditVisible = false
                t.query.type = tempData.ownerGuid
                t.handleFilter()
              }
            })
          } else {
            UpdateBannerAsync(tempData).then(response => {
              if (response.code === 0) {
                t.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                t.form.dialogEditVisible = false
                t.query.type = tempData.ownerGuid
                t.handleFilter()
              }
            })
          }
        }
      })
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableBannerAsync({
        guid: row.bannerGuid,
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
    // 查看
    handleDelete(row) {
      alert('删除')
    },
    toDateString(a) {
      return parseTime(new Date(a))
    },
    handleOrderBy(a) {
      this.query.SortField = a.prop
      this.query.IsAscending = a.order == 'ascending'
      this.handleFilter()
    }
  }
}
</script>
<style>
</style>

