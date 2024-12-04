一.架构
1.采用vite+vue3+ts+element-plus+axios+pinia+echarts搭建
2.在pinia中定义store进行数据存储，更新，页面着重于交互
3.使用axios进行数据请求
4.封装header，详情，echarts图标组件。
5.使用了AutoImport，Components插件，自动，按需引入，减少代码量，提高开发效率。

注意：实际开发中应该要全局封装axios，封装请求拦截器，响应拦截器，错误处理等，方便维护和使用。

二.排名列表页面，实现思路
采用element-plus组件库的tabs，dailog，table，分页等组件进行页面搭建

1.tab分为日榜，周榜，月榜，根据切换不同的tabs进行不同的请求，获取不同的排名数据，默认加载的是日榜

2.页面中会有一个定时器，每10s进行一次请求，更新排名数据 ，如果数据发生变化提示排名发生了变化。并且更新列表数据，
3.会根据登陆用户的id，进行判断，如果是自己的id，会将自己的数据标记，列表颜色为黄色，在请求列表接口的时候，将自己的id传递过去，后端会将数据进行标记，根据标记跳转到列表对应的分页位置。此处直接根据userId进行简单对比

注意：
实际项目开发中，最好是可以通过websocket 和 sse 来实现，排名情况sse实现最佳
目前面试环节使用定时器进行轮训实现。
实际项目开发中，应将排名更新封装成hooks，方便维护和使用。
目前直接在列表页面中进行操作。

3.列表会有操作栏，操作栏可以查看详情，排名趋势的分析等操作

注意:
echarts数据目前直接写在了初始化图标的时候，实际开发中，应该将数据封装成hooks，方便维护和使用。

三.详情页面

四.竞争分析
根据后端数据进行计算，此处直接写死
计算方式
const userRank = computed(() => userRankData.value?.rank || "未知");
const userScore = computed(() => userRankData.value?.score || 0);
const previousPlayer = computed(() => {

  if (userRank.value && userRank.value > 1) {
    return list.find((rank) => rank.rank === userRank.value - 1);
  }
  return null;
});

const nextPlayer = computed(() => {
  return list.find((rank) => rank.rank === userRank.value + 1);
});
