import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({
  cors: true, // hbailitar cors para conexiones remotas de clientes
})
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly authService: AuthService,
  ) { }
  handleDisconnect(client: Socket) {
  
    this.messagesWsService.removeClient(client.id);
    console.log(
      'Numero de clientes conectados ',
      this.messagesWsService.countClientsConnectd(),
    );
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.countClientsConnectd(),
    );
  }
  async handleConnection(client: Socket) {
    const { authentication = '' } = client.handshake.headers;

    const payload = this.authService.verifyToken(authentication as string) as JwtPayload;
    console.log({payload})
    if (!payload) {
      client.disconnect();
      return;
    }
    await this.messagesWsService.registerClient(client, payload.id);
    console.log(
      'Numero de clientes conectados ',
      this.messagesWsService.countClientsConnectd(),
    );
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.countClientsConnectd(),
    );
    // devolver mensaje de error
  }

  // escucbar mensajes personalizados
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log({
      client: client.id,
      payload,
    });

    /*
    // emitir mensaje a cliente único que envió el mensaje
    client.emit("message-from-server",{
      fullName: 'test',
      message: payload.mesage
    });

    // emitir a todos los clientes menos al cliente que envio el mensaje
    client.broadcast.emit("message-from-server",{
      fullName: 'test',
      message: payload.mesage
    })*/

    // emitir a todos los clientes conectados

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'No message',
    });
  }
}
