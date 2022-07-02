<template>
  <div class="back-ground">
    <div class="container">
      <!-- thanh cong cu -->
      <div class="btn-container">
        
        <div class="search-form">
          <input type="text" placeholder="Nhập tên học sinh hoặc tên lớp" v-model="searchIp">
          <button @click="search">Tìm kiếm</button>
        </div>
        <!-- button add -->
        <a-button class="editable-add-btn"
          @click="handleAdd">Thêm học sinh
        </a-button>
      </div>
      <a-modal v-model:visible="visible" title="Thêm lớp" @ok="handleOk" class="input-form" cancelText="Huỷ"
        okText="Đồng ý">
        <input type="text" placeholder="Nhập tên..." class="input-class" v-model="nameIp">
        <input type="text" placeholder="Nhập ngày sinh..." class="input-class" v-model="birthDayIp">

        <a-select v-model:value="value" show-search placeholder="Chọn lớp" :options="options"
          :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur" @change="handleChange"
          class="input-class input-classX">
        </a-select>
      </a-modal>

      <a-table bordered :data-source="listStudent" :columns="columns" :loading="isLoading">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'name'">
            <div class="editable-cell">
              <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" />
                <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
              </div>
              <div v-else class="editable-cell-text-wrapper">
                {{ text || ' ' }}
                <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
              </div>
            </div>
          </template>
          <template v-if="column.dataIndex === 'birth_day'">
            <div class="editable-cell">
              <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                <a-input v-model:value="editableData[record.key].birth_day" @pressEnter="save(record.key)" />
                <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
              </div>
              <div v-else class="editable-cell-text-wrapper">
                {{ text || ' ' }}
                <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
              </div>
            </div>
          </template>
          <template v-if="column.dataIndex === 'class'">
            <div class="editable-cell">
              <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                <a-input v-model:value="editableData[record.key].class" @pressEnter="save(record.key)" />
                <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
              </div>
              <div v-else class="editable-cell-text-wrapper">
                {{ text || ' ' }}
                <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
              </div>
            </div>
          </template>

          <template v-else-if="column.dataIndex === 'operation'">
            <a-popconfirm v-if="listStudent.length" title="Bạn có muốn xóa không?" @confirm="onDelete(record.key)"
              cancelText="Huỷ" okText="Đồng ý">
              <a>Xóa</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
    <a href="#header" class="btn-goTop">Top</a>
  </div>

</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash-es';
import { column } from 'element-plus/es/components/table-v2/src/common';
import { useStore } from '../store/index.js'
import { storeToRefs } from 'pinia'


const studentStore = useStore()
// studentStore.get_data_student()
const { listStudent } = storeToRefs(studentStore)

const columns = [{
  title: 'STT',
  dataIndex: 'stt',
  width: '10%'  
},
{
  title: 'Tên học sinh',
  dataIndex: 'name',
  width: '40%'  
},
{
  title: 'Ngày sinh',
  dataIndex: 'birth_day',
  width: '20%'  
},
{
  title: 'Tên lớp',
  dataIndex: 'class',
  width: '15%'  
},
{
  title: '',
  dataIndex: 'operation',
  width: '15%'  
}];
// const listStudent = ref([
// {
//         "id": 239,
//         "name": "A La Ba",
//         "birth_day": "01/01/2000 00:00:00",
//         "address": "no_address",
//         "class": "1S"
//       },
//       {
//         "id": 240,
//         "name": "A La Bo sua ne",
//         "birth_day": "01/01/2000 00:00:00",
//         "address": "no_address",
//         "class": "1N"
//       }
// ])



const nameIp = ref('')
const birthDayIp = ref('')
const value = ref('')

const classNameIp = ref('')
const searchIp = ref('')

const visible = ref(false)
const count = computed(() => listStudent.value.length + 1)
const editableData = reactive({});

const edit = key => {
  editableData[key] = cloneDeep(listStudent.value.filter(item => key === item.key)[0]);
};

const save = key => {
  studentStore.edit_student(editableData[key])
  Object.assign(listStudent.value.filter(item => key === item.key)[0], editableData[key]);
  delete editableData[key];
};

const onDelete = key => {
  listStudent.value = listStudent.value.filter(item => item.key !== key)
  studentStore.delete_student(key)
};
const handleOk = () => {
  const newStudent = {
    key: count.value,
    stt: count.value,
    name: nameIp.value,
    birth_day: birthDayIp.value,
    class: value.value
  }
  listStudent.value.unshift(newStudent)
  studentStore.add_student(newStudent)
  setTimeout(() => {
    studentStore.get_data_student()
  }, 1200)
  
  visible.value = false
  nameIp.value = ''
  birthDayIp.value = ''
  value.value = ''
}
const handleAdd = () => {
  visible.value = true
}

const isLoading = ref(false)

const search = () => {
  studentStore.get_data_student()
  if (/[0-9]/.test(searchIp.value)) {
    isLoading.value = true
    const searchByClass = () => {
      listStudent.value = listStudent.value.filter(i => i.class.toLowerCase().includes(searchIp.value.toLowerCase()))
      isLoading.value = false
    }
    setTimeout(searchByClass, 1000)
  } else {
    isLoading.value = true
    const searchByName = () => {
      listStudent.value = listStudent.value.filter(i => i.name.toLowerCase().includes(searchIp.value.toLowerCase()))
      isLoading.value = false
    }
    setTimeout(searchByName, 1000)
  }
  setTimeout(() => {
    searchIp.value = ''
  }, 3000);
}

// const options = ref([{
//   value: 'jack',
//   label: 'Jack',
// }, {
//   value: 'lucy',
//   label: 'Lucy',
// }, {
//   value: 'tom',
//   label: 'Tom',
// }]);
const listClassName = studentStore.listClassName

const options = ref(listClassName)

const handleChange = value => {
  console.log(`selected ${value}`)
}

const handleBlur = () => {
  console.log('blur');
};

const handleFocus = () => {
  console.log('focus');
};

const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};


</script>
<style lang="less" scoped>
.btn-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  .search-form {
    display: flex;
    margin-left: 4%;
    height: 36%;
    width: 40%;
  }
  .search-form input {
    flex: 1;
    text-overflow: ellipsis;
    border: 1px solid #999999;
  }
  .search-form button {
    margin-left: 4%;
    width: 80px;
    min-width: 78px;
  }
  

  .editable-add-btn {
    height: 36%;
    margin-right: 4%;
  }
}

.back-ground {
  background-color: #eeeeee;

  .container {
    margin: 0px 100px 20px 100px;
  }
}

.editable-cell {
  position: relative;

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.input-class {
  border: 1px solid #999999;
  width: 80%;
  margin-left: 50%;
  margin-top: 4px;
  margin-bottom: 4px;
  transform: translateX(-50%);
}

.input-classX {
  border: none;
}
.btn-goTop {
  display: block;
  position: relative;
  bottom: 64px;
  left: 95%;
  width: 50px;
  height: 40px;
  font-weight: 500;
  font-size: 15px;
}

// mobile css
@media (max-width: 739px) {
  .container {
    margin: 0px 5px 20px 5px !important;
  }
  .search-form button {
    font-size: 12px;
  }
  .btn-goTop {
    display: none;
  }
  .btn-delete {
  color: rgb(201, 15, 15);
  margin-left: 25px;
  }
  .ant-btn {
    padding: 4px 4px;
  }
}
</style>
