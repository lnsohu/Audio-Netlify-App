import React, { useEffect, useState } from 'react';

function DisplayPage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 调用后端 API 获取数据
    fetch('/api/hello')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching message:', error));
  }, []);

  return (
    <div>
      <p>{message}</p>
    </div>
  );
}

export default DisplayPage;
