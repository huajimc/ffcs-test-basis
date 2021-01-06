<template>
  <!-- 侧边栏 -->
  <el-menu
    default-active="this.$route.path"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#9ddfd3"
    router
  >
    <el-menu-item index="/">
      <span slot="title">准备篇</span>
    </el-menu-item>
    <el-menu-item index="/TopicOne">
      <span slot="title">课题一</span>
    </el-menu-item>
    <el-menu-item index="/TopicTwo">
      <span slot="title">课题二</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "AsideNavigator"
};
</script>

<style lang="scss" scoped>
.el-menu {
  height: 100%;
  overflow: hidden;
  text-align: left;
}
</style>
