async function saveRecording(audioBlob) {
  const reader = new FileReader();
  
  return new Promise((resolve) => {
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];
      
      const response = await fetch('/.netlify/functions/save-recording', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audioData: base64Data
        })
      });
      
      if (!response.ok) {
        throw new Error('上传失败');
      }
      
      resolve(await response.json());
    };
    
    reader.readAsDataURL(audioBlob);
  });
}
