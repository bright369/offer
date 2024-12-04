<!--
 * @git config user.name: wangxin
 * @LastEditors: wangxin
-->
<script setup lang="ts">
import { RouterView } from "vue-router";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import homeHeader from "@/components/homeHeader.vue";
const locale = computed(() => {
  return zhCn;
});
</script>

<template>
  <homeHeader></homeHeader>
  <el-config-provider :locale="locale"> <RouterView /></el-config-provider>
</template>

<style scoped></style>
