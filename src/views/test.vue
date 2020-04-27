<template>
  <div class="app-container">
    <el-button type="small" icon="el-icon-tickets" title="测试文章选择" @click="dialogVisible=true">文章选择</el-button>
    <Article
      :dialogVisible.sync="dialogVisible"
      :dialogTitle="'请选择文章'"
      :value="value"
      :select="select"
    />
    <br>
    <upload-img2
      :value.sync="hahah"
      :url.sync="url"
      :imgWidth="300"
      :autoCropWidth="725"
      :autoCropHeight="320"
    />
    <br>
    <upload-img2-more
      :values.sync="values"
      :imgHeight="150"
      :autoCropWidth="725"
      :autoCropHeight="320"
    />
    <labels-edit :list="labers"/>
    <br>
    {{labers}}
    <br>
    <br>-----------------解决数组改变后，试图不更新问题（暴力）-----------------
    <br>
    {{arr}}
    <a @click="maopao" href="javascript:;">排序</a>
    <br>-----------------新上传-----------------
    <upload-imgv3-button :autoCropWidth="725" :autoCropHeight="320" :afterSuccess="afterSuccess1"/>
    <upload-imgv3
      :value.sync="hahah"
      :url.sync="url"
      :imgWidth="300"
      :autoCropWidth="725"
      :autoCropHeight="320"
    />
  </div>
</template>

<script>
import Article from "@/views/Recommend/Article";
import UploadImg2 from "@/components/UploadImg2/Index";
import UploadImg2More from "@/components/UploadImg2/More";
import LabelsEdit from "@/views/Commons/LabelsEdit";
import UploadImgv3Button from "@/components/UploadImg2/Button";
import UploadImgv3 from "@/components/UploadImg2/Index";
export default {
  components: {
    Article,
    UploadImg2,
    UploadImg2More,
    LabelsEdit,
    UploadImgv3Button,
    UploadImgv3,
  },
  data() {
    return {
      dialogVisible: false,
      value: ["b4592aa42c6e4c81a19aa594a783f24f"],
      hahah: "",
      values: [
        {
          url:
            "http://n.ghysjt.com/images/2019/01/14/14/2e7f3b73ae560c5782bf1669ccee1196.jpg",
          value: "1111111"
        },
        {
          url:
            "http://n.ghysjt.com/images/2019/01/14/14/2e7f3b73ae560c5782bf1669ccee1196.jpg",
          value: "22222222222"
        }
      ],
      url:
        "http://n.ghysjt.com/images/2019/01/14/14/2e7f3b73ae560c5782bf1669ccee1196.jpg",
      labers: ["你好", "我爱你", "你跑不了了"],
      arr: [23, 44, 66, 76, 98, 11, 3, 9, 7]
    };
  },
  watch: {
    hahah(val) {
      alert(val + this.url);
    }
  },
  methods: {
    select(row) {},
    maopao() {
      let temp = 0;
      for (let i = 0; i < this.arr.length - 1; i++) {
        for (let j = 0; j < this.arr.length - 1 - i; j++) {
          if (this.arr[j] > this.arr[j + 1]) {
            temp = this.arr[j + 1];
            this.arr[j + 1] = this.arr[j];
            this.arr[j] = temp;
          }
        }
      }
      this.arr = Object.assign([], this.arr);
    },
    afterSuccess1(url, value) {
    }
  }
};
</script>



