<template>
  <el-container>
    <el-aside width="200px">
      <aside-navigator />
    </el-aside>
    <el-container>
      <el-header>
        <header-navigator />
      </el-header>
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AsideNavigator from "@/components/AsideNavigator.vue";
import HeaderNavigator from "@/components/HeaderNavigator.vue";

export default {
  name: "TaskLayout",
  components: {
    AsideNavigator,
    HeaderNavigator
  }
};
</script>

<style scoped>
.el-container {
  min-height: 100%;
}

.el-header {
  background-color: #c4c4c4;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: #e8ebf0;
  width: 100%;
  margin: auto;
  padding: 0;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 60px;
}
</style>
