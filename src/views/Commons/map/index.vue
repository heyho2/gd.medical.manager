<template>
  <div style="margin-top: 10px; position: relative;">
    <div id="container" class="map"></div>
    <div class="cccc" id="infoDiv"></div>
  </div>
</template>
<script>
import { TMap } from "./tx-map";

export default {
  data() {
    return {
      searchService: null,
      markers: [],
      map: null
    };
  },
  mounted() {
    var t = this;
    TMap("QUHBZ-FXBCX-TGO47-ZXFQX-34IDH-VSB2Y").then(qq => {
      var map = new qq.maps.Map(document.getElementById("container"), {
        // 地图的中心地理坐标。
        center: new qq.maps.LatLng(39.916527, 116.397128),
        zoom: 13
      });
      //获取城市列表接口设置中心点
      var citylocation = new qq.maps.CityService({
        complete: function(result) {
          map.setCenter(result.detail.latLng);
        }
      });
      //调用searchLocalCity();方法    根据用户IP查询城市信息。
      citylocation.searchLocalCity();
      t.map = map;
      //调用Poi检索类
      t.searchService = new qq.maps.SearchService({
        panel: document.getElementById("infoDiv"),
        map: map
      });
      //绑定单击事件添加参数
      qq.maps.event.addListener(map, "click", function(event) {
        console.log(event);
        t.$emit("click", event);
      });
    });
  },
  methods: {
    clearOverlays() {
      var overlay;
      while ((overlay = this.markers.pop())) {
        overlay.setMap(null);
      }
    },
    searchMap(query) {
      var pageIndex = 0;
      var pageCapacity = 10;
      //   this.clearOverlays();
      //   this.map.searchService.setLocation(region);
      this.searchService.setPageIndex(pageIndex); //设置检索的特定页数。
      this.searchService.setPageCapacity(pageCapacity);
      this.searchService.search(query);
    }
  }
};
</script>

<style scoped>
.map {
  height: 600px;
  width: 100%;
  width: -webkit-calc(100% - 300px);
  width: -moz-calc(100% - 300px);
  width: calc(100% - 300px);
}
.cccc {
  width: 290px;
  position: absolute;
  top: 0;
  right: 0;
  height: 600px;
  overflow: auto;
}
</style>

