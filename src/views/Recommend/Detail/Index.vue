<template>
  <div>
    <Article v-if="ctype=='article'" :recommendGuid="recommendGuid"/>
    <Product v-if="type=='product'" :recommendGuid="recommendGuid"/>
    <Hospital v-if="type=='hostpital'" :recommendGuid="recommendGuid"/>
    <Course v-if="type=='course'" :recommendGuid="recommendGuid"/>
    <Doctor v-if="type=='doctor'" :recommendGuid="recommendGuid"/>
    <Office v-if="type=='office'" :recommendGuid="recommendGuid"/>
  </div>
</template>

<script>
import Article from "@/views/Recommend/Detail/Article";
import Product from "@/views/Recommend/Detail/Product";
import Hospital from "@/views/Recommend/Detail/Hospital";
import Course from "@/views/Recommend/Detail/Course";
import Doctor from "@/views/Recommend/Detail/Doctor";
import Office from "@/views/Recommend/Detail/Office";
export default {
  components: { Article, Product, Hospital, Course, Doctor, Office },
  props: {
    recommendGuid: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },
  watch: {},
  data() {
    return {
      ctype: this.type
    };
  },
  created() {},
  methods: {}
};
</script>


      
  
