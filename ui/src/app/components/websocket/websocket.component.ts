import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
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

  private eventName = 'chatMessage'
  private eventsSubscription?: Subscription;
  private isConnectSubscription?: Subscription;
  isConnected = false
  contentForm = new FormControl('')
  rightMessageStack: MessageObject[] = []
  leftMessageStack: MessageObject[] = []
  private _el: HTMLElement;

  constructor(
    private readonly websocket: WebsocketService<string>,
    el: ElementRef
  ) {
    this._el = el.nativeElement;
  }

  ngOnInit(): void {
    this.eventsSubscription = this.websocket.events$.subscribe((data) => {
      this.leftMessageStack.push({
        time: new Date(),
        message: data
      })
      const messageBoxElm = this._el.querySelector('.message-box') as HTMLElement
      messageBoxElm.scrollTop = messageBoxElm?.scrollHeight
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
    this.websocket.startSubscribeData(this.eventName)
  }

  onSendMessage() {
    this.rightMessageStack.push({
      time: new Date(),
      message: this.contentForm.value
    })
    this.websocket.emit(this.eventName, this.contentForm.value)
    this.contentForm.setValue('')
  }

}
