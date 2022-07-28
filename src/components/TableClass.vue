<template>
  <div class="back-ground">
    <div class="container">
      <!-- Thanh cong cu -->
      <div class="btn-container">
        <div class="search-form">
          <input type="text" placeholder="Nhập tên lớp" v-model="searchIp">
          <button @click="search">Tìm kiếm</button>
        </div>

        <!-- button add -->
        <a-button class="editable-add-btn" @click="handleAdd">Thêm Lớp
        </a-button>
      </div>

      <a-modal v-model:visible="visible" title="Thêm lớp" @ok="handleOk" class="input-form" cancelText="Huỷ"
        okText="Đồng ý">
        <input type="text" placeholder="Nhập tên lớp..." class="input-class" v-model="classNameIp">
      </a-modal>

      <a-table bordered :data-source="listClass" :columns="columns">
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
          <template v-else-if="column.dataIndex === 'operation'">
            <a class="btn-view" @click="goToCpn(record.name)">Xem</a>
            <a-popconfirm v-if="listClass.length" title="Bạn có muốn xóa không?" @click="onDelete(record.key)"
              cancelText="Huỷ" okText="Đồng ý">
              <a class="btn-delete">Xóa</a>
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
import router from '@/router';
import { message } from 'ant-design-vue'


const studentStore = useStore()
const classStore = useStore()
// classStore.get_data_class()
const { listClass } = storeToRefs(classStore)

const columns = [{
  title: 'STT',
  dataIndex: 'stt',
  width: '20%',
},
{
  title: 'Tên lớp',
  dataIndex: 'name',
  width: '60%'
},
{
  title: '',
  dataIndex: 'operation',
  with: '30%'
}];
// const listClass = ref([{
//   key: '0',
//   stt: 1,
//   name: 'Lớp 1A',
// }, {
//   key: '1',
//   stt: 2,
//   name: 'Lớp 1B',
// }]);
const classNameIp = ref('')
const searchIp = ref('')
const visible = ref(false)
const count = computed(() => listClass.value.length + 1)
const editableData = reactive({});

const edit = key => {
  editableData[key] = cloneDeep(listClass.value.filter(item => key === item.key)[0]);
};

const save = key => {
  classStore.edit_class(editableData[key])
  Object.assign(listClass.value.filter(item => key === item.key)[0], editableData[key]);
  delete editableData[key];

}

const onDelete = key => {
  listClass.value = listClass.value.filter(item => item.key !== key)
  listClass.value = listClass.value.map((i, index) => ({ key: i.key, name: i.name, stt: index + 1 }))
  classStore.delete_class(key)
}
const listNameClass = ref(listClass.value.map(i => i.name))
const checked = computed(() => listNameClass.value.includes(classNameIp.value))
// thông báo lớp đã tồn tại
const error = () => {
  message.error('Lớp đã tồn tại', 3)
}
message.config({ top: '130px' })
// thêm lớp
const handleOk = () => {
  if (checked.value) {
    error()
  } else {
    const newClass = {
      key: count.value,
      stt: count.value,
      name: classNameIp.value
    }
    listClass.value.unshift(newClass)
    classStore.add_class(classNameIp.value)
    setTimeout(() => {
      classStore.get_data_class()
    }, 1200)
  }
  classNameIp.value = ''
  visible.value = false
}
// mở modal thêm lớp
const handleAdd = () => {
  visible.value = true
}
const search = () => {
  classStore.get_data_class()
  const fc = () => {
    listClass.value = listClass.value.filter(i => i.name.toLowerCase().includes(searchIp.value.toLowerCase()))
  }
  setTimeout(fc, 1000)

}
const goToCpn = (tenLop) => {
  router.push({ path: '/danh_sach_hoc_sinh' })
  studentStore.filterStudent(tenLop)  
}



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
    border: 1px solid #999999;
    min-width: 100px;
  }
  .search-form button {
    margin-left: 4%;
    width: 78px;
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
  transform: translateX(-50%);
}

.btn-view {}

.btn-delete {
  color: rgb(201, 15, 15);
  margin-left: 85px;
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
    padding: 1px 0px;
  }
  .btn-goTop {
    display: none;
  }
  .btn-delete {
  color: rgb(201, 15, 15);
  margin-left: 25px;
  }
}
</style>
