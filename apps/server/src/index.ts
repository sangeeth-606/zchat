import http from 'http';
import socketService from './services/socket';
import {startConsumer} from './services/kafka';
import config from './config';

startConsumer();

const httpserver = http.createServer();
const PORT = config.server.port;

socketService.io.attach(httpserver);
socketService.setupHandlers();

httpserver.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});