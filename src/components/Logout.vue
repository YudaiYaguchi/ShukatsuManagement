<script setup>
// 特に追加のスクリプトは不要です
</script>

<template>
  <div class="logout-container">
    <h1>ログアウト</h1>
    <p>正常にログアウトしました。</p>
    <p>
      <span>
        <a href="/" class="back-link">ログイン画面に戻る</a>
      </span>
    </p>
  </div>
</template>

<style>
.logout-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff; /* 白い背景色 */
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #4A90E2; /* 青ベースの背景色 */
}

h1 {
  font-size: 2rem;
  color: white; /* 白い文字色 */
  margin-bottom: 1.5rem;
}

p {
  color: white; /* 白い文字色 */
  font-size: 1rem;
  margin-bottom: 1rem;
}

a.back-link {
  color: #ffffff; /* 白いリンク色 */
  font-weight: bold;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  background-color: #006bb6; /* 濃い青のボタン */
  transition: background-color 0.3s ease;
}

a.back-link:hover {
  background-color: #005494; /* ホバー時に少し暗く */
}
</style>
