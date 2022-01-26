import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private ioClient = io('http://localhost:3000')
  private eventsSubject: Subject<any> = new Subject()
  private isConnectSubject = new BehaviorSubject(false);

  get events$() {
    return this.eventsSubject.asObservable()
  }

  get isConnect$() {
    return this.isConnectSubject.asObservable()
  }

  init() {
    this.ioClient.on('connect', () => {
      this.isConnectSubject.next(true)
    })
  }

  startSubscribeData() {
    this.ioClient.on('events', (data) => {
      this.eventsSubject.next(data)
    })
  }

  close() {
    this.ioClient.close()
    this.isConnectSubject.next(false)
  }

  emit(data: any) {
    this.ioClient.emit('events', data)
  }

}
