import { Component, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/services/websocket.service';

export type PokemonMessage = {
  form_image: string
  name: string
  pokeNo: number
}

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit {

  private eventName = 'pokemon'
  private eventsSubscription?: Subscription;
  pokemonData?: PokemonMessage

  constructor(
    private readonly websocket: WebsocketService<PokemonMessage>,
  ) { }

  ngOnInit(): void {
    this.eventsSubscription = this.websocket.events$
      .pipe(
        filter((eventData) => eventData.event === this.eventName)
      )
      .subscribe((eventData) => {
        this.pokemonData = eventData.data
      })
    this.startSubscribe()
  }

  ngOnDestroy() {
    this.eventsSubscription?.unsubscribe()
  }

  private startSubscribe() {
    this.websocket.startSubscribeData(this.eventName)
  }

}
