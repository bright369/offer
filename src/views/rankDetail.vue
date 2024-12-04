<!-- src/components/UserDetail.vue -->
<template>
    <el-card class="user-detail-card" shadow="hover">
      <div class="user-basic-info">
        <el-avatar :src="userRankDetail?.avatar" size="large" />
        <div class="user-name">{{ userRankDetail?.nickname }}</div>
      </div>
  
      <el-descriptions title="用户信息" :column="2" class="user-descriptions">
        <el-descriptions-item label="当前排名">
          {{ userRankDetail?.currentRank || '暂无数据' }}
        </el-descriptions-item>
        <el-descriptions-item label="历史最佳排名">
          {{ userRankDetail?.bestRank || '暂无数据' }}
        </el-descriptions-item>
        <el-descriptions-item label="参与时长">
          {{ participationTime }} 小时
        </el-descriptions-item>
        <el-descriptions-item label="成就徽章">
          <el-badge
            v-for="badge in userRankDetail?.achievements"
            :key="badge.id"
            :value="badge.name"
            class="badge-item"
          >
            <img :src="badge.icon" alt="徽章图标" class="badge-icon" />
          </el-badge>
        </el-descriptions-item>
      </el-descriptions>
  
      <div class="rank-history-chart">
        <h3>排名变化曲线</h3>
        <div ref="chartContainer" style="height: 400px;"></div>
      </div>
  
      <el-card class="recent-rank-history" shadow="never">
        <h3>近期排名变化</h3>
        <el-table :data="userRankDetail?.rankHistory || []" style="width: 100%">
          <el-table-column prop="time" label="时间" width="150" />
          <el-table-column prop="rank" label="排名" />
          <el-table-column prop="score" label="得分" />
        </el-table>
      </el-card>
  
      <el-card class="score-history" shadow="never">
        <h3>得分历史统计</h3>
        <el-table :data="scoreHistory" style="width: 100%">
          <el-table-column prop="time" label="时间" width="150" />
          <el-table-column prop="score" label="得分" />
        </el-table>
      </el-card>
    </el-card>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRankStore } from '@/stores/rankStore';
  import * as echarts from 'echarts';
  
  // Pinia store 获取用户详情
  const rankStore = useRankStore();
  const userId = rankStore.currentUser.id;
  const type: 'daily' | 'weekly' | 'monthly' = 'daily';
  
  onMounted(() => {
    rankStore.fetchUserRankDetail(userId, type);
    rankStore.$subscribe(() => {
      renderChart();
    });
  });
  
  // 获取用户详情
  const userRankDetail = computed(() => rankStore.userRankDetail);
  
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
    if (!userRankDetail.value?.rankHistory || !chartContainer.value) return;
  
    const history = userRankDetail.value.rankHistory;
    const chart = echarts.init(chartContainer.value);
  
    const option = {
      title: {
        text: '排名变化曲线',
      },
      xAxis: {
        type: 'category',
        data: history.map(item => item.time), // 横轴为时间
      },
      yAxis: {
        type: 'value',
        name: '排名',
        inverse: true, // 排名越小越好，y轴需要反向显示
      },
      series: [
        {
          data: history.map(item => item.rank), // 用排名数据来绘制折线图
          type: 'line',
          smooth: true,
        },
      ],
    };
  
    chart.setOption(option);
  };
  
  // 示例得分历史数据
  const scoreHistory = computed(() => {
    if (userRankDetail.value?.rankHistory) {
      return userRankDetail.value.rankHistory.map(item => ({
        time: item.time,
        score: item.score,
      }));
    }
    return [];
  });
  </script>
  
  <style scoped>
  .user-detail-card {
    padding: 20px;
    margin: 20px;
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
  }
  
  .rank-history-chart {
    margin-top: 30px;
  }
  
  .recent-rank-history,
  .score-history {
    margin-top: 20px;
  }
  </style>
  