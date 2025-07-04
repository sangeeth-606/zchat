import { Server } from 'socket.io';
import Redis from 'ioredis';
import prisma from './prisma';
import { createProducer, produceMessage } from './kafka';

const pub = new Redis({
    host: 'localhost',
    port: 6379,
});
const sub = new Redis({
    host: 'localhost',
    port: 6379,
});

const createSocketService = () => {
    console.log('SocketService initialized');
    
    const io = new Server({
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    
    return {
        io,
        setupHandlers: () => {
            sub.subscribe("MESSAGES", (err, count) => {
                if (err) {
                    console.error('❌ Redis subscribe error:', err);
                    return;
                }
                console.log(`✅ Subscribed to ${count} channel(s).`);
            });

            sub.on("message", async (channel, message) => {
                if (channel === "MESSAGES") {
                    try {
                        const data = JSON.parse(message);
                        io.emit('message', data);
                        await produceMessage(data.text);
                        console.log('📤 Message published to Kafka:', data.text);
                    } catch (e) {
                        console.error('❌ Failed to parse message:', e);
                    }
                }
            });

            io.on('connection', (socket) => {
                console.log('🔌 User connected:', socket.id);
                console.log('📊 Total connected users:', io.sockets.sockets.size);

                socket.on('message', async (message) => {
                    console.log('📨 Message received from', socket.id, ':', message);
                    const messageData = {
                        id: `${socket.id}-${Date.now()}`,
                        text: message,
                        timestamp: new Date(),
                        userId: socket.id
                    };
                    await pub.publish("MESSAGES", JSON.stringify(messageData));
                });

                socket.on('disconnect', (reason) => {
                    console.log('🔌 User disconnected:', socket.id, 'Reason:', reason);
                    console.log('📊 Total connected users:', io.sockets.sockets.size);
                });

                socket.on('error', (error) => {
                    console.error('❌ Socket error for', socket.id, ':', error);
                });
            });

            io.on('connect_error', (error) => {
                console.error('❌ Connection error:', error);
            });
        }
    };
};

// Create and export the service instance
const socketService = createSocketService();
export default socketService;