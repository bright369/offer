// src/stores/rankStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

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
  userRankDetail: {
    currentRank: number;
    bestRank: number;
    rankHistory: RankHistory[];
    achievements: Achievement[];
  } | null;
  rankDistribution: {
    total: number;
    distribution: { scoreRange: string; count: number; topScore: number; bottomScore: number }[];
    percentiles: { percentage: number; score: number }[];
  } | null;
  currentUser: { id: string; nickname: string };
}

export const useRankStore = defineStore('rankStore', {
  state: (): RankStoreState => ({
    rankList: [],
    userRankDetail: null,
    rankDistribution: null,
    currentUser: { id: 'user123', nickname: 'Player1' },
  }),

  actions: {
    // 获取排行榜数据
    async fetchRankList(type: 'daily' | 'weekly' | 'monthly', page: number = 1, pageSize: number = 10): Promise<void> {
      try {
        const response = await axios.get(`/api/ranklist`, { params: { type, page, pageSize } });
        if (response.data.success) {
          this.rankList = response.data.data.list;
        }
      } catch (error) {
        console.error('Failed to fetch rank list:', error);
      }
    },

    // 获取用户排名详情
    async fetchUserRankDetail(userId: string, type: 'daily' | 'weekly' | 'monthly'): Promise<void> {
      try {
        const response = await axios.get(`/api/user/rankdetail`, { params: { userId, type } });
        if (response.data.success) {
          this.userRankDetail = response.data.data;
        }
      } catch (error) {
        console.error('Failed to fetch user rank detail:', error);
      }
    },

    // 获取排名分布数据
    async fetchRankDistribution(type: 'daily' | 'weekly' | 'monthly'): Promise<void> {
      try {
        const response = await axios.get(`/api/rankdistribution`, { params: { type } });
        if (response.data.success) {
          this.rankDistribution = response.data.data;
        }
      } catch (error) {
        console.error('Failed to fetch rank distribution:', error);
      }
    },
  },
});
