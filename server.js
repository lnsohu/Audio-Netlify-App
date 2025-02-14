const express = require('express');
const path = require('path');
const AV = require('leanengine');

const app = express();

// 初始化 LeanCloud SDK
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

// 启用 LeanCloud 云引擎中间件
app.use(AV.express());

// 静态文件服务（React 构建文件）
app.use(express.static(path.join(__dirname, 'build')));

// API 路由
app.use('/api', require('./routes/api'));

// 前端路由回退到 index.html（支持 React Router）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 启动服务器
const PORT = process.env.LEANCLOUD_APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
