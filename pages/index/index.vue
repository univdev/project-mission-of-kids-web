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
    overflow: auto;
  }
  .record {
    width: 230px;
    background-color: white;
  }
  .chart {
    margin-top: 40px;
  }
  .line-chart-container {
    width: 100%;
    max-width: 1000px;
    height: 300px;
  }
  .line-chart {
    height: 300px;
  }
  .title {
    font-size: 22px;
    color: #707070;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .banner-row {
    display: flex;
    align-items: center;
  }
  .banner-col {
    margin-right: 24px;
  }
  .banner {
    border-radius: 8px;
    width: 462px;
    padding: 40px;
    background-color: #F3C189;
    color: white;
    position: relative;
  }
  .banner--purple {
    background-color: #5161CE;
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
  .banner-icon {
    position: absolute;
    bottom: 30px;
    right: 30px;
  }
  .record {
    padding: 40px 16px;
  }
  .best-card {
    border-radius: 8px;
    background-color: #5161CE;
    padding: 10px;
    margin-bottom: 20px;
  }
  .best-card-title {
    font-weight: bold;
    color: white;
    margin-bottom: 16px;
  }
  .best-card-score {
    text-align: center;
    color: #FFE463;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
  }
  .archivement-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .archivement-icon {
    margin-right: 8px;
  }
  .archivement-title {
    font-size: 14px;
    margin-bottom: 6px;
  }
  .archivement-description {
    font-size: 12px;
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
            img.banner-icon(src="~/assets/007-clock.png")
        .banner-col
          .title Banner
          .banner.banner--purple
            .banner-title 측정해보세요!
            .banner-description.
              우리 아이의 발달을
              기록해보세요.
            .banner-link VIEW DETAIL
            img.banner-icon(src="~/assets/007-clock.png")
      .chart
        .title Chart
        .line-chart-container
          app-line-chart.line-chart(
            :chart-data="chartData",
            :width="600",
            :height="300")
    .record
      .title Best
      .best-card
        .best-card-title Best record
        .best-card-score {{ bestRank.score | number }}
      .title Archivements
      ul.archivement-list
        li.archivement-item(v-for="(item, key) in bestRank.archivements")
          img.archivement-icon(src="~/assets/medal.png")
          .archivement-content
            .archivement-title {{ item.name }}
            .archivement-description {{ item.description }}
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import AppLineChart from '~/components/AppLineChart';

let LOAD_INTERVAL = null;

export default {
  name: 'Index',
  components: {
    AppLineChart,
  },
  async asyncData({ $axios }) {
    try {
      const since = moment().set(-7, 'day').format('YYYY-MM-DD');
      const until = moment().format('YYYY-MM-DD');
      const params = { since, until };
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
      this.oneWeek.forEach(date => {
        const format = date.format('YYYY-MM-DD');
        result[format] = this.ranks.filter(item => moment(item.createdAt).format('YYYY-MM-DD') === format);
      });
      return result;
    },
    bestRanksSplitByDate() {
      const result = [];
      const ranksSplitByDate = _.cloneDeep(this.ranksSplitByDate);
      Object.keys(ranksSplitByDate).forEach(date => {
        const items = ranksSplitByDate[date].sort((a, b) => {
          const aScore = a.score;
          const bScore = b.score;
          if (aScore > bScore) return -1;
          if (aScore < bScore) return 1;
          return 0;
        });
        const firstItem = items[0];
        if (firstItem) result.push(firstItem);
        else result.push(null);
      });
      return result;
    },
    bestRank() {
      return this.bestRanksSplitByDate.filter(item => item).sort((a, b) => {
        const aScore = a.score;
        const bScore = b.score;
        if (aScore > bScore) return -1;
        if (aScore < bScore) return 1;
        return 0;
      })[0] || {};
    },
    chartData() {
      const data = this.bestRanksSplitByDate.map(item => {
        if (item) return item.score;
        return null;
      });
      return {
        labels: this.oneWeek.map((item) => item.format('YYYY-MM-DD')),
        datasets: [
          {
            label: 'Records',
            backgroundColor: '#F3A800',
            data,
          },
        ],
      };
    },
    async load() {
      try {
        const since = moment().set(-7, 'day').format('YYYY-MM-DD');
        const until = moment().format('YYYY-MM-DD');
        const params = { since, until };
        const { data } = await this.$axios.get('/ranks', { params });
        return data;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
  },
  filters: {
    number(val) {
      if (!val) return val;
      if (!val.toLocaleString) return val;
      return val.toLocaleString();
    },
  },
  mounted() {
    LOAD_INTERVAL = setInterval(async () => {
      try {
        this.ranks = await this.load();
      } catch (e) {
        console.error(e);
        if (!e.response) return;
        const { message } = e.response.data;
        this.$message.error(message);
      }
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(LOAD_INTERVAL);
  },
};
</script>
