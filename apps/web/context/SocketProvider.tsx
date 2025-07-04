'use client';

import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
    sendMessage: (msg: string) => void;
    isConnected: boolean;
    socket: Socket | null;
}

interface SocketProviderProps {
    children: ReactNode;
}

const SocketContext = React.createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    
    const sendMessage: SocketContextType['sendMessage'] = useCallback((msg: string) => {
        if (socketRef.current && isConnected) {
            console.log("Sending message:", msg);
            socketRef.current.emit('message', msg);
        } else {
            console.log("Socket not connected, cannot send message:", msg);
        }
    }, [isConnected]);
    
    useEffect(() => {
        console.log("Connecting to socket server...");
        const socket = io('http://localhost:3005', {
            transports: ['websocket', 'polling']
        });
        
        socketRef.current = socket;
        
        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
            setIsConnected(true);
        });
        
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });
        
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setIsConnected(false);
        });
        
        socket.on('message', (message) => {
            console.log('Message received:', message);
        });
        
        return () => {
            console.log("Cleaning up socket connection");
            socket.disconnect();
        };
    }, []);
    
    const contextValue: SocketContextType = {
        sendMessage,
        isConnected,
        socket: socketRef.current
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