<!--
 * @git config user.name: wangxin
 * @LastEditors: wangxin
-->
<template>
    <el-card class="competition-analysis-card" shadow="hover">
      <div class="btns">
        <el-button @click="goToPage('/')">返回</el-button>
      </div>
      <el-descriptions title="当前用户排名" :column="2" border>
        <el-descriptions-item label="当前排名">
          {{ userRank }}
        </el-descriptions-item>
        <el-descriptions-item label="当前得分">
          {{ userScore }}
        </el-descriptions-item>
      </el-descriptions>
  
      <el-divider></el-divider>
  
      <el-row>
        <el-col :span="12">
          <el-card v-if="previousPlayer" class="comparison-card">
            <h5>前一名玩家</h5>
            <p>昵称: {{ previousPlayer.nickname }}</p>
            <p>得分: {{ previousPlayer.score }}</p>
            <p>分数差距: {{ userScore - previousPlayer.score }} 分</p>
            <p v-if="canSurpassPrevious" class="success">
              预测：您有可能超越此玩家！
            </p>
          </el-card>
          <span v-else> 恭喜你，你是第一名！万岁 </span>
        </el-col>
  
        <el-col :span="12">
          <el-card v-if="nextPlayer" class="comparison-card">
            <h5>后一名玩家</h5>
            <p>昵称: {{ nextPlayer.nickname }}</p>
            <p>得分: {{ nextPlayer.score }}</p>
            <p>分数差距: {{ nextPlayer.score - userScore }} 分</p>
            <p v-if="atRiskOfBeingOvertaken" class="warning">
              警告：您有可能被此玩家超越！
            </p>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </template>
  
  <script lang="ts" setup>
  import { computed, ref, onMounted } from "vue";
  import { useRankStore } from "@/stores/rankStore";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const rankStore = useRankStore();
  const currentUserId = ref<string>("user123");
  onMounted(() => {
    loadRankList();
  });
  // 加载排行榜数据
  const loadRankList = async () => {
    // 调用后端接口获取排行榜数据,不分页的班本
  };
  // 获取用户排名和分数
  const userRankData = computed(() => {
    return rankStore.rankList.find((rank) => rank.userId === currentUserId.value);
  });
  //根据后端数据计算获得名次和得分，此处直接写死
  
  const userRank = ref(2);
  const userScore = ref(100);
  const previousPlayer = ref({
    nickname: "玩家A",
    score: 90,
  });
  const nextPlayer = ref({
    nickname: "玩家B",
    score: 110,
  });
  // const userRank = computed(() => userRankData.value?.rank || "未知");
  // const userScore = computed(() => userRankData.value?.score || 0);
  // const previousPlayer = computed(() => {
  
  //   if (userRank.value && userRank.value > 1) {
  //     return rankStore.rankList.find((rank) => rank.rank === userRank.value - 1);
  //   }
  //   return null;
  // });
  
  // const nextPlayer = computed(() => {
  //   return rankStore.rankList.find((rank) => rank.rank === userRank.value + 1);
  // });
  
  // 根据后端历史数据计算得分历史，然后在做比较，此处直接写死
  // 预测用户是否能超越前一名
  const canSurpassPrevious = computed(() => {
    if (previousPlayer.value.score - userScore.value <= 10) {
      return true;
    }
    return false;
  });
  
  // 检查用户是否有被下一名追赶的风险
  const atRiskOfBeingOvertaken = computed(() => {
    if (nextPlayer.value) {
      if (nextPlayer.value.score - userScore.value <= 10) {
        return true;
      }
    }
    return false;
  });
  
  const goToPage = (path: string) => {
    router.push({ path });
  };
  </script>
  
  <style scoped lang="scss">
  .competition-analysis-card {
    padding: 20px;
    margin: 20px;
    position: relative;
    .btns {
      position: absolute;
      right: 20px;
    }
  }
  
  .comparison-card {
    margin: 10px;
    padding: 10px;
  }
  .warning {
    color: red;
  }
  .success {
    color: green;
  }
  </style>
  