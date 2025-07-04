import { Server } from 'socket.io';

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
            io.on('connection', (socket) => {
                console.log('🔌 User connected:', socket.id);
                console.log('📊 Total connected users:', io.sockets.sockets.size);

                socket.on('message', (message) => {
                    console.log('📨 Message received from', socket.id, ':', message);
                    // Echo the message back to all connected clients
                    io.emit('message', {
                        id: socket.id,
                        message: message,
                        timestamp: new Date().toISOString()
                    });
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