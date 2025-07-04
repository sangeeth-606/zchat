"use client"

import { useSocket } from "../context/SocketProvider"
import { useState, useEffect, useRef } from "react"

export default function Home() {
  const { sendMessage, isConnected, messages } = useSocket()
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message)
      setMessage("")
    }
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="terminal-container">
      {/* Terminal Title Bar */}
      <div className="terminal-titlebar">
        <div className="terminal-buttons">
          <div className="terminal-button close"></div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">Terminal — chat@localhost: ~</div>
        <div className="connection-status">
          <span className={isConnected ? "connected" : "disconnected"}>
            {isConnected ? "●" : "●"} {isConnected ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="terminal-content">
        {/* Welcome Message */}
        <div className="terminal-line">
          <span className="terminal-prompt">user@chat:~$</span>
          <span className="terminal-command">./start-chat.sh</span>
        </div>
        <div className="terminal-line">
          <span className="terminal-output">Starting chat session...</span>
        </div>
        <div className="terminal-line">
          <span className="terminal-output">Connection status: {isConnected ? "ESTABLISHED" : "FAILED"}</span>
        </div>
        <div className="terminal-line">
          <span className="terminal-output">Type your message and press ENTER to send.</span>
        </div>
        <div className="terminal-line">
          <span className="terminal-separator">{"─".repeat(60)}</span>
        </div>

        {/* Messages */}
        {messages.length === 0 ? (
          <div className="terminal-line">
            <span className="terminal-info"># No messages yet. Start the conversation!</span>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message-block">
              <div className="terminal-line">
                <span className="terminal-prompt">{msg.userId || "anonymous"}@chat:~$</span>
                <span className="terminal-command">echo "{msg.text}"</span>
                <span className="terminal-timestamp"># {formatTime(msg.timestamp)}</span>
              </div>
              <div className="terminal-line">
                <span className="terminal-output message-content">{msg.text}</span>
              </div>
            </div>
          ))
        )}

        <div ref={messagesEndRef} />

        {/* Current Input Line */}
        <div className="terminal-line current-line">
          <span className="terminal-prompt">user@chat:~$</span>
          <span className="terminal-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="terminal-input"
              disabled={!isConnected}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
              placeholder={!isConnected ? "Disconnected..." : ""}
              autoComplete="off"
              spellCheck="false"
            />
          </span>
        </div>
      </div>

      <style jsx>{`
        .terminal-container {
          height: 100vh;
          background: #0f0f0f;
          font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.4;
          color: #00ff41;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .terminal-titlebar {
          background: #1a1a1a;
          height: 28px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          border-bottom: 1px solid #333;
          user-select: none;
        }

        .terminal-buttons {
          display: flex;
          gap: 8px;
        }

        .terminal-button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .terminal-button.close {
          background: #ff5f57;
        }

        .terminal-button.minimize {
          background: #ffbd2e;
        }

        .terminal-button.maximize {
          background: #28ca42;
        }

        .terminal-title {
          flex: 1;
          text-align: center;
          color: #666;
          font-size: 12px;
        }

        .connection-status {
          font-size: 10px;
          color: #666;
        }

        .connected {
          color: #00ff41;
        }

        .disconnected {
          color: #ff4444;
        }

        .terminal-content {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #0f0f0f;
          position: relative;
        }

        .terminal-line {
          margin-bottom: 4px;
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
        }

        .current-line {
          margin-top: 8px;
        }

        .terminal-prompt {
          color: #00ff41;
          margin-right: 8px;
          font-weight: bold;
          white-space: nowrap;
        }

        .terminal-command {
          color: #ffffff;
          margin-right: 8px;
        }

        .terminal-output {
          color: #cccccc;
          margin-left: 4px;
        }

        .terminal-info {
          color: #666666;
          font-style: italic;
        }

        .terminal-separator {
          color: #333333;
        }

        .terminal-timestamp {
          color: #666666;
          font-size: 12px;
          margin-left: auto;
        }

        .message-block {
          margin-bottom: 8px;
        }

        .message-content {
          color: #ffffff;
          word-break: break-word;
          padding-left: 20px;
        }

        .terminal-input-wrapper {
          display: flex;
          align-items: baseline;
          flex: 1;
          position: relative;
        }

        .terminal-input {
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-family: inherit;
          font-size: inherit;
          flex: 1;
          caret-color: #00ff41;
        }

        .terminal-input::placeholder {
          color: #666666;
        }

        .terminal-input:disabled {
          opacity: 0.5;
        }

        /* Scrollbar styling */
        .terminal-content::-webkit-scrollbar {
          width: 8px;
        }

        .terminal-content::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        .terminal-content::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 4px;
        }

        .terminal-content::-webkit-scrollbar-thumb:hover {
          background: #444444;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .terminal-container {
            font-size: 12px;
          }
          
          .terminal-content {
            padding: 12px;
          }
          
          .terminal-titlebar {
            height: 24px;
            padding: 0 8px;
          }
          
          .terminal-button {
            width: 10px;
            height: 10px;
          }
          
          .terminal-title {
            font-size: 10px;
          }
          
          .terminal-timestamp {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .terminal-container {
            font-size: 11px;
          }
          
          .terminal-line {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .terminal-command {
            margin-left: 20px;
            margin-top: 2px;
          }
        }
      `}</style>
    </div>
  )
}
