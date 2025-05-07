const { writeFile } = require('fs').promises;
const { join } = require('path');
const { tmpdir } = require('os');
const Busboy = require('busboy');

exports.handler = async function(event, context) {
  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    // 解析multipart/form-data数据
    const fileData = await parseMultipartForm(event);
    
    // 生成唯一文件名
    const fileName = `recording_${Date.now()}.wav`;
    const filePath = join(tmpdir(), fileName);
    
    // 保存文件到临时目录
    await writeFile(filePath, fileData);
    
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

// 解析multipart/form-data数据
function parseMultipartForm(event) {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({
      headers: {
        'content-type': event.headers['content-type']
      }
    });
    
    let fileData = null;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const chunks = [];
      file.on('data', (chunk) => {
        chunks.push(chunk);
      });
      file.on('end', () => {
        fileData = Buffer.concat(chunks);
      });
    });

    busboy.on('error', (error) => {
      reject(error);
    });

    busboy.on('finish', () => {
      if (fileData) {
        resolve(fileData);
      } else {
        reject(new Error('未接收到录音文件'));
      }
    });

    busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    busboy.end();
  });
}
