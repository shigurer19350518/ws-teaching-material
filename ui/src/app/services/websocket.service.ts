import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService<T = any> {

  private ioClient = io('http://localhost:3000')
  private eventsSubject: Subject<T> = new Subject()
  private isConnectSubject = new BehaviorSubject(false);

  constructor(){
    this.init()
  }

  get events$() {
    return this.eventsSubject.asObservable()
  }

  get isConnect$() {
    return this.isConnectSubject.asObservable()
  }

  private init() {
    this.ioClient.on('connect', () => {
      this.isConnectSubject.next(true)
    })
  }

  startSubscribeData(eventName: string) {
    this.ioClient.on(eventName, (data) => {
      this.eventsSubject.next(data)
    })
  }

  close() {
    this.ioClient.close()
    this.isConnectSubject.next(false)
  }

  emit(eventName: string, data: any) {
    this.ioClient.emit(eventName, data)
  }

}
