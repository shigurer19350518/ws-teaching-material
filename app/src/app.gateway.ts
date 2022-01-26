import { HttpService } from '@nestjs/axios';
import { Interval } from '@nestjs/schedule';
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

    constructor(
        private readonly httpService: HttpService
    ){}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('chatMessage')
    returnMessage(@MessageBody() messageData: string): WsResponse<string> {
        return {
            event: 'chatMessage',
            data: `🦜${messageData}🦜`
        }
    }

    @Interval(10000)
    async returnPokemon() {
        const baseUrl = 'https://pokeapi.co/api/v2/pokemon'
        const totalPokeCount = (await this.httpService.get(`${baseUrl}?limit=1`).toPromise()).data.count
        const randomPokeNo = Math.floor(Math.random() * (totalPokeCount - 1 + 1) + 1);
        const pokeData = (await this.httpService.get(`${baseUrl}/${randomPokeNo}/`).toPromise()).data
        if(!pokeData?.forms?.[0]?.url || !pokeData?.species?.url) {
            return;
        }
        const [pokeForm, pokeSpecies] = await Promise.allSettled([
            this.httpService.get(pokeData.forms[0].url).toPromise(),
            this.httpService.get(pokeData.species.url).toPromise()
        ])
        if(pokeForm.status === "fulfilled" && pokeSpecies.status === "fulfilled") {
            const pokeNameList = pokeSpecies.value.data.names as any[]
            const data = {
                pokeNo: pokeData.id,
                form_image: pokeForm.value.data.sprites.front_default,
                name: pokeNameList.filter((pokeName) => pokeName.language.name === 'ja-Hrkt')[0].name
            }
            this.server.emit('pokemon', data)
        }
    }

}