<template>
  <div class="app-container">
    <el-tabs tab-position="right" style="height: 500px;">
      <el-tab-pane label="普通筛选">
        <MemberList/>
      </el-tab-pane>
      <el-tab-pane label="购买力筛选">
        <PurchasePower/>
      </el-tab-pane>
      <el-tab-pane label="角色管理">
        <BirthdayReminder/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MemberList from "./MemberList";
import BirthdayReminder from "./BirthdayReminder";
import PurchasePower from "./PurchasePower";

export default {
  components: { MemberList, BirthdayReminder, PurchasePower },
  data() {
    return {};
  }
};
</script>
