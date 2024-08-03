<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';

const route = useRoute();
const companyInfo = ref(null);
const companies = ref([]);
const company = ref('');

// 特定の企業情報を取得する関数
const getCompanyInfo = async (id) => {
  let { data, error } = await supabase
    .from('CompaniesName')
    .select('*')
    .eq('id', id)
    .single();
  if (!error) {
    companyInfo.value = data;
  }
};

// コンポーネントがマウントされたときに企業情報を取得
onMounted(() => {
  const id = route.params.id;
  getCompanyInfo(id);
});

// フォームサブミット時にURLを更新する関数
const addCompanyURL = async (event) => {
  event.preventDefault();  // フォームのデフォルト動作を防ぐ
  console.log(company.value);
  if (company.value.trim().length !== 0) {
    const { data, error } = await supabase
      .from('CompaniesName')
      .update({ companyURL: company.value })
      .eq('id', companyInfo.value.id)
      .select('*');
      
    if (error) {
      console.error('Error updating company URL:', error);
    } else {
      console.log('Updated record:', data);
      // companies配列を更新
      const index = companies.value.findIndex(c => c.id === companyInfo.value.id);
      if (index !== -1) {
        companies.value[index] = data[0]; // 更新されたデータを反映
      } else {
        companies.value.push(data[0]); // 新しいデータを追加
      }
      company.value = '';
    }
  } else {
    alert('企業のマイページURLを入力してください。');
  }
};

// 企業情報をコンソールに表示する関数
const getInfo = () => {
  console.log(companyInfo.value);
};

</script>

<template>
  <div v-if="companyInfo">
    <h1>{{ companyInfo.companyName }}</h1>

    <form @submit="addCompanyURL">
      <div>
        <input v-model="company" placeholder="企業のマイページ等を登録"/><button type="submit">URLを登録</button>
      </div>
    </form>

      <p v-for="company in companies" :key="company.id">
        マイページURL：<a :href="company.companyURL" target="_blank">{{ company.companyName }}</a>
      </p>
    

    <p>企業情報</p>
    <textarea></textarea>
  </div>
  <p v-else>Loading...</p>
</template>

<style>
textarea {
  width: 50%;
  height: 300px;
}
</style>
