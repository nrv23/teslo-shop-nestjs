import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { AuthService } from '../auth/auth.service';

interface ConnectedCLients {
    [id:string] : {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessagesWsService {
    private connectedClients : ConnectedCLients = {}

    constructor(
        private readonly authService:AuthService
    ) {

    }

   async registerClient(client: Socket, id: string) {
        const user = await this.authService.getUserById(id);
        this.checkUserSocketConnection(user)
        this.connectedClients[client.id] = {
            socket: client,
            user
        };
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    countClientsConnectd() : string[] {
        return Object.keys(this.connectedClients);
    }

    getUserFullName(socketId: string) {
        return this.connectedClients[socketId].user.fullname;
    }

    private checkUserSocketConnection(user: User) {

        for (const clientId of Object.keys(this.connectedClients)) {
            console.log({clientId})
            const client = this.connectedClients[clientId];

            if(client.user.id === user.id) {
                client.socket.disconnect();
                break;
            } 
        }
    }
}
