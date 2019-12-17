<style lang="less" scoped>
  .index {
    width: 100%;
    height: 100vh;
    min-height: 600px;
    background-color: #F0F6FB;
    display: flex;
  }
  .side {
    width: 48px;
    background-color: #5161CE;
  }
  .content {
    flex: 1;
    padding: 40px 60px;
  }
  .record {
    width: 230px;
    background-color: white;
  }
  .title {
    font-size: 22px;
    color: #707070;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .banner {
    border-radius: 8px;
    width: 462px;
    padding: 40px;
    background-color: #F3C189;
    color: white;
    position: relative;
  }
  .banner-title {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .banner-description {
    font-size: 18px;
    font-weight: bold;
    width: 160px;
    line-height: 24px;
  }
  .banner-link {
    margin-top: 40px;
    font-weight: bold;
  }
  .chart {
    margin-top: 40px;
  }
  .line-chart {
    height: 300px;
  }
</style>

<template lang="pug">
  .index
    .side
    .content
      .banner-row
        .banner-col
          .title Banner
          .banner
            .banner-title 측정해보세요!
            .banner-description.
              우리 아이의 발달을
              기록해보세요.
            .banner-link VIEW DETAIL
      .chart
        .title Chart
        app-line-chart.line-chart(
          :style="{ height: '250px', position: 'relative' }",
          :chart-data="chartData")
    .record
      .best-card
        .best-title
        .best-score
      .title Archivement
      ul.archivement-list
        li.archivement-item asd
</template>

<script>
import moment from 'moment';
import AppLineChart from '~/components/AppLineChart';

export default {
  name: 'Index',
  components: {
    AppLineChart,
  },
  async asyncData({ $axios }) {
    try {
      // const since = moment().set(-7, 'day').format('YYYY-MM-DD');
      // const until = moment().format('YYYY-MM-DD');
      // const params = { since, until };
      const params = {};
      const { data: ranks } = await $axios.get('/ranks', { params });
      return { ranks };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  computed: {
    oneWeek() {
      const week = [];
      for (let i = 0; i < 7; i += 1) {
        week.push(moment().add(-i, 'day'));
      }
      return week.reverse();
    },
    ranksSplitByDate() {
      const result = {};
      this.ranks.forEach((item) => {
        const key = moment(item.createdAt).format('YYYY-MM-DD');
        if (!(key in result)) result[key] = [];
        result.push(key);
      });
      return result;
    },
    chartData() {
      return {
        labels: this.oneWeek.map((item) => item.format('YYYY-MM-DD')),
        datasets: [
          {
            label: 'Records',
            backgroundColor: '#F3A800',
            data: [2, 3, 7, 2, 1, 5, 3],
          },
        ],
      };
    },
  },
  mounted() {

  },
};
</script>
