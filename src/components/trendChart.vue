<template>
  <el-button @click="dialogVisible = true" link type="primary" size="small">
    排名趋势
  </el-button>
  <el-dialog
    v-model="dialogVisible"
    title="排名变化趋势"
    width="500"
    :append-to-body="true"
    @open="renderChart"
  >
    <div
      ref="chartContainer"
      class="chart-container"
      style="height: 400px"
    ></div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
// 定义 props
const props = defineProps<{
  userId: string;
}>();
const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
const dialogVisible = ref(false);

const renderChart = () => {
  if (chartContainer.value) {
    if (!chartInstance) {
      chartInstance = echarts.init(chartContainer.value);
    }
    const option = {
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: ["2024-11-01", "2024-11-05", "2024-11-10", "2024-11-15"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "排名",
          type: "line",
          data: [8, 7, 5, 6],
        },
      ],
    };
    chartInstance.setOption(option);
    // 调整图表大小
    chartInstance.resize();
  }
};

// 监听对话框的打开和关闭状态
watch(dialogVisible, (newVal) => {
  if (newVal) {
    // 当对话框打开时，延迟渲染图表，确保对话框已完全展示
    setTimeout(() => {
      renderChart();
    }, 0);
  } else {
    // 当对话框关闭时，释放图表资源
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
  }
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
