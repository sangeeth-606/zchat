'use client';

import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Message = {
    id: string;
    text: string;
    timestamp: Date;
    userId?: string;
};

type SocketContextType = {
    sendMessage: (msg: string) => void;
    isConnected: boolean;
    socket: Socket | null;
    messages: Message[];
}

interface SocketProviderProps {
    children: ReactNode;
}

const SocketContext = React.createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const hasInitialized = useRef(false);
    
    const sendMessage: SocketContextType['sendMessage'] = useCallback((msg: string) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('message', msg);
        }
    }, [isConnected]);
    
    useEffect(() => {
        if (socketRef.current) return;

        const socket = io('http://localhost:3005', {
            transports: ['websocket', 'polling']
        });
        socketRef.current = socket;

        const onConnect = () => {
            setIsConnected(true);
            socket.emit('get_previous_messages');
        };

        const onDisconnect = () => setIsConnected(false);

        const onMessage = (message: any) => {
            const newMessage: Message = {
                id: message.id || `${Date.now()}_${Math.random()}`,
                text: message.text || message.message || JSON.stringify(message),
                timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
                userId: message.userId || 'unknown'
            };
            setMessages(prev => [...prev, newMessage]);
        };

        const onPreviousMessages = (previousMessages: any[]) => {
            if (Array.isArray(previousMessages)) {
                const formattedMessages: Message[] = previousMessages.map((msg, index) => ({
                    id: msg.id || `prev_${index}_${Date.now()}`,
                    text: msg.text || msg.message || JSON.stringify(msg),
                    timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
                    userId: msg.userId || 'previous'
                }));
                setMessages(formattedMessages);
            }
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onDisconnect);
        socket.on('message', onMessage);
        socket.on('previous_messages', onPreviousMessages);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onDisconnect);
            socket.off('message', onMessage);
            socket.off('previous_messages', onPreviousMessages);
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);
    
    const contextValue: SocketContextType = {
        sendMessage,
        isConnected,
        socket: socketRef.current,
        messages
    };
    
    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = React.useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};