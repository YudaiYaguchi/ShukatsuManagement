<template>
    <h1>NotFound 404エラー</h1>
    <div class="container">
    <h1>ログアウト</h1>
  <p>正常にログアウトしました。</p>
  <p>
    <span>
      <a href="/" class="back-link">ログイン画面に戻る</a>
    </span>
  </p>
</div>
  </template>
  <script>
  <style scoped>
  .container {
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

.back-link {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
}

.back-link:hover {
  text-decoration: underline;
}
  
  </style>

