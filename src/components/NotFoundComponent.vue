<template>
    <div class="error-container">
      <h1>404エラー</h1>
      <p>お探しのページは見つかりませんでした。</p>
      <p>
        <span>
          <a href="/" class="back-link">ログイン画面に戻る</a>
        </span>
      </p>
    </div>
  </template>
  
  <style scoped>
  .error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #eaf4fc; /* 青ベースの背景色 */
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    color: #2c3e50;
    font-family: 'Arial', sans-serif;
  }
  
  h1 {
    font-size: 3rem;
    color: #1e90ff; /* タイトルを濃い青に */
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: #34495e;
  }
  
  .back-link {
    color: #ffffff;
    background-color: #3498db;
    text-decoration: none;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-size: 1.1rem;
    transition: background-color 0.3s ease;
  }
  
  .back-link:hover {
    background-color: #2980b9; /* ホバー時のボタン色 */
  }
  </style>
  