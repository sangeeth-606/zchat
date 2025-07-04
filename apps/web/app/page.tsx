'use client';

import { useSocket } from "../context/SocketProvider";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const { sendMessage, isConnected, messages } = useSocket();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '15px 20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Group Chat</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ 
            fontSize: '12px',
            color: isConnected ? '#4CAF50' : '#f44336',
            fontWeight: 'bold'
          }}>
            {isConnected ? '● Online' : '● Offline'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            fontSize: '14px',
            marginTop: '50px'
          }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              style={{
                marginBottom: '15px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                backgroundColor: 'white',
                padding: '12px 16px',
                borderRadius: '18px',
                maxWidth: '70%',
                alignSelf: 'flex-start',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#666',
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}>
                  {msg.userId || 'Unknown User'}
                </div>
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#333',
                  wordBreak: 'break-word'
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#999',
                  marginTop: '4px',
                  textAlign: 'right'
                }}>
                  {msg.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ 
        padding: '15px 20px',
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ 
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #e0e0e0',
            borderRadius: '25px',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: '#f9f9f9'
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
            padding: '12px 20px',
            border: 'none',
            borderRadius: '25px',
            backgroundColor: isConnected && message.trim() ? '#007bff' : '#ccc',
            color: 'white',
            cursor: isConnected && message.trim() ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: 'bold',
            minWidth: '70px'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
