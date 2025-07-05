import { Server } from 'socket.io';
import Redis from 'ioredis';
import prisma from './prisma';
import { produceMessage } from './kafka';
import config from '../config';

// Create Redis instances based on environment
const redisConfig = config.redis.url 
  ? { url: config.redis.url }
  : { host: config.redis.host, port: config.redis.port };

const pub = new Redis(redisConfig);
const sub = new Redis(redisConfig);

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

                socket.on('message', async (message: { text: string, userId: string }) => {
                    console.log('📨 Message received from', socket.id, ':', message);
                    const messageData = {
                        id: `${socket.id}-${Date.now()}`,
                        text: message.text,
                        timestamp: new Date(),
                        userId: message.userId
                    };
                    // Save message to database
                    const savedMessage = await prisma.message.create({
                        data: {
                            text: messageData.text,
                            userId: messageData.userId,
                        },
                    });
                    // Use the ID from the saved message for consistency
                    messageData.id = savedMessage.id;
                    messageData.timestamp = savedMessage.createdAt;

                    await pub.publish("MESSAGES", JSON.stringify(messageData));
                });

                socket.on('get_previous_messages', async () => {
                    console.log('📥 Request for previous messages from', socket.id);
                    try {
                        const previousMessages = await prisma.message.findMany({
                            orderBy: {
                                createdAt: 'asc',
                            },
                            take: 100, // Limit to last 100 messages for performance
                        });
                        socket.emit('previous_messages', previousMessages.map(msg => ({
                            id: msg.id,
                            text: msg.text,
                            timestamp: msg.createdAt,
                            userId: msg.userId || 'anonymous', // Ensure userId is always present
                        })));
                        console.log(`📤 Sent ${previousMessages.length} previous messages to ${socket.id}`);
                    } catch (error) {
                        console.error('❌ Error fetching previous messages:', error);
                    }
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