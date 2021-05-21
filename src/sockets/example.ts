import { Server as IoServer, Socket } from 'socket.io';

export const ExampleSocket = (io: IoServer) => {
    const exampleSocket = io.of('/example');
    exampleSocket.on('connection', (socket: Socket) => {
        console.log('Connected Example Socket');
    });
}