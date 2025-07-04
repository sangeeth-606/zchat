import http from 'http';
import socketService from './services/socket';
import {startConsumer} from './services/kafka';


startConsumer();

const httpserver = http.createServer();
const PORT = process.env.PORT || 3005;

socketService.io.attach(httpserver);
socketService.setupHandlers();

httpserver.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});