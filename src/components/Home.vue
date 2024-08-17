<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue';
import { supabase } from '../supabase';
import Search from './Search.vue';
import Menu from './Menu.vue';
import Schedule from './Schedule.vue';
import Calendar from './Calendar.vue';

let id = 0;
const companiesName = ref([]);
provide("companiesName", companiesName);
const companyName = ref('');
const companyInfo = ref(null);
provide("companyInfo", companyInfo);

const isMobile = ref(false);
const editFlag = ref([]); 
provide("editFlag", editFlag);

let editId = ref(-1);
provide("editId", editId);

const getCompanyName = async () => {
  let { data, error, status } = await supabase.from('CompaniesName').select('*');
  console.log(data);
  editFlag.value = data.map(() => false);
  companiesName.value = data;
};

getCompanyName();

const addCompany = async () => {
  if (companyName.value.length !== 0 && companyName.value.trim() !== '') {
    const { data, error } = await supabase.from('CompaniesName').insert([{ companyName: companyName.value }]).select('*');
    companiesName.value.push(data[0]);
    editFlag.value.push(false);
    companyName.value = '';
  } else {
    alert('企業名を入力してください。');
  }
};

const deleteCompanyName = async (id) => {
  const result = window.confirm('本当に削除してもよろしいですか？\n削除された企業情報は復元できません。');
if(result){
  const { data, error } = await supabase.from('CompaniesName').delete().eq('id', id).select('id');
  const index = companiesName.value.findIndex((company) => company.id === data[0].id);
  companiesName.value.splice(index, 1);
  editFlag.value.splice(index, 1);
}
};

const updateCompanyName = async (companyName) => {
  const { data, error } = await supabase.from('CompaniesName').update({ completed: companyName.completed }).eq('id', companyName.id).select('*');
  const index = companiesName.value.findIndex((company) => company.id === data[0].id);
  companiesName.value[index].completed = data[0].completed;
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const edit = (id) => {
  const index = companiesName.value.findIndex((company) => company.id === id);
  editFlag.value[index] = !editFlag.value[index];
  editId.value = id; // ここで編集する企業の id をセット
};

const getEditFlag = (id) => {
  const index = companiesName.value.findIndex((company) => company.id === id);
  return editFlag.value[index];
};
</script>

<template>
  <Menu/>
  <div class="head">
    <h1>就活管理</h1>
    <p>ログインユーザー：○○さん</p>
    <form @submit.prevent="addCompany">
      <div>
        <input v-model="companyName" placeholder="企業の名前を入力" /> 
        <button type="submit">企業を登録</button>
      </div> 
    </form>
    <Search/>
    <div class="companyName">
      <div>
        <table>
          <tr>
            <td>企業名</td>
            <td>選考状況</td>
            <td>選考日付</td>
          </tr>
        </table>
      </div>

      <!-- PC用のリスト -->
      <ul v-if="!isMobile">
        <li v-for="company in companiesName" :key="company.id" :style="company.completed ? 'text-decoration:line-through;' : ''">
          <div>
            企業名：<span><router-link :to="'/company-detail/' + company.id">{{ company.companyName }}</router-link>　</span>
            <button v-if="getEditFlag(company.id)" class="button" @click="deleteCompanyName(company.id)">削除</button>
            <button class="textRight" @click="edit(company.id)"> 
              {{ getEditFlag(company.id) ? '完了' : '編集' }}
            </button>
          </div> 
          <div>選考状況：<Schedule :isEditing="getEditFlag(company.id)" class="schedule"/></div>
          <div class="calrendar">
            <div class="date">選考日付：</div>
            <Calendar :companyId="company.id" :isEditing="getEditFlag(company.id)" />
          </div>
        </li>
      </ul>
  
      
      <!-- スマホ用のリスト -->
      <ul v-else>
        <li v-for="company in companiesName" :key="company.id" :style="company.completed ? 'text-decoration:line-through;' : ''">
          <div>
            企業名：<span><router-link :to="'/company-detail/' + company.id">{{ company.companyName }}</router-link>　</span>
            <button v-if="getEditFlag(company.id)" class="button" @click="deleteCompanyName(company.id)">削除</button>
            <button  class="textRight" @click="edit(company.id)"> 
              {{ getEditFlag(company.id) ? '完了' : '編集' }}
            </button>
          </div>
          <div class="schedule">選考状況：<Schedule :isEditing="getEditFlag(company.id)" class="schedule"/></div>
           <div class="calrendar">
            <div class="date">選考日付：</div>
            <Calendar :companyId="company.id" :isEditing="getEditFlag(company.id)" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>



<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
.schedule {
  display: flex;
  flex-direction: row; /* Flex items を一行に並べる */
  white-space: nowrap; /* 改行を防ぐ */
}
.textRight {
  float: right;
}

.date{
  display: flex;
  padding-top: 7px;
} 

.calrendar{
  display: flex;
}
.button {
  color: black;
}

.head {
  background: #f0f2fd;
  width: 100%;
  padding: 0.1%;
}

h1 {
  position: relative;
  color: #150063;
  font-size: 35px;
  padding: 10px 0;
  text-align: center;
  margin: 1.5em 0;
}

h1:before {
  content: "";
  position: absolute;
  top: -6px;
  left: 50%;
  width: 40%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid #f70707;
  border-left-color: transparent;
  border-right-color: transparent;
  transform: translateX(-50%);
}

.companyName ul,
.companyName ol {
  padding: 0;
  position: relative;
}

.companyName ul li,
.companyName ol li {
  color: #03080c;
  border-left: solid 6px #2d8fdd;
  background: #f1f8ff;
  margin-bottom: 3px;
  line-height: 1.5;
  padding: 0.5em;
  list-style-type: none!important;
}

.companyName table {
  width: 100%;
  border-collapse: collapse;
}

.companyName td {
  text-align: center;
  padding: 1px;
}

.companyName td:first-child,
.companyName td:nth-child(2),
.companyName td:last-child {
  width: 33.33%;
}
</style>