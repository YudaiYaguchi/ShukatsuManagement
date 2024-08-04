<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';

const route = useRoute();
const companyInfo = ref(null);
const companiesInfo = ref([]);
const companies = ref([]);
const company = ref('');
const flag = ref(true);
const message = ref('登録されました');
const textFlag = ref(false);
const textFlagCompanyES = ref(false);


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
    
    companyInfo.value.companyURL = company.value;
    flag.value = false;
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

const addCompanyInfo = async (event) =>{
  event.preventDefault();  // フォームのデフォルト動作を防ぐ
    console.log("addCompanyInfo : " + companyInfo.value.companyInfo);

    const { data, error } = await supabase
      .from('CompaniesName')
      .update({ companyInfo: companyInfo.value.companyInfo })
      .eq('id', companyInfo.value.id)
      .select('*');

    if (error) {
      console.error('Error updating company URL:', error);
    } else {
      console.log('Updated record:', data);
    }
}

const addCompanyES = async (event) =>{
  event.preventDefault();  // フォームのデフォルト動作を防ぐ
    console.log("addCompanyES : " + companyInfo.value.companyES);

    const { data, error } = await supabase
      .from('CompaniesName')
      .update({ companyES: companyInfo.value.companyES })
      .eq('id', companyInfo.value.id)
      .select('*');

    if (error) {
      console.error('Error updating company URL:', error);
    } else {
      console.log('Updated record:', data);
    }
}


const tempText = ()=>{
  textFlag.value = true;
  window.setTimeout(() => {
        //alert("3秒経過しました");
        textFlag.value = false;
    }, 3000);

}

const tempTextCompanyES = ()=>{
  textFlagCompanyES.value = true;
  window.setTimeout(() => {
        //alert("3秒経過しました");
        textFlagCompanyES.value = false;
    }, 3000);

}

// 企業情報をコンソールに表示する関数
const getInfo = () => {
  console.log(companyInfo.value);
};

</script>

<template>
  <div v-if="companyInfo">
    <h1><router-link :to="'/'" class="custom-link">{{ companyInfo.companyName }}</router-link></h1>
    <form @submit="addCompanyURL">
      <div>
        <input v-model="company" placeholder="企業のマイページ等を登録"/><button type="submit">URLを登録</button>
      </div>
    </form>

    <div v-if="companyInfo.companyURL">
      <p>
        マイページURL：<a :href="companyInfo.companyURL" target="_blank">{{ companyInfo.companyName }}</a>
      </p>
    </div>
    <p v-else>マイページURL：未登録</p>
    
    <p>企業研究</p>
    <div v-if="companyInfo.companyInfo !== undefined">
      <form @submit="addCompanyInfo">
        <textarea v-model="companyInfo.companyInfo" placeholder="企業を研究して情報を残そう！！"></textarea>
        <p>
          <button type="submit" @click="tempText">企業研究を登録</button>
          <em v-if="textFlag">　企業研究が{{ message }}</em>
        </p>
      </form>
    </div>
    <div v-else>
      <form @submit="addCompanyInfo">
        <textarea v-model="companyInfo.companyInfo" placeholder="企業を研究して情報を残そう！！"></textarea>
        <p>
          <button type="submit" @click="tempText">企業研究を登録</button>
          <em v-if="textFlag">　企業研究が{{ message }}</em>
        </p>
      </form>
    </div>

    <p>ES（エントリーシート）</p>
    <div v-if="companyInfo.companyES !== undefined">
      <form @submit="addCompanyES">  
        <textarea v-model="companyInfo.companyES" placeholder="企業に提出したESを登録して振り返ろう！！"></textarea>
        <p>
          <button type="submit" @click="tempTextCompanyES">ESを登録</button>
          <em v-if="textFlagCompanyES">　ESが{{ message }}</em>
        </p>
      </form>
    </div>
    <div v-else>
      <form @submit="addCompanyES">  
        <textarea v-model="companyInfo.companyES" placeholder="企業に提出したESを登録して振り返ろう！！"></textarea>
        <p>
          <button type="submit" @click="tempTextCompanyES">ESを登録</button>
          <em v-if="textFlagCompanyES">　ESが{{ message }}</em>
        </p>
      </form>
    </div>
  </div>
  <p v-else>Loading...</p>
</template>

<style>
textarea {
  width: 50%;
  height: 300px;
}

.custom-link {
  color: black;
  text-decoration: none;
}
</style>