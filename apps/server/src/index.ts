import http from 'http';
import socketService from './services/socket';

// Modern ES2017+ approach with top-level await
const httpserver = http.createServer();
const PORT = process.env.PORT || 3005;

socketService.io.attach(httpserver);
socketService.setupHandlers();

httpserver.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});