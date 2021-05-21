import { Server as IoServer } from 'socket.io';
import { ExampleSocket } from './example';

export const sockets = (io: IoServer) => {
    const socketExample = ExampleSocket(io);
}