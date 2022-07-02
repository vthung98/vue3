import { createRouter, createWebHistory } from 'vue-router'
import TableClass from '@/components/TableClass.vue'
import TableStudent from '@/components/TableStudent.vue'
import Chart from '@/components/Chart.vue'

const routes = [
  {
    path: '/',
    name: 'Chart',
    component: Chart
  },
  {
    path: '/danh_sach_lop',
    name: 'danh_sach_lop',
    component: TableClass
  }, 
  {
    path: '/danh_sach_hoc_sinh',
    name: 'danh_sach_hoc_sinh',
    component: TableStudent
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})



export default router
