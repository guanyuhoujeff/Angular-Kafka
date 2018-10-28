import { Injectable } from '@angular/core';   
import {Http,Response, Headers, RequestOptions } from '@angular/http';   
import { Observable, from, of } from 'rxjs';
import * as io from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private url = 'http://192.168.43.12:8888';
  private socket;
  
  constructor(private http: Http) { }

  postProducer(message) {
    console.log("postProducer  !!! , message", of(message))
    return this.http.post('http://192.168.43.12:8888/api/producer/', of(message))
  }

  getConsumer() {
    console.log("getConsumer  !!!  GET")
    return this.http.get('http://192.168.43.12:8888/api/consumer/')
  }


  sendMessage(message) {
    this.socket.emit('add-message', message);
    console.log("MESSAGE SENT");
  }

  getLiveData1() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }
  getLiveData2() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('sampleMessage', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }
}



export class ChatService {


}
