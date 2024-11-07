<script setup>
import { ref, onMounted ,defineProps,provide,watch} from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import Menu from './Menu.vue'
import InterviewInfo from './InterviewInfo.vue';


const props = defineProps({
  userName: String,
  userId: Number, // userIdも数値か文字列で受け取れるようにする
  id: Number, // idは数値でも文字列でもOKにする
  
});


// Vue Routerからのルートパラメータ取得
const route = useRoute();
const userId = props.userId
provide('userId', userId);
provide('userName', props.userName);

// 変数の初期化
const companyInfo = ref({});
const companies = ref([]);
const company = ref('');
const flag = ref(true);
const clickCompanyFlag = ref(true);
const clickInterviewFlag = ref(false);
const rating = ref(0); // 初期評価

let allData ={};
const loginStatus = ref(false);
let getUserFlag = false;
const router = useRouter();
let timeoutId;



const update = async (update_data) => {
  // まず、配列の順番に基づいて order を設定
  update_data.forEach((record, index) => {
    record.order = index + 1; // 1から始まる順番を設定
  });

  // 各レコードの order を更新
  for (const record of update_data) {
    const { data, error } = await supabase
      .from('CompaniesName')
      .update({ order: record.order }) // order フィールドを更新
      .eq('id', record.id)
      .select('*');
  }

  // order フィールドでレコードを取得してソート
  const { data: sortedData, error: sortError } = await supabase
    .from('CompaniesName')
    .select('*')
    .order('order', { ascending: true }); // order フィールドで昇順にソート
};

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
  
  const currentDate = new Date().toISOString();
  console.log(currentDate); 

  const { data_update_at } = await supabase
    .from('CompaniesName') // テーブル名のキャピタライゼーションに注意
    .update({ updated_at : currentDate }) 
    .eq('id', id)
    .select('*');

  let { data: allData } = await supabase
    .from('CompaniesName')
    .select('*')
    .eq('userId',props.userId);
    
  
  console.log('All Data:',allData);
  allData.sort((a, b) => {
    // Dateオブジェクトに変換し、getTimeでミリ秒に変換
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
});

    console.log('Sort All Data:',allData);

   update(allData);
 
};

watch(() => loginStatus.value,(newValue) => {
    console.log("watch triggered, loginStatus changed:", newValue);
    console.log("getUserFlag:",getUserFlag);
    if (newValue === false && getUserFlag ) {
      // ログイン状態がfalseになったらログアウト画面に遷移
      router.push({
        name: 'Logout',
      });
    }
  },
  { immediate: true } // 初期化時に一度実行するためのオプション
);

const screenTransition = () =>{
  router.push({
         name: 'Logout',
  });
}

const getUser = async () => {//ユーザーのログイン状況
  let { data, error, status } = await supabase
    .from('Users')
    .select('*')
    .eq('id',props.userId)

  loginStatus.value = data[0].login;
  console.log("loginStatus:",loginStatus.value);
  console.log("data[0].login",data[0].login);
  if (data[0].login === false) {
    screenTransition();
  }
}

const logoutUser = async () => {
  const { data, error } = await supabase
    .from('Users')
    .update({ login: false })
    .eq('id', props.userId);
  
  screenTransition();
};

function resetTimeout() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(logoutUser, 3600000);
}

// 最初のタイムアウトをセット
resetTimeout();

// ユーザーの操作があった場合にタイムアウトをリセットする
document.addEventListener('click', resetTimeout);
document.addEventListener('keydown', resetTimeout);


// コンポーネントがマウントされたときに企業情報を取得
onMounted(() => {
  const id = route.params.id;
  getCompanyInfo(id);
  getUser();
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


</script>


<template>
  
  <Menu/>
  <div v-if="companyInfo">
    <h1><router-link :to="'/' + props.userName + '/' + props.userId" class="custom-link">{{ companyInfo.companyName }}</router-link></h1>
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
  <InterviewInfo :id = "Number(props.id)"/>
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