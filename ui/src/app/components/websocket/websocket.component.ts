import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/services/websocket.service';
import { FormControl } from '@angular/forms';

export type MessageObject = {
  time: Date;
  message: string
}

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss']
})
export class WebsocketComponent implements OnInit, OnDestroy {

  private eventsSubscription?: Subscription;
  private isConnectSubscription?: Subscription;
  isConnected = false
  contentForm = new FormControl('')
  rightMessageStack: MessageObject[] = []
  leftMessageStack: MessageObject[] = []

  constructor(
    private readonly websocket: WebsocketService
  ) { }

  ngOnInit(): void {
    this.websocket.init()
    this.eventsSubscription = this.websocket.events$.subscribe((data) => {
      console.log(data)
    })
    this.isConnectSubscription = this.websocket.isConnect$.subscribe((connectionState) => {
      this.isConnected = connectionState
    })
    this.startSubscribe()
  }

  ngOnDestroy() {
    this.eventsSubscription?.unsubscribe()
    this.isConnectSubscription?.unsubscribe()
  }

  private startSubscribe() {
    this.websocket.startSubscribeData()
  }

  onSendMessage() {
    this.rightMessageStack.push({
      time: new Date(),
      message: this.contentForm.value
    })
    this.contentForm.setValue('')
  }

}
