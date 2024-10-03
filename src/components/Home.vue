<script setup>
import { ref, onMounted, onUnmounted, provide,defineProps,watch } from 'vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import Search from './Search.vue';
import Menu from './Menu.vue';
import Schedule from './Schedule.vue';
import Calendar from './Calendar.vue';

// propsを定義
const props = defineProps(['userName','userId']);

const router = useRouter();
const userId = props.userId;
const userName = props.userName;
const loginStatus = ref(false);
let getUserFlag = false;
provide('userId', userId);
provide('userName', userName);


let timeoutId;
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


const getCompanyName = async () => {
  let { data, error, status } = await supabase.from('CompaniesName').select('*').eq('userId', props.userId);
  console.log("all data:",data);
  data.sort((a, b) => a.order - b.order);
  editFlag.value = data.map(() => false);
  companiesName.value = data;

};

const getUser = async () =>{
  let { data, error, status } = await supabase
    .from('Users')
    .select('*')
    .eq('id',props.userId)

  loginStatus.value = data[0].login;
  console.log("loginStatus:",loginStatus.value);
  console.log("data[0].login",data[0].login);
  if (data[0].login) {
    getCompanyName();  // userが存在し、loginがtrueなら実行
    getUserFlag = true;
  }else{
    screenTransition();
  }
}



onMounted(async () => {
  await getUser();  // ユーザー情報の取得を待つ
});


//getCompanyName();

// ページがリロードされたときにログアウトにする
window.addEventListener('beforeunload', (event) => {
  logoutUser();
  loginStatus.value = false
});

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


// 子コンポーネントからのデータを受け取ってcompaniesNameを更新
const updateCompaniesName = (newData) => {
  companiesName.value = newData;
};


const addCompany = async () => {
  if (companyName.value.length !== 0 && companyName.value.trim() !== '') {
    const { data, error } = await supabase
    .from('CompaniesName')
    .insert([{ companyName: companyName.value,
                userId: props.userId}])
    .select('*');

    companiesName.value.unshift(data[0]);
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
<div v-if="loginStatus">  
  <Menu :userId = "props.userId" :userName = "props.userName"/>
  <div class="head">
    <h1>就活管理</h1>
    <p>ログインユーザー：{{props.userName}}</p>
    <form @submit.prevent="addCompany">
      <div>
        <input v-model="companyName" placeholder="企業の名前を入力" /> 
        <button type="submit">企業を登録</button>
      </div> 
    </form>
    <Search :userId="props.userId" :userName="props.userName"/>
    <div class="companyName">
      <div>
        <b>
        <table>
          <tr>
            <td>企業名</td>
            <td>選考状況</td>
            <td>選考日付</td>
          </tr>
        </table>
      </b>
      </div>

      <!-- PC用のリスト -->
      <ul v-if="!isMobile">
        <li v-for="company in companiesName" :key="company.id" :style="company.completed ? 'text-decoration:line-through;' : ''">
          <div>
            企業名：<span><router-link :to="'/company-detail/' + props.userName + '/' + Number(props.userId)   + '/' + company.id">{{ company.companyName }}</router-link>　</span>
            <button v-if="getEditFlag(company.id)" class="button" @click="deleteCompanyName(company.id)">削除</button>
            <button class="textRight" @click="edit(company.id)"> 
              {{ getEditFlag(company.id) ? '完了' : '編集' }}
            </button>
          </div> 
          <div class="schedule">選考状況：<Schedule :companyId="company.id" :isEditing="getEditFlag(company.id)" class="schedule"/></div>
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
            企業名：<span><router-link :to="'/company-detail/' + props.userName + '/' + Number(props.userId)   + '/' + company.id">{{ company.companyName }}</router-link>　</span>
            <button v-if="getEditFlag(company.id)" class="button" @click="deleteCompanyName(company.id)">削除</button>
            <button  class="textRight" @click="edit(company.id)"> 
              {{ getEditFlag(company.id) ? '完了' : '編集' }}
            </button>
          </div>
          <div class="schedule">選考状況：<Schedule :companyId="company.id" :isEditing="getEditFlag(company.id)" /></div>
           <div class="calrendar">
            <div class="date">選考日付：</div>
            <Calendar :companyId="company.id" :isEditing="getEditFlag(company.id)" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>  
<div v-else>
  <p>Loading</p>
</div>
</template>



<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
.logout-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}

p {
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.back-link {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
}

.back-link:hover {
  text-decoration: underline;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

.schedule {
  padding-top: 0px;
  display: flex;
  flex-direction: row; /* Flex items を一行に並べる */
  white-space: nowrap; /* 改行を防ぐ */
}

.textRight {
  float: right;
}

.date {
  display: flex;
} 

.calrendar {
  display: flex;
}

.button {
  color: #007bff; /* 青色のボタン */
  background: none;
  border: 1px solid #007bff;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.button:hover {
  background-color: #007bff; /* ホバー時に背景色を青に */
  color: #fff; /* ホバー時に文字色を白に */
}

.head {
  background: #fff; /* ヘッダーの背景を白に */
  width: 100%;
  padding: 0.5em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 軽いシャドウを追加 */
  border-bottom: 2px solid #e0e0e0; /* 薄いグレーのボーダーを追加 */
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
  border: 5px solid #1915ee;
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
  color: #333; /* リスト項目の文字色を濃いグレーに */
  border-left: solid 6px #007bff; /* 左側のボーダーを青色に */
  background: #fff; /* 背景色を白に */
  margin-bottom: 7px;
  line-height: 2.0;
  padding: 1.0em;
  list-style-type: none!important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); /* 軽いシャドウを追加 */
  border-radius: 15px; /* 角を少し丸める */
}

.companyName table {
  width: 100%;
  border-collapse: collapse;
}

.companyName td {
  text-align: center;
  padding: 8px;
}

.companyName td:first-child,
.companyName td:nth-child(2),
.companyName td:last-child {
  width: 33.33%;
  color: #333; /* 文字色を濃いグレーに */
}

input[type="text"] {
  padding: 10px;
  width: 60%;
  border: 1px solid #ccc; /* 薄いグレーのボーダー */
  border-radius: 4px; /* 角を丸くする */
  margin-right: 10px;
}

button[type="submit"] {
  padding: 4px 20px;
  background-color: #007bff; /* 青色のボタン */
  color: #fff; /* ボタンの文字色を白に */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #0056b3; /* ホバー時に色を濃くする */
}

form div {
  margin-bottom: 20px; /* フォーム内の要素に余白を追加 */
}

p {
  font-size: 16px;
  color: #333; /* 文字色は濃いグレー */
}
</style>