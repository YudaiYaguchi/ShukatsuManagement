<script setup>
import { inject, ref, watch } from 'vue';

const keyword = ref('');
const companiesName = inject("companiesName");
const hitCompaniesName = ref([]);

// 検索関数
const searchFunc = () => {
  if(keyword.value.length >= 1){
    hitCompaniesName.value = companiesName.value.filter(company =>
      company.companyName.includes(keyword.value)
    );
  }else{
    hitCompaniesName.value = []; // 配列の中を空にする
  }
};

// キーワードが変更されたときに検索関数を呼び出す
watch(keyword, searchFunc, { immediate: true });
</script>

<template>
  <div>
    <input type="text" v-model="keyword" placeholder="企業名を検索" />
  </div>
  <div>
    <table>
      <tr v-for="company in hitCompaniesName" :key="company.id">
        <td><router-link :to="'/company-detail/' + company.id">{{ company.companyName }}</router-link></td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
input {
  margin: 10px 0;
  padding: 8px;
  width: 260px;
  box-sizing: border-box;
  
}
table {
  color: black;
  width: 260px;
  border-collapse: collapse;
}
td {
  padding: 8px;
  border: 2px solid rgb(63, 79, 112);
  color: black;
}


</style>
