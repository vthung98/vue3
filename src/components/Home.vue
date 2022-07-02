<template>

  <div class="nav-container" id="header">
    <router-link class="link" to="/">
      <div class="nav-container-item" :class="{ active: homeData.active1 }" @click="chageStatus1">
        <span>Trang chủ</span>
      </div>
    </router-link>

    <router-link class="link" to="/danh_sach_lop">
      <div class="nav-container-item" :class="{ active: homeData.active2 }" @click="chageStatus2">
        <span>Danh sách lớp</span>
      </div>
    </router-link>

    <router-link class="link" to="/danh_sach_hoc_sinh">
      <div class="nav-container-item" :class="{ active: homeData.active3 }" @click="chageStatus3">
        <span>Danh sách học sinh</span>
      </div>
    </router-link>
  </div>
  <router-view />
  


</template>

<script setup>
import { useStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import { ref, reactive } from 'vue';

const studentStore = useStore()
studentStore.get_data_class()
studentStore.get_data_student()
const { homeData } = storeToRefs(studentStore)
// const isActives = homeData.value
const chageStatus1 = () => {

  studentStore.changeStatusST1()
  studentStore.get_data_student()
}
const chageStatus2 = () => {

  studentStore.changeStatusST2()
  studentStore.get_data_class()
}
const chageStatus3 = () => {

  studentStore.changeStatusST3()
  studentStore.get_data_student()
}



</script>
<style scoped>
.nav-container {
  display: flex;
  height: 50px;
  margin: auto;
  justify-content: center;
  border-bottom: 1px solid #888888;
  background-color: #eeeeee;
}

.nav-container a {
  color: rgb(23, 116, 23);
}

.nav-container-item {
  height: 100%;
  display: flex;
  margin-left: 16px;
  margin-right: 16px;
  padding: 0 8px;
  cursor: pointer;
}

.nav-container-item span {
  margin: auto;
  font-weight: 500;
  font-size: 20px;
}

.active {
  background-color: white;
  border-bottom: 3px solid greenyellow;
}
/* mobile css */
@media (max-width: 739px) {
  .nav-container {
  display: flex;
  height: 30px;
  margin: auto;
  justify-content: center;
  border-bottom: 1px solid #888888;
  background-color: #eeeeee;
}
  .nav-container a {
  color: rgb(23, 116, 23);
}
  .nav-container-item {
  height: 100%;
  display: flex;
  margin-left: 0px;
  margin-right: 0px;
  padding: 0 8px;
  cursor: pointer;
}

.nav-container-item span {
  margin: auto;
  font-weight: 500;
  font-size: 12px;
}
}
</style>
