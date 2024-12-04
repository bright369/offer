<!--
 * @git config user.name: wangxin
 * @LastEditors: wangxin
-->
<!-- src/components/RankTrend.vue -->
<template>
  <el-button @click="dialogVisible = true" link type="primary"
    >排名趋势</el-button
  >
  <el-dialog
    v-model="dialogVisible"
    title="排名变化趋势"
    width="500"
    :append-to-body="true"
  >
    <div ref="chartContainer" style="height: 400px"></div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRankStore } from "@/stores/rankStore";
import * as echarts from "echarts";

const chartContainer = ref<HTMLDivElement | null>(null);
const rankStore = useRankStore();
const userId = rankStore.currentUser.id;
const type: "daily" | "weekly" | "monthly" = "daily"; // 排行榜类型
const dialogVisible = ref(false);
const props = defineProps({
  userId: {
    default: "",
    type: String,
  },
});
onMounted(() => {
  rankStore.fetchUserRankDetail(userId, type);
  rankStore.$subscribe(() => {
    renderChart();
  });
});

// 获取用户排名历史
const rankHistory = computed(() => {
  return rankStore.userRankDetail?.rankHistory || [];
});

// 渲染排名变化趋势图
const renderChart = (): void => {
  const history = rankHistory.value;
  if (!history.length || !chartContainer.value) return;

  const chart = echarts.init(chartContainer.value);

  const option = {
    title: {
      text: "排名变化趋势",
    },
    xAxis: {
      type: "category",
      data: history.map((item) => item.time), // 横轴为时间
    },
    yAxis: {
      type: "value",
      name: "排名",
      inverse: true, // 排名越小越好，y轴需要反向显示
    },
    series: [
      {
        data: history.map((item) => item.rank), // 用排名数据来绘制折线图
        type: "line",
        smooth: true,
        markLine: {
          data: [{ type: "average", name: "平均排名" }],
        },
      },
    ],
  };

  chart.setOption(option);
};
</script>

<style scoped>
/* 样式 */
</style>
