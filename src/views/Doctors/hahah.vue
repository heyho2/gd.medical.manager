<template>
  <div class="app-container">
    <div>
      <el-button class="filter-item" @click="download">download</el-button>
      <pagination
        :total="total"
        :page.sync="query.pageIndex"
        :limit.sync="query.pageSize"
        :border="false"
        :page-sizes="[50]"
        style="text-align: center;"
        @pagination="handleFilter"
      />
    </div>
    <div id="pdfDom" class="a4">
      <div v-for="(item,index) in list" :key="index" class="ka">
        <div class="top">
          <i />
          <span class="title">{{ item.title }}</span>
        </div>
        <div class="qrcode">
          <div>
            <vue-qr
              :text="item.url"
              :size="200"
              dot-scale="1"
              :margin="0"
              :qid="index"
              :callback="hahah"
            />
          </div>
        </div>
        <span class="name">{{ item.name||'无名前辈' }}</span>
        <span class="bottom">健康相伴 幸福平安</span>
      </div>
    </div>
  </div>
</template>
<script>
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import VueQr from 'vue-qr'
import '@/utils/linq'
import { GetDoctorPageAsync } from '@/api/Doctor'
import Pagination from '@/components/Pagination'
export default {
  components: {
    VueQr,
    Pagination
  },
  data() {
    return {
      query: {
        name: null,
        hospitalGuid: null,
        officeGuid: null,
        beginDate: null,
        endDate: null,
        sortField: null,
        isAscending: true,
        pageIndex: 1,
        pageSize: 50
      },
      list: [],
      total: 0,
      config: {
        value: 'http://www.baidu.com?asdasdasd', // 显示的值、跳转的地址
        logo: 'static/img/Logo1.png' // 中间logo的地址
      },
      htmlTitle: '医生二维码'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleFilter()
    })
  },
  methods: {
    // 加载表格数据
    handleFilter() {
      GetDoctorPageAsync(this.query).then(
        response => {
          // this.list = response.data.currentPage;
          this.list = response.data.currentPage.select(a => {
            return {
              name: a.userName,
              title: a.hospitalName,
              url: `http://m.gd-doctor.com/login/?id=${a.doctorGuid}`,
              qrUrl: ''
            }
          })
          this.total = response.data.total
        },
        err => {}
      )
    },
    download() {
      this.getPdf()
    },
    hahah(url, id) {
      this.list[id].qrUrl = url
    },
    getPdf() {
      var title = `${this.query.pageIndex}-${this.htmlTitle}`
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true
      }).then(function(canvas) {
        const contentWidth = canvas.width
        const contentHeight = canvas.height
        const pageHeight = (contentWidth / 592.28) * 841.89
        let leftHeight = contentHeight
        let position = 0
        const imgWidth = 595.28
        const imgHeight = (592.28 / contentWidth) * contentHeight
        const pageData = canvas.toDataURL('image/jpeg', 1.0)
        const PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.a4 {
  width: 210mm;
  // box-shadow: 0px 0px 20px 0px rgb(192, 192, 192);
  // background-color: #ffffff;
  margin: auto;
  .ka {
    display: inline-block;
    background-image: url(/static/img/pai_baejing.jpg);
    background-size: 100%;
    width: 68mm;
    height: 98mm;
    margin: 26mm 18.5mm;
    position: relative;
    text-align: center;
    .top {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      text-align: center;
      margin-top: 10mm;
      i {
        background-image: url(/static/img/hospital.png);
        background-size: 100%;
        background-repeat: no-repeat;
        width: 10mm;
        height: 9mm;
        display: inline-block;
      }
      .title {
        display: inline-block;
        color: #3466b0;
        font-weight: 600;
        vertical-align: middle;
        font-size: 7mm;
      }
    }
    .qrcode {
      text-align: center;
      margin-top: 5mm;
      div {
        display: inline-block;
        padding: 3mm;
        background-color: #fff;
        img {
          border-style: none;
          width: 40mm;
        }
      }
    }
    .name {
      font-size: 6mm;
      margin-top: 6mm;
      display: block;
      font-weight: 500;
    }
    .bottom {
      position: absolute;
      text-align: center;
      display: block;
      bottom: 6mm;
      width: 100%;
      font-size: 4mm;
      color: #9a1e23;
    }
  }
}
</style>
