import { OnModuleInit, UnauthorizedException, UseGuards } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer , ConnectedSocket } from "@nestjs/websockets";
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
         console.log("JOIN EVENT RECEIVED", room);
         console.log("USER:", user);
         console.log("room", room);
        if (this.canJoin(user.role,room))
        {
            console.log("here");
            client.join(room);
            client.emit('join_success', `Joined ${room}`);
        }
        else
        {
            client.emit('join_error', 'Not allowed')
            throw new UnauthorizedException();
        }

    }
    
    @SubscribeMessage('send_to_room')
    handleSending(@ConnectedSocket() client:Socket,@MessageBody() data:{msg:string, room:string}){
        const user = client.data.user;
                    console.log("DATA TYPE:", typeof data);
                    console.log("DATA:", data);
                    console.log("dataroom", data.room)
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
        console.log("here")
        if (role === 'admin') {
            console.log("role", role)
            console.log("room",room)
            console.log(`here ${room === 'admin_room'} second cond ${room === 'general_room'}`)
            return room === 'admin_room' || room === 'general_room';
    }

        if (role === 'student') {
            console.log("here2")
             console.log(`here ${room === 'student_room'} `)
            return room === 'student_room';
    }

    return false;
  }
}