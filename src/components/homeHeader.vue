<!--
 * @git config user.name: wangxin
 * @LastEditors: wangxin
-->
<template>
  <div class="headerBack"></div>
  <div class="headerWrapper">
    <div class="headerLeft">
      途未科技
    </div>
    <div class="headerRight">
      <img class="userAvatar" src="@/assets/imgs/userAvatar.png"  alt="用户头像" />
      <span class="userName">{{ userName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 模拟用户信息

const userName = ref("user123");
</script>

<style lang="scss" scoped>
.headerBack {
  height: 50px;
}

.headerWrapper {
  height: 50px;
  background-color: #000;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0px;
  z-index: 4;
  padding: 0 20px;
  box-sizing: border-box;
  
  .headerLeft {
    font-size: 20px;
    color: #fff;
    font-weight: bold;
  }

  .headerRight {
    display: flex;
    align-items: center;

    .userAvatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .userName {
      color: #fff;
      font-size: 16px;
    }
  }
}
</style>
