<template>
    <div>
      <h1>企業名：LINEヤフー株式会社</h1>
      <p>選考種類：インターン</p>
      <p>選考結果：合格</p>
      <p>選考状況：webテスト(適性検査)</p>
      <p>選考日付：2024/09/13 20:35</p>
  
      <!-- モーダルを表示するボタン -->
      <button @click="openModal">入力を促す</button>
  
      <!-- モーダル -->
      <div v-if="isModalVisible" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h2>情報を入力してください</h2>
          <label>お名前:</label><br>
          <input v-model="userName" placeholder="お名前を入力"><br><br>
  
          <label>テスト結果:</label><br>
          <input v-model="testResult" placeholder="テスト結果を入力"><br><br>
  
          <button @click="submitInput">送信</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // モーダルの表示状態とユーザー入力の状態を管理
  const isModalVisible = ref(false)
  const userName = ref('')
  const testResult = ref('')
  
  // モーダルを開く関数
  const openModal = () => {
    isModalVisible.value = true
  }
  
  // モーダルを閉じる関数
  const closeModal = () => {
    isModalVisible.value = false
  }
  
  // 入力内容を送信する関数
  const submitInput = () => {
    if (userName.value && testResult.value) {
      alert(`${userName.value}さん、テスト結果は${testResult.value}です。`)
      closeModal() // モーダルを閉じる
    } else {
      alert("全てのフィールドを入力してください。")
    }
  }
  </script>
  
  <style scoped>
  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background-color: #fff;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }
  
  .close {
    float: right;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
  }
  </style>
  