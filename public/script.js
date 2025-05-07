const recordButton = document.getElementById('recordButton');
const statusElement = document.getElementById('status');
const audioPlayer = document.getElementById('audioPlayer');

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

// 增强的浏览器支持检查
async function checkRecordingSupport() {
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    statusElement.textContent = '错误: 浏览器缺少必要的录音API支持';
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    statusElement.textContent = `需要麦克风权限: ${error.message}`;
    recordButton.disabled = true;
    return false;
  }
}

// 初始化检查
document.addEventListener('DOMContentLoaded', async () => {
  const isSupported = await checkRecordingSupport();
  if (!isSupported) return;

  recordButton.addEventListener('click', toggleRecording);
});

async function toggleRecording() {
  if (!isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
}

async function startRecording() {
  try {
    statusElement.textContent = '准备录音...';
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      playAudio(audioBlob);
      await saveRecording(audioBlob);
    };
    
    mediaRecorder.start(100); // 每100ms收集一次数据
    isRecording = true;
    updateButtonState();
    statusElement.textContent = '录音中...';
  } catch (error) {
    console.error('启动录音失败:', error);
    statusElement.textContent = `录音失败: ${error.message}`;
  }
}

function stopRecording() {
  mediaRecorder.stop();
  isRecording = false;
  updateButtonState();
  statusElement.textContent = '正在处理录音...';
  mediaRecorder.stream.getTracks().forEach(track => track.stop());
}

function updateButtonState() {
  recordButton.classList.toggle('recording', isRecording);
  recordButton.querySelector('.text').textContent = isRecording ? '停止录音' : '开始录音';
}

function playAudio(blob) {
  const audioUrl = URL.createObjectURL(blob);
  audioPlayer.src = audioUrl;
  audioPlayer.style.display = 'block';
}

async function saveRecording(blob) {
  try {
    statusElement.textContent = '正在保存...';
    const formData = new FormData();
    formData.append('audio', blob, `recording_${Date.now()}.wav`);
    
    const response = await fetch('/.netlify/functions/save-recording', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('服务器响应异常');
    
    const result = await response.json();
    statusElement.textContent = '保存成功!';
    console.log('保存结果:', result);
  } catch (error) {
    console.error('保存失败:', error);
    statusElement.textContent = '保存失败，请重试';
  }
}
