const path = require('path');
const express = require('express');
const app = express();

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'dist')));

// 任意のルートがアクセスされた場合、index.htmlを返す
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// サーバーのポート設定
const PORT = process.env.PORT || 5000;

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

