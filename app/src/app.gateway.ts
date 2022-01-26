import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class AppGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('chatMessage')
    returnMessage(@MessageBody() messageData: string): WsResponse<string> {
        return {
            event: 'chatMessage',
            data: `🦜${messageData}🦜`
        }
    }

}