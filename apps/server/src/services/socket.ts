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
        // You can add methods here
        setupHandlers: () => {
            io.on('connection', (socket) => {
                console.log('User connected:', socket.id);

                socket.on('message', (message) => {
                    console.log('Message received:', message);
                });

                socket.on('disconnect', () => {
                    console.log('User disconnected:', socket.id);
                });
            });
        }
    };
};

// Create and export the service instance
const socketService = createSocketService();
export default socketService;