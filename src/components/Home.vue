<script setup>
import { ref } from 'vue';
import { provide } from 'vue';
import { supabase } from '../supabase'
import Search from './Search.vue'

let id = 0;
const companiesName = ref([]);
provide("companiesName",companiesName);
const companyName = ref('');


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
        companiesName.value.unshift(data);
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
  <h1>就活管理</h1>
  <form @submit="addCompany">
    <div>
      <input v-model="companyName" /> <button type="submit">企業を登録</button>
    </div> 
  </form>
  
  <Search/>

  <ul>
    <li v-for="companyName in companiesName" :key="companyName.id" :style="companyName.completed ? 'text-decoration:line-through;' : ''">
      <span><input type="checkbox" v-model="companyName.completed" @change="updateCompanyName(companyName)" /></span>
      <span>{{ companyName.companyName }} 　 </span>
      <button class="button" @click="deleteCompanyName(companyName.id)">削除</button>
    </li>
  </ul>

</template>

<style scoped>
.button {
    color: black;
}
</style>