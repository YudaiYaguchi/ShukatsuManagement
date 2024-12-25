<script setup>
import { ref } from 'vue'; // refのインポートを忘れずに
import { supabase } from '../supabase'; // supabaseの正しいパスを確認してください

const companiesName = ref([]);

const getCompanyName = async () => {
  let { data, error, status } = await supabase
    .from('CompaniesName')
    .select('*')
    .eq('userId', 1);

  if (error) {
    console.error('Error fetching company data:', error);
    return;
  }

  companiesName.value = data; // .valueを通じて値を更新
};

// テキスト内の改行文字をHTMLの<br>に変換
const formatText = (text) => {
  return text ? text.replace(/\n/g, '<br>') : '';
};

getCompanyName();
</script>

<template>
  <ul>
    <li v-for="company in companiesName" :key="company.id" class="company-item">
      <h1>{{ company.companyName }}</h1>
      <h2>企業研究</h2>
      <p v-html="formatText(company.companyInfo)"></p>
      <h2>エントリーシート</h2>
      <p v-html="formatText(company.companyES)"></p>
      <h2>面接内容</h2>
      <p v-html="formatText(company.content)"></p>
      <h2>面接自己評価</h2>
      <p v-html="formatText(company.evaluation)"></p>
      <h2>反省点</h2>
      <p v-html="formatText(company.reflection)"></p>
    </li>
  </ul>
</template>


<style>
.company-item {
  margin-bottom: 20px; /* 各リストアイテム間のスペース */
}
.company-item h1 {
  margin-bottom: 10px; /* タイトル下のスペース */
}
.company-item p {
  margin-bottom: 15px; /* 各段落間のスペース */
}
</style>