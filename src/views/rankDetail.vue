
<template>
  <el-card class="user-detail-card" shadow="hover">
    <div class="btns">
      <el-button
        v-loading.fullscreen.lock="fullscreenLoading"
        type="primary"
        @click="update"
        >更新</el-button
      >
      <el-button @click="goToPage('compete')">竞争分析</el-button>
      <el-button @click="goToPage('/')">返回</el-button>
    </div>
    <div class="user-basic-info">
      <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
      <div class="user-name">{{ userRankDetail?.nickname }}</div>
    </div>
    <el-descriptions
      title="用户信息"
      :column="2"
      border
      class="user-descriptions"
    >
      <el-descriptions-item label="当前排名">
        {{ userRankDetail?.currentRank || "暂无数据" }}
      </el-descriptions-item>
      <el-descriptions-item label="历史最佳排名">
        {{ userRankDetail?.bestRank || "暂无数据" }}
      </el-descriptions-item>
      <el-descriptions-item label="参与时长">
        {{ participationTime }} 小时
      </el-descriptions-item>
      <el-descriptions-item label="成就徽章" style="display: flex">
        <el-tooltip
          :content="badge.name"
          v-for="badge in userRankDetail?.achievements"
          :key="badge.id"
          :value="badge.name"
        >
          <img
            src="@/assets/imgs/listAvatar.png"
            alt="徽章图标"
            class="badge-icon"
          />
        </el-tooltip>
      </el-descriptions-item>
    </el-descriptions>

    <div class="rank-history-chart">
      <h3>排名变化曲线</h3>
      <rankCharts />
    </div>
    <el-card class="score-history" shadow="never">
      <h3>得分历史统计</h3>
      <el-table :data="scoreHistory" style="width: 100%">
        <el-table-column prop="time" label="时间" />
        <el-table-column prop="score" label="得分" />
      </el-table>
    </el-card>
    <el-card class="score-history" shadow="never">
      <h3>历史每天的游戏时长</h3>
      <el-table :data="dailyGameDurations" style="width: 100%">
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="formattedDuration" label="游戏时长" />
      </el-table>
    </el-card>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRankStore } from "@/stores/rankStore";
import * as echarts from "echarts";
import rankCharts from "@/components/rankCharts.vue";
import { useRouter } from "vue-router";
const router = useRouter();
// Pinia store 获取用户详情
const rankStore = useRankStore();
const userId = rankStore.currentUser.id;
const type: "daily" | "weekly" | "monthly" = "daily";
let chartInstance: echarts.ECharts | null = null;
onMounted(() => {
  rankStore.fetchUserRankDetail(userId, type);
  //   rankStore.$subscribe(() => {
  renderChart();
  //   });
});
const fullscreenLoading = ref(false);
// 获取用户详情
const userRankDetail = computed(() => {
  return rankStore.userRankDetail;
});

// 计算用户参与时间（假设我们有参与时间数据，以小时为单位）
const participationTime = computed(() => {
  // 示例数据：假设每个时间段有一个参与时长字段
  if (userRankDetail.value?.rankHistory) {
    return userRankDetail.value.rankHistory.length * 2; // 假设每次统计参与时间为 2 小时
  }
  return 0;
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
          data: [null, null, null, null, null, 50, 50, 50, 50, 50],
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

// 示例得分历史数据
const scoreHistory = computed(() => {
  if (userRankDetail.value?.rankHistory) {
    return userRankDetail.value.rankHistory.map((item) => ({
      time: item.time,
      score: item.score,
    }));
  }
  return [];
});
// 获取参与日志并格式化
const dailyGameDurations = computed(() => {
  if (userRankDetail.value?.dailyGameDurations) {
    return userRankDetail.value.dailyGameDurations.map((log) => ({
      date: log.date,
      formattedDuration: formatDuration(log.duration),
    }));
  }
});

// 格式化时长，将秒转换为小时和分钟
const formatDuration = (durationInSeconds: number): string => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  return `${hours > 0 ? `${hours} 小时` : ""} ${minutes} 分钟`;
};

const update = () => {
  fullscreenLoading.value = true;
  setTimeout(() => {
    fullscreenLoading.value = false;
  }, 1000);
};
const goToPage = (path: string) => {
  router.push({ path: path });
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
