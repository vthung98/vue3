import { defineStore } from 'pinia'
import axios from 'axios'
import { sortListClass, sortListStudent } from '@/module/module.js'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      listClass: [
        //   {
        //     key: '0',
        //     stt: 1,
        //     name: '1A',
        //    }
      ],
      listStudent: [
        // {
        //   "id": 239,
        //   "name": "A La Ba",
        //   "birth_day": "01/01/2000 00:00:00",
        //   "address": "no_address",
        //   "class": "1S"
        // }
      ],
      homeData: {active1: true, active2: false, active3: false}
    }
  },
  getters: {
    classFilter: (state) => state.listClass.filter(i => i.stt > 1),
    listClass_length: (state) => state.listClass.length,
    listStudent_length: (state) => state.listStudent.length,
    listClassName: (state) => state.listClass.map(i => ({ value: i.name, label: i.name })),
    listStudentClass: (state) => state.listStudent.map(i => i.class)
  },
  actions: {
    async get_data_class() {
      try {
        const form = {
          "is_calc_total": true,
          "limit": 200,
          "offset": 0,
          "query": "",
          "timeout": 30
        }
        const reponse = await axios.post('https://staging.pontusinc.com/api/category_management/v1/intern/class/list', form)
        const db = reponse.data.result.data

        this.listClass = db.map((i, index) => ({ key: i.id, name: i.class + i.rank, stt: index + 1 }))
        this.listClass = sortListClass(this.listClass)
        this.listClass = this.listClass.map((i, index) => ({ key: i.key, name: i.name, stt: index + 1 }))
      } catch (error) { console.log(error) }
    },
    async add_class(tenLop) {
      let obj = {
        "class": Number(tenLop[0]),
        "rank": tenLop[1]
      }
      try {
        await axios.post('https://staging.pontusinc.com/api/category_management/v1/intern/class/create', obj)
      } catch (error) { console.log(error) }
    },
    async delete_class(ID) {
      try {
        await axios.delete(`https://staging.pontusinc.com/api/category_management/v1/intern/class/${ID}/delete`)
      } catch (error) { console.log(error) }
    },
    async edit_class(obj) {
      const ID = obj.key
      const form = {
        "class": obj.name[0],
        "rank": obj.name[1]
      }
      try {
        console.log(ID)
        await axios.put(`https://staging.pontusinc.com/api/category_management/v1/intern/class/${ID}/update`, form)
      } catch (error) { console.log(error) }
    },
    async get_data_student() {
      try {
        const form = {
          "is_calc_total": true,
          "limit": 200,
          "offset": 0,
          "query": "",
          "timeout": 30
        }
        const reponse = await axios.post('https://staging.pontusinc.com/api/category_management/v1/intern/student/list', form)
        const db = reponse.data.result.data
        this.listStudent = db.map((i, index) => ({ stt: index + 1, key: i.id, name: i.name, birth_day: i.birth_day, class: i.class }))
        this.listStudent = sortListStudent(this.listStudent)
        this.listStudent = this.listStudent.map((i, index) => ({ stt: index + 1, key: i.key, name: i.name, birth_day: i.birth_day, class: i.class }))
      } catch (error) { console.log(error) }
    },
    async delete_student(ID) {
      try {
        await axios.delete(`https://staging.pontusinc.com/api/category_management/v1/intern/student/${ID}/delete`)
      } catch (error) { console.log(error) }
    },
    async edit_student(obj) {
      const ID = obj.key
      const form = {
        "name": obj.name,
        "birth_day": obj.birth_day,
        "address": "no_adress",
        "class": obj.class
      }
      try {
        console.log(ID)
        await axios.put(`https://staging.pontusinc.com/api/category_management/v1/intern/student/${ID}/update`, form)
      } catch (error) { console.log(error) }
    },
    async add_student(newStudent) {
      let obj = {
        "name": newStudent.name,
        "birth_day": newStudent.birth_day,
        "address": "no_adress",
        "class": newStudent.class
      }
      try {
        await axios.post('https://staging.pontusinc.com/api/category_management/v1/intern/student/create', obj)
      } catch (error) { console.log(error) }
    },
    filterStudent(tenLop) {
      this.listStudent = this.listStudent.filter(i => i.class === tenLop)
      this.listStudent = this.listStudent.map((i, index) => ({ stt: index + 1, key: i.key, name: i.name, birth_day: i.birth_day, class: i.class }))

    },
    changeStatusST1 () {
      this.homeData = { active1: true, active2: false, active3: false }
    },
    changeStatusST2 () {
      this.homeData = { active1: false, active2: true, active3: false }
    },
    changeStatusST3 () {
      this.homeData = { active1: false, active2: false, active3: true }
    }
  }
})