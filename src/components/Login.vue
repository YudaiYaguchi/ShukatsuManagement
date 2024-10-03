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



const getUsers = async () => {
    let { data, error, status } = await supabase.from('Users').select('*');
  // console.log("all Users:",data);
  users.value = data;
  // console.log("name:", users.value[0].name);
};

getUsers();

const createUser = async (userName,userPassword) => {
  const { data, error } = await supabase
        .from('Users')
        .insert([{ 
          name: userName, 
          password: userPassword,
          login: true
        }])

}

const findUser = async () =>{
  let { data, error, status } = await supabase
    .from('Users')
    .select('*')
    .eq('name', userName.value)        // userName に一致するユーザー
    .eq('password', userPassword.value); // userPassword に一致するユーザー
  
    return data;
}

const updateUser = async () => {
//  console.log("userId.value:",userId.value);
 const { data, error } = await supabase
   .from('Users')
   .update({ login: true })
   .eq('id', userId.value)
   .select('*');

};


const  doLogin = async () => {
    // console.log("Username:", userName.value);
    // console.log("Password:", userPassword.value);
   
    for(let i = 0; i < users.value.length; i++) {
        console.log("pass:",users.value[i].password);
      if(users.value[i].password === userPassword.value && users.value[i].name === userName.value){
        //  alert("ログイン\nUsername：" + userName.value + "\nPassword："+ userPassword.value);
         existingUserFlag.value = true;
         userId.value = Number(users.value[i].id);
         updateUser();

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
        alert("新規ユーザーが作成されました。");
    
        createUser(userName.value,userPassword.value);
        const newUser = await findUser();

        // console.log("newUser:",newUser);
        router.push({ 
          name: 'Home', 
          params: { 
            userId: Number(newUser[0].id), 
            userName: newUser[0].name 
          } 
        });
    }
    
    

}





</script>
<template>
  <div class="login-wrapper"> 
    <div class="container">
      <h1>就活管理</h1> <!-- h1をcontainer内に移動 -->
      <form @submit.prevent="doLogin">
        <p class="fsize">ログイン画面</p>
        <input type="text" placeholder="Username" v-model="userName">
        <input type="password" placeholder="Password" v-model="userPassword" />
        <button type="submit">ログイン</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* h1のスタイルをそのまま維持 */
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

/* 全体のレイアウト */
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
