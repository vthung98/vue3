<template>
  

  <div ref="chart" :option="option" class="view">
  </div>
  <router-view />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts';
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
    const vlData = kqData.map(i => i.value)
    const orData = kqData.map(i => i.name)
    const optionX = {
      title: {
        text: 'Số lượng học sinh mỗi lớp',
        subtext: '',
        left: 'center',
        textStyle: {fontFamily: 'sans-serif'}
      },
      xAxis: {
        type: 'category',
        data: orData
        // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: vlData
          // [120, 200, 150, 80, 70, 110, 130]
          ,
          type: 'bar'
        }
      ]
    }
    optionX && myChart.setOption(optionX)
    option.value = optionX
    myChart.on('click', function (params) {
      console.log(params.name)
      studentStore.changeStatusST3()
      studentStore.filterStudent(params.name)
      router.push({ path: '/danh_sach_hoc_sinh'})
    })
  })
})

</script>
<style scoped>
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
</style>
