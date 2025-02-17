const express = require('express');
const router = express.Router();

// 定义根路由，返回 "Hello World"
router.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = router;
