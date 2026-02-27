import { OnModuleInit, UnauthorizedException, UseGuards } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer , ConnectedSocket } from "@nestjs/websockets";
import { Client } from "node_modules/socket.io/dist/client";
import {Server, Socket} from "socket.io"
import { WsJwtAuthGuard } from "src/auth/jwt/jwt.guard";

@UseGuards(WsJwtAuthGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class myGateway{
    @WebSocketServer() 
    server:Server;

    handleConnection(client: Socket) {
        console.log("Connected! ", client.id);
    }
    
    @SubscribeMessage('join_room')
    handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string){
        const user = client.data.user;

        if (this.canJoin(user.role,room))
        {
            client.join(room);
        }
        else
        {
            throw new UnauthorizedException();
        }

    }
    
    @SubscribeMessage('send_to_room')
    handleSending(@ConnectedSocket() client:Socket,@MessageBody() data:{msg:string, room:string}){
        const user = client.data.user;
        if (this.canSend(user.role,data.room)){
            this.server.to(data.room).emit('receive_message', {sender: client.id, message:data.msg});
        }
        
    }

    canJoin(role:string, room:string):boolean{
        if (role === 'admin') {
            return room === 'admin_room' || room === 'general_room';
    }

        if (role === 'student') {
            return room === 'student_room' || room === 'general_room';
    }
    return false;
  }
    canSend(role: string, room: string): boolean {
        if (role === 'admin') {
            return room === 'admin_room' || room === 'general_room';
    }

        if (role === 'student') {
            return room === 'student_room';
    }

    return false;
  }
}