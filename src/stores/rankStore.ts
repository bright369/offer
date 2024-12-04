// src/stores/rankStore.ts
import { defineStore } from "pinia";
import axios from "axios";

// 定义排行榜单项的类型
interface RankItem {
  rank: number;
  userId: string;
  nickname: string;
  avatar: string;
  score: number;
  rankChange: number;
  badges: Badge[];
}

// 定义徽章的类型
interface Badge {
  id: string;
  name: string;
  icon: string;
}

// 定义用户排名历史记录类型
interface RankHistory {
  time: string;
  rank: number;
  score: number;
}

// 定义用户成就的类型
interface Achievement {
  id: string;
  name: string;
  icon: string;
  obtainTime: string;
}

// 定义Pinia store的状态类型
interface RankStoreState {
  rankList: RankItem[];
  previousRankData: Record<string, { rank: number | null }>;
  userRankDetail: {
    currentRank: number;
    bestRank: number;
    rankHistory: RankHistory[];
    achievements: Achievement[];
    dailyGameDurations: { date: string; duration: number }[];
  } | null;
  rankDistribution: {
    total: number;
    distribution: {
      scoreRange: string;
      count: number;
      topScore: number;
      bottomScore: number;
    }[];
    percentiles: { percentage: number; score: number }[];
  } | null;
  currentUser: { id: string; nickname: string };
}

export const useRankStore = defineStore("rankStore", {
  state: (): RankStoreState => ({
    rankList: [],
    previousRankData: {},
    userRankDetail: null,
    rankDistribution: null,
    currentUser: { id: "user123", nickname: "Player1" },
  }),

  actions: {
    // 获取排行榜数据
    async fetchRankList(
      type: "daily" | "weekly" | "monthly",
      page: number = 1,
      pageSize: number = 10
    ): Promise<void> {
      try {
        // const response = await axios.get(`/api/ranklist`, { params: { type, page, pageSize } });
        // if (response.data.success) {
        const dayData = [
          {
            rank: 1,
            userId: "user123",
            nickname: "玩家1",
            avatar: "https://www.example.com/avatar1.jpg",
            score: 1000,
            rankChange: 1,
            badges: [
              {
                id: "badge1",
                name: "顶级得分手",
                icon: "https://www.example.com/badge1.jpg",
              },
              {
                id: "badge2",
                name: "MVP",
                icon: "https://www.example.com/badge2.jpg",
              },
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

        const weekData = [];

        const monthData = [];
        if (type === "daily") {
          this.rankList = dayData;
        } else if (type === "weekly") {
          this.rankList = weekData;
        } else {
          this.rankList = monthData;
        }
        // }
      } catch (error) {
        console.error("Failed to fetch rank list:", error);
      }
    },

    // 获取用户排名详情
    async fetchUserRankDetail(
      userId: string,
      type: "daily" | "weekly" | "monthly"
    ): Promise<void> {
      try {
        // const response = await axios.get(`/api/user/rankdetail`, {
        //   params: { userId, type },
        // });
        // if (response.data.success) {
        const rankDetail = {
          avatar: "https://www.example.com/avatar.jpg",
          nickname: "玩家1",
          currentRank: 5,
          bestRank: 1,
          achievements: [
            {
              id: "achievement1",
              name: "顶级得分手",
              icon: "https://www.example.com/badge1.jpg",
            },
            {
              id: "achievement2",
              name: "MVP",
              icon: "https://www.example.com/badge2.jpg",
            },
            {
              id: "achievement3",
              name: "无敌王者",
              icon: "https://www.example.com/badge3.jpg",
            },
          ],
          rankHistory: [
            {
              time: "2024-11-01",
              rank: 8,
              score: 950,
            },
            {
              time: "2024-11-05",
              rank: 7,
              score: 970,
            },
            {
              time: "2024-11-10",
              rank: 5,
              score: 1000,
            },
            {
              time: "2024-11-15",
              rank: 6,
              score: 980,
            },
          ],

          participationTime: 120,
          scoreHistory: [
            {
              time: "2024-11-01",
              score: 950,
            },
            {
              time: "2024-11-05",
              score: 970,
            },
            {
              time: "2024-11-10",
              score: 1000,
            },
            {
              time: "2024-11-15",
              score: 980,
            },
            {
              time: "2024-11-20",
              score: 995,
            },
          ],
          dailyGameDurations: [
            { date: "2024-12-01", duration: 7200 },
            { date: "2024-12-02", duration: 3600 },
            { date: "2024-12-03", duration: 5400 },
            { date: "2024-12-04", duration: 3000 },
          ],
        };
        this.userRankDetail = rankDetail;
        // }
      } catch (error) {
        console.error("Failed to fetch user rank detail:", error);
      }
    },
    // 更新用户的历史排名
    updatePreviousRankData(userId: string, rank: number | null): void {
      this.previousRankData[userId] = { rank };
    },
  },
});
