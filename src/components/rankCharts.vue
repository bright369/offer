<!-- src/components/UserDetail.vue -->
<template>
  <div ref="chartContainer" style="height: 600px; width: 100%"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRankStore } from "@/stores/rankStore";
import * as echarts from "echarts";

// Pinia store 获取用户详情
const rankStore = useRankStore();

let chartInstance: echarts.ECharts | null = null;
onMounted(() => {
  renderChart();
});

// 渲染排名变化曲线图
const chartContainer = ref<HTMLDivElement | null>(null);
const renderChart = () => {
  if (chartContainer.value) {
    if (!chartInstance) {
      chartInstance = echarts.init(chartContainer.value);
    }
    const option = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["得分区间分布", "TOP 100 得分线", "用户得分位置"],
        right: "0",
      },
      xAxis: {
        type: "category",
        name: "分数区间",
        data: [
          "0-100",
          "101-200",
          "201-300",
          "301-400",
          "401-500",
          "501-600",
          "601-700",
          "701-800",
          "801-900",
          "901-1000",
        ],
        boundaryGap: false,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
        name: "人数",
      },
      series: [
        {
          name: "得分区间分布",
          type: "bar",
          data: [5, 12, 20, 34, 40, 30, 20, 10, 5, 3],
          itemStyle: {
            opacity: 0.7,
          },
        },
        {
          name: "TOP 100 得分线",
          type: "line",
          data: [null, null, null, 30, 40, 50, 30, 10, 20, 10],
          lineStyle: {
            type: "dashed",
          },
          symbol: "none",
        },
        {
          name: "用户得分位置",
          type: "scatter",
          data: [[5, 30]], // 假设用户得分在第 6 个区间，得分为 550 左右
          symbolSize: 15,
          itemStyle: {
            color: "red",
          },
          label: {
            show: true,
            formatter: "你的分数",
            position: "top",
          },
        },
      ],
    };
    chartInstance.setOption(option);
    // 调整图表大小
    chartInstance.resize();
  }
};
</script>

<style scoped lang="scss">
.user-detail-card {
  padding: 20px;
  margin: 20px;
  position: relative;
  .btns {
    position: absolute;
    right: 20px;
  }
}

.user-basic-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-name {
  margin-left: 10px;
  font-weight: bold;
  font-size: 20px;
}

.user-descriptions {
  margin-bottom: 20px;
}

.badge-item {
  margin-right: 10px;
}

.badge-icon {
  width: 24px;
  height: 24px;
  margin: 0 10px;
}

.rank-history-chart {
  margin-top: 30px;
}

.recent-rank-history,
.score-history {
  margin-top: 20px;
}
</style>
<style>
/* .el-descriptions__cell {
    display: flex;
  } */
</style>
