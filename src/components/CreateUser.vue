<script setup>
import { provide, ref } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';
import Home from  './Home.vue'

const router   = useRouter();
const users    = ref([]);
const userId   = ref(-1);
const userName = ref("");
const userPassword    = ref("");
const confirmPassword = ref("");
let existingUserFlag  = false;


const analytics = async() =>{
  let { data, error, status } = await supabase.from('Analytics').select('*');
  await supabase
   .from('Analytics')
   .update({
      total_login: data[0].total_login + 1,
      total_user: data[0].total_user + 1
   })
   .eq('id', 0)
   .select('*');
}


const getUsers = async () => {
    let { data, error, status } = await supabase.from('Users').select('*');
    users.value = data;
};

getUsers();

const findUser = async () =>{
  let { data, error, status } = await supabase
    .from('Users')
    .select('*')
    .eq('name', userName.value)      
    .eq('password', userPassword.value); 
    return data;
}

const createUser = async (userName,userPassword) => {
  const { data, error } = await supabase
        .from('Users')
        .insert([{ 
          name: userName, 
          password: userPassword,
          login: true
        }])
}

const resetText  = () =>{
  userName.value        = "";
  userPassword.value    = "";
  confirmPassword.value = "";
  existingUserFlag      = false;
}

const doLogin = async() =>{
  for(let i=0;i<users.value.length;i++){
    if(userName.value === users.value[i].name){
      existingUserFlag = true;
      break;
    }
  }

  if(existingUserFlag){
    alert("Username:"+ userName.value + "は既に使用されています。");
  }else if(userName.value.length === 0 || userPassword.value.length === 0){
    alert("UsernameまたはPasswordが入力されていません。");
  }else if(userPassword.value !== confirmPassword.value){
    alert("PasswordとConfirm Passwordは同一のものを入力してください。");
  }else{
    alert("新規ユーザーが作成されました。");    
    createUser(userName.value,userPassword.value);
    const newUser = await findUser();
    analytics();
    router.push({ 
      name: 'Home', 
      params: { 
        userId: Number(newUser[0].id), 
        userName: newUser[0].name 
      } 
    });
  }

  resetText();
}
</script>

<template>
<div class="login-wrapper">
    <div class="container">
      <h1>就活管理</h1>
      <form @submit.prevent="doLogin">
        <p class="fsize" >新規ユーザー作成</p>
        <input type="text" placeholder="Username" v-model="userName">
        <input type="password" placeholder="Password" v-model="userPassword" />
        <input type="password" placeholder="Confirm Password" v-model="confirmPassword" />

        <button type="submit">アカウント作成</button>
      </form>
      <router-link :to="'/'">Login your account</router-link>
    </div>
  </div>
</template>

<style scoped>

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


.login-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f6f9;
  font-family: 'Arial', sans-serif;
}

.container {
  width: 350px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); /* しっかりとしたシャドウを追加 */
  text-align: center; /* テキストや要素の中央寄せ */
}

/* フォーム内のテキスト */
.fsize {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

/* フォームの入力フィールド */
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

/* フォーカス時のエフェクト */
input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #3498db; /* 青色の強調 */
  outline: none;
}

/* ログインボタン */
button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* ログインボタンホバー時 */
button[type="submit"]:hover {
  background-color: #2980b9; /* ホバー時の色 */
}

/* シャドウを追加 */
button[type="submit"]:active {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
</style>
