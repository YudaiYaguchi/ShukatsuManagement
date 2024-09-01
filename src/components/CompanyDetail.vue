<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';
import Menu from './Menu.vue'
import InterviewInfo from './InterviewInfo.vue';
import StarRating from 'vue-star-rating';

// Propsの定義
const props = defineProps({
  id: String,
});

// Vue Routerからのルートパラメータ取得
const route = useRoute();

// 変数の初期化
const companyInfo = ref({});
const companies = ref([]);
const company = ref('');
const flag = ref(true);
const clickCompanyFlag = ref(true);
const clickInterviewFlag = ref(false);
const rating = ref(0); // 初期評価
let rate = ref(0);

// 特定の企業情報を取得する関数
const getCompanyInfo = async (id) => {
  let { data, error } = await supabase
    .from('CompaniesName')
    .select('*')
    .eq('id', id)
    .single();
  if (!error) {
    companyInfo.value = data || {};  // データがnullの場合は空オブジェクトを設定
  }
};

// コンポーネントがマウントされたときに企業情報を取得
onMounted(() => {
  const id = route.params.id;
  getCompanyInfo(id);
});

// フォームサブミット時にURLを更新する関数
const addCompanyURL = async (event) => {
  event.preventDefault();
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
      const index = companies.value.findIndex(c => c.id === companyInfo.value.id);
      if (index !== -1) {
        companies.value[index] = data[0];
      } else {
        companies.value.push(data[0]);
      }
      company.value = '';
    }
  } else {
    alert('企業のマイページURLを入力してください。');
  }
};

// 企業情報を更新する関数
const addCompanyInfo = async (event) => {
  event.preventDefault();
  const { data, error } = await supabase
    .from('CompaniesName')
    .update({ companyInfo: companyInfo.value.companyInfo })
    .eq('id', companyInfo.value.id)
    .select('*');

  if (error) {
    console.error('Error updating company info:', error);
  } else {
    console.log('Updated record:', data);
  }
};

const addCompanyES = async (event) => {
  event.preventDefault();
  const { data, error } = await supabase
    .from('CompaniesName')
    .update({ companyES: companyInfo.value.companyES })
    .eq('id', companyInfo.value.id)
    .select('*');

  if (error) {
    console.error('Error updating company ES:', error);
  } else {
    console.log('Updated record:', data);
  }
};


// 企業情報をコンソールに表示する関数
const getInfo = () => {
  console.log(companyInfo.value);
};

// タブの表示制御
const handleClickCompany = () => {
  clickCompanyFlag.value = true;
  clickInterviewFlag.value = false;
};

const handleClickInterview = () => {
  clickInterviewFlag.value = true;
  clickCompanyFlag.value = false;
};

// 評価が変更されると呼ばれる関数
const setRating = (newRating) => {
  rating.value = newRating;
  console.log("選択された評価:", rating.value); // コンソールに評価を表示
};

</script>


<template>
  
  <Menu/>
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

  <div class="menu">
  <b>
    <span 
      @click="handleClickCompany" 
      :class="['menu-item', { active: clickCompanyFlag }]">
      企業情報
    </span>
    <span 
      @click="handleClickInterview" 
      :class="['menu-item', { active: clickInterviewFlag }]">
      面接情報
    </span>
  </b>
</div>

  
<div v-if="clickInterviewFlag " key="interview">
  <div>
  <InterviewInfo :id = "props.id"/>
  </div>
</div>  
<div class="form-container">
<div class="form-group">
    <div v-if="clickCompanyFlag">
    <label style="padding-top: 30px;">企業研究</label>
    <div v-if="companyInfo.companyInfo !== undefined">
      <form @submit="addCompanyInfo">
        <textarea class="input-box" @input="addCompanyInfo" v-model="companyInfo.companyInfo" placeholder="企業を研究して情報を残そう！！"></textarea>
      </form>
    </div>
  

    <div v-else>
      <div class="form-group">
      <form @submit="addCompanyInfo">
        <textarea class="input-box" @input="addCompanyInfo" v-model="companyInfo.companyInfo" placeholder="企業を研究して情報を残そう！！"></textarea>
      </form>
    </div>
</div>


<div class="form-group">
    <label style="padding-top: 30px;">ES（エントリーシート）</label>
    <div v-if="companyInfo.companyES !== undefined">
      <form @submit="addCompanyES">  
        <textarea class="input-box" @input="addCompanyES" v-model="companyInfo.companyES" placeholder="企業に提出したESを登録して振り返ろう！！"></textarea>
      </form>
    </div>
    
    <div v-else>
      <form @submit="addCompanyES">  
        <textarea class="input-box" @input="addCompanyES" v-model="companyInfo.companyES" placeholder="企業に提出したESを登録して振り返ろう！！"></textarea>
      </form>
    </div>
  </div>
</div>
</div>
</div>
</div>

  <p v-else>Loading...</p>
  
</template>

<style>


.form-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  margin: 0 auto;
}


.form-group {
  margin-bottom: 50px;
}

label {
  font-weight: bold;
  color: #0056b3; /* 青色 */
  margin-bottom: 5px;
  display: block;
}

.input-box {
  width: 100%;
  padding: 10px;
  border: 2px solid #007BFF; /* 青色 */
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: #f9f9f9; /* 淡い背景色 */
}

.input-box:focus {
  outline: none;
  border-color: #0056b3; /* 濃い青色 */
  background-color: #e7f3ff; /* フォーカス時の背景色 */
}

.submit-button {
  background-color: #007BFF; /* 青色 */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3; /* ホバー時の濃い青色 */
}




/* 下線を付けるクラス */
.active {
  text-decoration: underline;
  color: #007bff; /* アクティブなアイテムは青色に */
}
textarea {
  width: 95%;
  height: 500px;
}

.custom-link {
  color: black;
  text-decoration: none;
}
.rating-container {
  display: flex;
  align-items: center;
  gap: 10px; /* 各要素間のスペースを調整します。必要に応じて変更してください。 */
}
.menu {
  display: flex;
  justify-content: center;
  padding: 10px;
  border-radius: 8px; /* 角を丸く */
}

.menu b {
  display: flex;
  gap: 70px; /* アイテム間にスペースを入れる */
  font-weight: 600; /* 太めのフォント */
}

.menu-item {
  cursor: pointer;
  font-size: 18px;
  color: #333; /* 濃いグレーの文字色 */
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease; /* スムーズなトランジション */
}

.menu-item:hover {
  background-color: #007bff; /* ホバー時に背景色を青に */
  color: #fff; /* ホバー時に文字色を白に */
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3); /* ホバー時のシャドウ */
}



</style>