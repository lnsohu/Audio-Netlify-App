const express = require('express');
const path = require('path');
const AV = require('leanengine');

const app = express();
const port = process.env.LEANCLOUD_APP_PORT || 3000;

// 初始化 LeanCloud
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

// 设置视图引擎为 EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 提供静态文件（React 构建后的文件）
app.use(express.static(path.join(__dirname, 'build')));

// 处理所有其他请求，返回 React 应用的入口文件
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
