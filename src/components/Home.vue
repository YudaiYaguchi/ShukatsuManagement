<script setup>
import { ref } from 'vue';
import { provide } from 'vue';
import { supabase } from '../supabase'
import Search from './Search.vue'
import Menu from './Menu.vue'

let id = 0;
const companiesName = ref([]);
provide("companiesName",companiesName);
const companyName = ref('');
const companyInfo = ref(null); // ref(null)に変更
provide("companyInfo",companyInfo);





const getCompanyName = async () => {
  let {data, error, status } = await supabase.from('CompaniesName').select('*');
  console.log(data);
  companiesName.value = data; 
  
};

getCompanyName();


const addCompany = async () => {
    console.log(companyName.value);
    if(companyName.value.length != 0 && companyName.value != '　' && companyName.value != ' '){
        const {data, error} = await supabase.from('CompaniesName').insert([{companyName: companyName.value}]) .select('*');
        console.log(data);
        companiesName.value.push(data);
        companyName.value = '';
    }else{
        alert('企業名を入力してください。');
    }
};

const deleteCompanyName = async (id) => {
  const { data, error } = await supabase
    .from('CompaniesName')
    .delete()
    .eq('id', id)
    .select('id');
  const index = companiesName.value.findIndex((companyName) => companyName.id === data[0].id);
  companiesName.value.splice(index, 1);
};

const updateCompanyName = async (companyName) => {
  const { data, error } = await supabase
    .from('CompaniesName')
    .update({ completed: companyName.completed })
    .eq('id', companyName.id)
    .select('*');
  const currentComapnyName = companiesName.value.find((companyName) => companyName.id === data[0].id);
  currentComapnyName.completed = data[0].completed;
};


</script>

<template>
   <Menu/>
  <div class="head">
  <h1>就活管理</h1>
  <p>ログインユーザー：○○さん</p>
  <form @submit="addCompany" >
    <div>
      <input v-model="companyName" placeholder="企業の名前を入力" /> <button type="submit">企業を登録</button>
    </div> 
  </form>
  
  <Search/><!--Search.vue-->



<div class="companyName">
  <ul>
    <li v-for="company in companiesName" :key="company.id" :style="company.completed ? 'text-decoration:line-through;' : ''">
      <!--<span><input type="checkbox" v-model="company.completed" @change="updateCompanyName(company)" /></span>-->
      <span><router-link :to="'/company-detail/' + company.id">{{ company.companyName }}</router-link>　</span>
      <button class="button" @click="deleteCompanyName(company.id)">削除</button>
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
.button {
    color: black;
}

.head{
  background: #f0f2fd;;
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
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}




.companyName ul,.companyName ol {
  padding: 0;
  position: relative;
}

.companyName ul li,.companyName ol li {
  color: #2d8fdd;
  border-left: solid 6px #2d8fdd;/*左側の線*/
  background: #f1f8ff;/*背景色*/
  margin-bottom: 3px;/*下のバーとの余白*/
   line-height: 1.5;
  padding: 0.5em;
  list-style-type: none!important;/*ポチ消す*/
}


</style>