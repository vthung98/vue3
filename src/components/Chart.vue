
<template>
  <div class="heading">
    <div class="heading-content">
      <h1>Biểu đồ số lượng học sinh mỗi lớp</h1>
    </div>
  </div>
  <div class="container">
    <div class="item">
      <Chart2 />
    </div>
    <div class="item">
      <div ref="chart" class="view" :option="option"></div>
    </div>
  </div>
  <router-view />

</template>

<script setup>
import Chart2 from '@/components/Chart2.vue'

import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useStore } from '@/store/index.js'
import router from '@/router';
import { storeToRefs } from 'pinia'

const studentStore = useStore()
const chart = ref(null)
const option = ref({})
const { listStudentClass } = storeToRefs(studentStore)

onMounted(() => {
  watch(listStudentClass, () => {
    const myChart = echarts.init(chart.value)
    const resultCount = {}
    listStudentClass.value.forEach(item => {
      if (resultCount[item]) {
        resultCount[item]++
      } else {
        resultCount[item] = 1
      }
    })
    const kqData = []
    for (let key in resultCount) {
      let pt = { value: resultCount[key], name: key }
      kqData.push(pt)
    }
    console.log(kqData)
    const optionX = {
      title: {
        text: 'Tỷ lệ học sinh mỗi lớp',
        subtext: '',
        left: 'center',
        textStyle: { fontFamily: 'sans-serif' }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        top: '10%',
        left: 'left'
      },
      series: [
        {
          name: 'Lớp',
          type: 'pie',
          radius: '50%',
          center: ['60%', '50%'],
          data: kqData
          // [
          //   { value: 1048, name: 'Search Engine' },
          //   { value: 735, name: 'Direct' },
          //   { value: 580, name: 'Email' },
          //   { value: 484, name: 'Union Ads' },
          //   { value: 300, name: 'Video Ads' }
          // ]
          ,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    optionX && myChart.setOption(optionX)
    option.value = optionX
    myChart.on('click', function (params) {
      console.log(params.name)
      studentStore.changeStatusST3()
      studentStore.filterStudent(params.name)
      router.push({ path: '/danh_sach_hoc_sinh' })
    })
  })
})

</script>

<style scoped>
.view {
  height: 400px;
  width: 500px;
}

.container {
  display: flex;
  justify-content: center;
  background-color: #eeeeee;
  height: 600px;
}

.item {
  margin: 60px 60px;
  width: 500px;
  height: 400px;
}

.item {
  border: 1px solid #999999;
  background-color: white;
}

.heading {
  display: flex;
  background-color: #eeeeee;
  padding-top: 60px;
}

.heading-content {
  display: flex;
  width: 1120px;
  margin: auto;
  background-color: white;
  border: 1px solid #999999;
}

.heading-content h1 {
  margin: auto;
  font-weight: 400;
}

/* mobile css */
@media (max-width: 739px) {
  .view {
    height: inherit;
    width: inherit;
  }

  .view div {
    height: inherit;
    width: inherit;
  }

  div>canvas {
    height: inherit;
    width: inherit;
  }
  .item {
    width: inherit;
    margin: 10px 10px;
  }
  .container {
    display: block;
    background-color: #eeeeee;
    height: 1000px;
    padding-top: 1px;
  }


  .heading {
    display: flex;
    background-color: #eeeeee;
    padding-top: 30px;
  }

  .heading-content {
    display: flex;
    width: 70%;
    margin: auto;
    background-color: white;
    border: 1px solid #999999;
  }

  .heading-content h1 {
    margin: auto;
    font-weight: 400;
    font-size: 14px;
  }
}
</style>
