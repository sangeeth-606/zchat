'use client';

import { useSocket } from "../context/SocketProvider";
import { useState } from "react";

export default function Home() {
  const { sendMessage, isConnected } = useSocket();
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>WebSocket Chat</h1>
      
      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Connection Status</h2>
        <p>Status: <span style={{ color: isConnected ? 'green' : 'red' }}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span></p>
        
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{ 
              padding: '10px', 
              marginRight: '10px', 
              width: '300px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!isConnected || !message.trim()}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: isConnected && message.trim() ? '#0070f3' : '#ccc',
              color: 'white',
              cursor: isConnected && message.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
