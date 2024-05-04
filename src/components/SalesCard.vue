<script lang="ts" setup>
import moment from 'moment';
import request from '../utils/request.js';
import { computed, ref, onMounted } from "vue";
import { useTheme } from "vuetify/lib/framework.mjs";
import PercentTrend from "../components/PercentTrend.vue";

const formatDate = (date: string) => {
  return date ? moment(date).format("D MMM") : "";
};

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  
  percentageLabel: {
    type: String,
    default: "与上周",
  },
  series: {
    type: Array,
    default: () => [
      {
        name: "订舱",
        data: chartData.value.map(item => item.y),
      },
    ],
  },
  xaxis: {
    type: Object,
    default: () => ({
      type: "category",
      categories:
        chartData.value.map(item => item.x)
      // tickAmount: 3
    }),
  },
  label: {
    type: String,
    default: "个人销售统计",
  },
  // actionLabel: {
  //   type: String,
  //   default: "查看报告",
  // },
  options: {
    type: Object,
    default: () => ({}),
  },
});

const { themes, current } = useTheme();
const chartOptions = computed(() => {
  const primaryColor = current.value.dark
    ? themes.value["dark"].colors.primary
    : themes.value["light"].colors.primary;

  return {
    chart: {
      height: 120,
      type: "area",
      sparkline: {
        enabled: true,
      },
      animations: {
        speed: 400,
      },
    },
    series: props.series,
    colors: [primaryColor],
    fill: {
      type: "solid",
      colors: [primaryColor],
      opacity: 0.15,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: props.xaxis,
    tooltip: {
      followCursor: true,
      theme: "dark",
      custom: function ({ ctx, series, seriesIndex, dataPointIndex, w }: any) {
        const seriesName = w.config.series[seriesIndex].name;

        return `<div class="rounded-lg pa-1 text-caption">
                <div class="font-weight-bold">${formatDate(
          w.globals.categoryLabels[dataPointIndex]
        )}</div>
                <div>${series[seriesIndex][dataPointIndex]} ${seriesName}</div>
              </div>`;
      },
    },
    ...props.options,
  };
});

const loading = ref(true);

onMounted(() => {
  fetchDataAndCalculate();
    
  
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>
<template>
  <v-card class="d-flex flex-grow-1 bg-primary-darken-4 pa-3" theme="dark">
    <!-- loading spinner -->
    <div v-if="loading" class="d-flex flex-grow-1 align-center justify-center">
      <v-progress-circular indeterminate color="cyan-lighten-2"></v-progress-circular>
    </div>

    <!-- information -->
    <div v-else class="d-flex flex-column flex-grow-1">
      <v-card-title class="d-flex">
        <div class="font-weight-bold">{{ label }}</div>
        <v-spacer></v-spacer>
        <!-- <v-btn
          variant="text"
          color="cyan-lighten-2"
          class="font-weight-bold"
          @click="$emit('action-clicked')"
          >{{ actionLabel }}</v-btn
        > -->
      </v-card-title>

      <div class="d-flex flex-column flex-grow-1">
        <div class="pa-2">
          <div class="text-h4">
            订舱: {{ getTotalCount() }}
          </div>
          <div class="text-primary mt-1">
            上周订舱数量:
            {{ getDifferenceWithLastWeek() }}

          </div>
        </div>

        <v-spacer></v-spacer>

        <div class="px-2 pb-2">
          <div class="title mb-1 font-weight-bold">
            本周销售
          </div>
          <div class="d-flex align-center">
            <div class="text-h4">
              订舱: {{ getTotalThisWeek() }}
            </div>
            <v-spacer></v-spacer>
            <div class="d-flex flex-column text-right">
              <div class="font-weight-bold">
                <percent-trend :value="roundedPercentage" />
              </div>
              <div class="text-caption">{{ percentageLabel }}</div>
            </div>
          </div>
        </div>
      </div>

      <apexchart type="area" height="120" :options="chartOptions" :series="series"></apexchart>
    </div>
  </v-card>
</template>
<script lang="ts">

const storedUserJSON = localStorage.getItem('admin');
const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;

const chartData = ref<any[]>([]);
const thisWeekData = ref<any[]>([]);
const lastWeekTotal = ref<any[]>([]);
const thisWeek = ref(0);
const lastWeek = ref(0);
const roundedPercentage=ref(0);

const fetchData = async () => {
  console.log('onMounted hook is called!');
  try {
    const response = await request.get(`/trade/getcounts/${storedUser?.adminid}`);
    console.log('Response data:', response.data);
    chartData.value = response.data.map(item => ({
      x: moment(item.createdate).format("YYYY-MM-DD HH:mm:ss"),
      y: item.count
    }));
  } catch (error) {
    console.error('Error fetching data from the backend:', error);
  }
};
const getThisWeekData = () => {
  const today = moment();
  const startOfWeek = today.clone().startOf('isoWeek'); // 获取本周的开始（星期一）
  const endOfWeek = today.clone().add(6, 'days'); // 获取本周的结束（星期日）

  return chartData.value.filter(data =>
    moment(data.x).isBetween(startOfWeek, endOfWeek, null, '[]')
  );
};

const getTotalThisWeek = () => {
  thisWeekData.value = getThisWeekData();
  thisWeek.value = thisWeekData.value.reduce((total, data) => total + data.y, 0);
  return thisWeek;
};

const getDifferenceWithLastWeek = () => {
  const today = moment();
  const startOfWeek = today.clone().startOf('isoWeek');
  const endOfWeek = today.clone().endOf('isoWeek');
  const startOfLastWeek = startOfWeek.clone().subtract(7, 'days');
  const endOfLastWeek = endOfWeek.clone().subtract(7, 'days');
  lastWeekTotal.value = chartData.value.filter(data =>
    moment(data.x).isBetween(startOfLastWeek, endOfLastWeek, null, '[]')
  );

  lastWeek.value = lastWeekTotal.value.reduce((total, data) => total + data.y, 0);

  
  return lastWeek;
};

const calculatePercentage = (thisWeekvalue,lastWeekvalue) => {
  
  
  console.log('percentage', ((thisWeekvalue - lastWeekvalue) / lastWeekvalue) * 100);
  
  const percentage = ((thisWeekvalue - lastWeekvalue) / lastWeekvalue) * 100;
  roundedPercentage.value = parseFloat(percentage.toFixed(1));
  console.log('percentage', roundedPercentage.value);
  return roundedPercentage ;
};

const fetchDataAndCalculate = async () => {
  try {
    await fetchData(); // 异步请求数据
    getTotalThisWeek();
    getDifferenceWithLastWeek();
    calculatePercentage(thisWeek.value, lastWeek.value);
  } catch (error) {
    console.error('Error fetching data and calculating percentage:', error);
  }
};
const getTotalCount = () => {
  return chartData.value.reduce((total, data) => total + data.y, 0);
};




export default {}

</script>
