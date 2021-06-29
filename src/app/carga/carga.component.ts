import { Component, OnInit } from '@angular/core';
import { Client } from 'model/client';
import {  ToastrService } from 'ngx-toastr';
import { ClientProvider } from 'providers/client';
import 'rxjs/add/operator/debounceTime';


declare const google: any;


@Component({
  selector: 'app-clients',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css']
})
export class CargaComponent implements OnInit {
  queues: Array<any> = [];
  loads: Array<any> = [];
  queue_contacts: Array<any> = [];
  contacts: Array<any> = [];
  sub

  loadingClients: boolean = false;

  constructor(
    public clientProvider: ClientProvider,
    public toastr: ToastrService,

  ) { }

  ngOnInit() {
    this.sub = setInterval(() => {
      this.getCarga();
    }, 1000);

  }


  ngOnDestroy(){
    clearInterval(this.sub);
  }

  getCarga(){
    
    // this.loadingClients = true;
    this.clientProvider.getCarga()
    .then(resp=>{
      console.log(resp);
      
      if(resp['success']==true){
         const { contacts, queue_contacts, loads, queues } = resp['data'];

         this.contacts =contacts;
         this.queue_contacts = queue_contacts;
         this.loads = loads;
         this.queues = queues;

      }else if(resp['success']== false){
          this.toastr.warning(resp['data']['message']);
          throw(resp);
      }           
    }).catch( error => {
        console.log('erro: ' +  error);
        this.toastr.error('Erro ao se comunicar com o servidor', 'Ops!')       
    })
    // .then(()=>this.loadingClients=false)
  }
}
