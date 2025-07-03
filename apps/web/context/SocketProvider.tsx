'use client';

import React, { ReactNode, useCallback, useEffect } from 'react';
import { io}from 'socket.io-client';

type SocketContextType = {
    sendMessage:(msg: string) => any;

}

interface SocketProviderProps {
    children: ReactNode;
    socket: SocketContextType;
}

const SocketContext = React.createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, socket }) => {
    const sendMessage: SocketContextType['sendMessage'] = useCallback((msg: string) => {
        console.log("send message", msg);
    }, []);
    
    useEffect(() => {
        const socket = io('http://localhost:3005', {});
        return () => {
            socket.disconnect();
        };
    }, []);
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};