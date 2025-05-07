const { writeFile } = require('fs').promises;
const { join } = require('path');
const { tmpdir } = require('os');

exports.handler = async (event) => {
  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    // 直接从body获取数据
    const audioData = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    
    // 生成唯一文件名
    const fileName = `recording_${Date.now()}.wav`;
    const filePath = join(tmpdir(), fileName);
    
    // 保存文件到临时目录
    await writeFile(filePath, audioData);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: '录音保存成功',
        fileName: fileName
      })
    };
  } catch (error) {
    console.error('保存录音失败:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: '保存录音失败',
        error: error.message 
      })
    };
  }
};
