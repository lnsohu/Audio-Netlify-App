const express = require('express');
const router = express.Router();

// 返回 "Hello World" 的 API 接口
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello World from LeanCloud Backend!' });
});

module.exports = router;
