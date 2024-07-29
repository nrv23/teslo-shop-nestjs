import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedCLients {
    [id:string] : Socket
}

@Injectable()
export class MessagesWsService {

    private connectedClients : ConnectedCLients = {}

    registerClient(client: Socket) {

        this.connectedClients[client.id] = client;
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    countClientsConnectd() : string[] {

        return Object.keys(this.connectedClients);
    }
}
