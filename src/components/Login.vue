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
  console.log("all Users:",data);
  users.value = data;
  console.log("name:", users.value[0].name);
};

getUsers();


const  doLogin = async () => {
    console.log("Username:", userName.value);
    console.log("Password:", userPassword.value);
   
    for(let i = 0; i < users.value.length; i++) {
        console.log("pass:",users.value[i].password);
      if(users.value[i].password === userPassword.value && users.value[i].name === userName.value){
        //  alert("ログイン\nUsername：" + userName.value + "\nPassword："+ userPassword.value);
         existingUserFlag.value = true;
         userId.value = users.value[i].id
         
         router.push({ 
          name: 'Home', 
          params: { 
            userId: userId.value, 
            userName: users.value[i].name 
          } 
        });
        break;
      }
    }

    if(userName.value.length === 0 && userPassword.value.length === 0){
        alert("UsernameまたはPasswordが入力されていません。");
    }else if(!existingUserFlag.value){
        const { data, error } = await supabase
        .from('Users')
        .insert([{ 
          name: userName.value, 
          password: userPassword.value 
        }])
        users.value = data;
        router.push({ name: 'Home' });
    }else {

    }
    
    
    

}





</script>
<template>
    <h1>就活管理</h1>
    <div class="container">
      <form @submit.prevent="doLogin">
        <p class="fsize">ログイン画面</p>
        <input type="text" placeholder="Username" v-model="userName">
        <input type="password" placeholder="Password" v-model="userPassword" />
        <button type="submit">ログイン</button>
      </form>
    </div>
  </template>


<style scoped>
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


.fsize{
  font-size: 24px;
  text-align: center;
}

.container {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
  
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

input[type="text"],
input[type="password"] {
  width: 93%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

</style>