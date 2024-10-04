<script setup>
import { provide, ref } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';
import Home from  './Home.vue'


const users = ref([]);
const userId = ref(-1);
const userName = ref("");
const userPassword = ref("");
const router = useRouter();
let existingUserFlag = ref(false);

const analytics = async() =>{
  let { data, error, status } = await supabase.from('Analytics').select('*');
  await supabase
   .from('Analytics')
   .update({
      total_login: data[0].total_login + 1,
      total_user: users.value.length
   })
   .eq('id', 0)
   .select('*');
}



const getUsers = async () => {
    let { data, error, status } = await supabase.from('Users').select('*');
    users.value = data;
};

getUsers();


const updateUser = async (index) => {
 const { data, error } = await supabase
   .from('Users')
   .update({
      login: true, 
      loginCount: Number(users.value[index].loginCount) + 1 
   })
   .eq('id', userId.value)
   .select('*');
   
};


const  doLogin = async () => {
    for(let i = 0; i < users.value.length; i++) {
      if(users.value[i].password === userPassword.value && users.value[i].name === userName.value){
         existingUserFlag.value = true;
         userId.value = Number(users.value[i].id);
         updateUser(i);
         analytics();
         router.push({ 
          name: 'Home', 
          params: { 
            userId: Number(userId.value), 
            userName: users.value[i].name 
          } 
        });
        break;
      }
    }

    if(userName.value.length === 0 || userPassword.value.length === 0){
        alert("UsernameまたはPasswordが入力されていません。");
    }else if(!existingUserFlag.value){
        alert("UsernameまたはPasswordが間違っています。") 
    }
}





</script>
<template>
  <div class="login-wrapper"> 
    <div class="container">
      <h1>就活管理</h1> 
      <form @submit.prevent="doLogin">
        <p class="fsize">ログイン</p>
        <input type="text" placeholder="Username" v-model="userName">
        <input type="password" placeholder="Password" v-model="userPassword" />
        <button type="submit">ログイン</button>
      </form>
      <router-link :to="'/create-user'">Create an account</router-link>
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
  background-color: #f4f6f9; /* 背景に淡いグレーを使用 */
  font-family: 'Arial', sans-serif;
}

/* コンテナ */
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
