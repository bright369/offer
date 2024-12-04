<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="日榜" name="first"></el-tab-pane>
    <el-tab-pane label="周榜" name="second"></el-tab-pane>
    <el-tab-pane label="月榜" name="third"></el-tab-pane>
  </el-tabs>

  <div class="tab-content">
    <el-table :data="tableData" style="width: 100%">
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { TabsPaneContext } from "element-plus";

const router = useRouter();
const pageSize = ref(100);
const currentPage = ref(1);
const activeName = ref("first");

// Data for different tabs
const dayData = [
  {
    rank: 1,
    userId: "user123",
    nickname: "玩家1",
    avatar: "https://www.example.com/avatar1.jpg",
    score: 1000,
    rankChange: -1,
    badges: [
      {
        id: "badge1",
        name: "顶级得分手",
        icon: "https://www.example.com/badge1.jpg",
      },
      { id: "badge2", name: "MVP", icon: "https://www.example.com/badge2.jpg" },
    ],
  },
  {
    rank: 2,
    userId: "user456",
    nickname: "玩家2",
    avatar: "https://www.example.com/avatar2.jpg",
    score: 900,
    rankChange: 2,
    badges: [
      {
        id: "badge3",
        name: "冠军",
        icon: "https://www.example.com/badge3.jpg",
      },
    ],
  },
];

const weekData = [
  // Similar structure as `dayData`
];

const monthData = [
  // Similar structure as `dayData`
];

// Computed property to get the correct data based on the active tab
const tableData = computed(() => {
  if (activeName.value === "first") {
    return dayData;
  } else if (activeName.value === "second") {
    return weekData;
  } else {
    return monthData;
  }
});

const gotoPage = (userId: string) => {
  console.log("跳转到详情页", userId);
  router.push({ name: "rankDetail", params: { id: userId } });
};

const handleClick = (tab: TabsPaneContext) => {
  console.log(tab);
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<style scoped>
/* Custom styles */
</style>
