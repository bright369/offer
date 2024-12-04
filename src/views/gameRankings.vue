<template>
  <h2>排行榜</h2>

  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="日榜" name="daily"></el-tab-pane>
    <el-tab-pane label="周榜" name="weekly"></el-tab-pane>
    <el-tab-pane label="月榜" name="monthly"></el-tab-pane>
  </el-tabs>

  <div class="tab-content">
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="rowClassName"
    >
      <el-table-column prop="rank" label="排名" width="100" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="avatar" label="头像" width="120">
        <template #default="scope">
          <img
            :src="scope.row.avatar"
            alt="头像"
            style="width: 40px; height: 40px; border-radius: 50%"
          />
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分数" width="100" />
      <el-table-column prop="rankChange" label="排名变化" width="120" />
      <el-table-column label="徽章" width="200">
        <template #default="scope">
          <div
            v-for="badge in scope.row.badges"
            :key="badge.id"
            style="display: inline-block; margin-right: 5px"
          >
            <el-tooltip :content="badge.name">
              <img
                :src="badge.icon"
                alt="徽章"
                style="width: 24px; height: 24px; border-radius: 50%"
              />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="gotoPage(scope.row.userId)"
          >
            详情
          </el-button>
          <TrendChart :userId="scope.row.userId" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[100, 200, 300, 400]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, h } from "vue";
import { useRouter } from "vue-router";
import { useRankStore } from "@/stores/rankStore"; // 假设您的 store 存在
import type { TabsPaneContext } from "element-plus";
import TrendChart from "@/components/trendChart.vue";
const currentUserId = ref("user123"); // 假设当前登录用户的 ID
const router = useRouter();
const pageSize = ref(100);
const currentPage = ref(1);
const activeName = ref("daily");

const rankStore = useRankStore();
// 排名变化提示
const rankingChanged = ref(false);
// 计算 tableData 数据
const tableData = computed(() => {
  // 使用 rankList 从 store 中获取数据
  return rankStore.rankList;
});
// 定时刷新排行榜数据
const interval = 10 * 1000; // 每 10 秒刷新一次
let refreshInterval: any = null;
// 调用 fetchRankList 来填充数据
onMounted(() => {
  // 初始加载
  loadRankList();
  // 启动定时刷新
  startAutoRefresh();
});
// 加载排行榜数据
const loadRankList = async () => {
  await rankStore.fetchRankList(
    activeName.value,
    currentPage.value,
    pageSize.value
  );
  checkRankingChange(); // 检查是否有排名变化
};
// 启动定时刷新
const startAutoRefresh = () => {
  refreshInterval = setInterval(() => {
    loadRankList();
  }, interval);
};
// 当前用户的上一次排名
const previousRank = (userId: string) => {
  const previousRankData = rankStore.previousRankData[userId];
  return previousRankData ? previousRankData.rank : null;
};
// 检查是否有排名变化
const checkRankingChange = () => {
  const userRank = rankStore.rankList.find(
    (rank) => rank.userId === currentUserId.value
  );
  const previousRankValue = previousRank(currentUserId.value);

  if (userRank && previousRankValue !== userRank.rank) {
    ElNotification({
      title: "提示",
      message: h("i", { style: "color: teal" }, "你的排名发生变化了！"),
    });
  }
};

// 清除定时器
onBeforeUnmount(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
// 跳转到用户详情页
const gotoPage = (userId: string) => {
  router.push({ name: "rankDetail", params: { id: userId } });
};

const handleClick = (tab: TabsPaneContext) => {
  rankStore.fetchRankList(tab.paneName, currentPage.value, pageSize.value);
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};

const handleCurrentChange = (val: number) => {
  rankStore.fetchRankList(activeName.value, val, pageSize.value);
};

const rowClassName = ({ row }: { row: any }) => {
  return row.userId === currentUserId.value ? "warning-row" : "";
};
</script>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
