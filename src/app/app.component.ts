import { Component, OnInit } from '@angular/core';
import { CommonService } from './common.service';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

// 
// 如果soket global is not defined , Put this in your polyfills.ts  =>   (window as any).global = window
// 
// 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sampleApp';
  constructor(private newService :CommonService,) {   } 
  cunsumer;
  connection;
  messages = [];

  ngOnInit() {    

  }  

  clickPost(){
    let message = "start send";
    console.log("ngOnInit  message", message);
    this.newService.postProducer(message).subscribe(
      data =>  console.log("ngOnInit  data", data)
      )  
  }


  clickGet(){
    this.newService.getConsumer();
    this.connection = this.newService.getLiveData1().subscribe(message => {
      console.log(" connection ");
      this.messages.push(message);
    })
  }


  showMessages(){
    console.log(" this  messages  ", this.messages);
  }




}
