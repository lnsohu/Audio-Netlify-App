const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const leanengine = require('leanengine');

const app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 设置路由
app.use('/', routes);

// 启动服务器
const PORT = process.env.LEANCLOUD_APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
