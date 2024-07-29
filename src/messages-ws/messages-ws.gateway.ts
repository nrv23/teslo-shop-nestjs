import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true // hbailitar cors para conexiones remotas de clientes
})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}
  handleDisconnect(client: Socket) {
    console.log({
      clientDisconnected: client.id
    })
    this.messagesWsService.removeClient(client.id);
    console.log("Numero de clientes conectados ", this.messagesWsService.countClientsConnectd())
    this.wss.emit("clients-updated", this.messagesWsService.countClientsConnectd());
    
  }
  handleConnection(client: Socket) {
    console.log({
      clientConnected: client.id
    })
    this.messagesWsService.registerClient(client);
    console.log("Numero de clientes conectados ", this.messagesWsService.countClientsConnectd())
    this.wss.emit("clients-updated", this.messagesWsService.countClientsConnectd());
  }
}
