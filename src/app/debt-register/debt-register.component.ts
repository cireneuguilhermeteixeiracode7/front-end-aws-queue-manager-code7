import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from 'model/client';
import { Debt } from 'model/debt';
import { ClientProvider } from 'providers/client';
import { ToastrService } from 'ngx-toastr';
import { SNSSQSProvider } from 'providers/sns_sqs';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { WebsocketProvider } from 'providers/websocket';
import { environment } from '../../environments/environment';



@Component({
  selector: 'app-debt-register',
  templateUrl: './debt-register.component.html',
  styleUrls: ['./debt-register.component.scss']
})
export class DebtRegisterComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  loadingSqs: boolean = false;
  loadingTopics: boolean = false;
  sqsForm : FormGroup;
  snsForm : FormGroup;
  pubForm : FormGroup;
  subForm : FormGroup;
  currentSelected = 'topic';
  topics: Array<any> = [];
  queue : Array<any> = [];
  topicSubscription: Array<any> = [];
  savingOrUpdating : boolean = false;
  url = environment.wsUrl;
  messagesFromSocket: Array<string> = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sns_sqsProvider: SNSSQSProvider,
    private websocket: WebsocketProvider,

  ) { }

  ngOnInit() {
    this.topicSubscription = [];
    this.topics = [];
    this.queue = [];
    this.initNewForm();
    this.getTopics();
    this.connectToApiGateway();
    // this.getSqs();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  connectToApiGateway(){
    this.subscription = this.websocket.connect(this.url)
      .subscribe(message =>{
        console.log(message['data'] );
        this.messagesFromSocket.push(message['data']);
        
    },error=>{
        console.error(error);
        
    })

  }

  // deleteDebt(debt: Debt){
  //   Swal.fire({
  //     title: 'Aviso',
  //     text: 'Deseja realmente deletar a dívida('+debt._id+') de R$ '+debt.value+' do client de id '+debt.clientId+'?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sim!',
  //     cancelButtonText: 'Cancelar'
  //   }).then((result) => {
  //     if (result.value) {

  //       this.sns_sqsProvider.deleteDebt(String(debt._id))
  //       .then(resp=>{
        
  //         if(resp['success']){
  //           Swal.fire(
  //             'Ok!',
  //             'Dívida deletada com sucesso.',
  //             'success'
  //           ).then(()=>this.ngOnInit())
  //         }else{
  //           this.toastr.error(resp['data']['message']);
  //         }          
  //       }).catch(erro=>{
  //         this.toastr.error("Erro ao tentar deletar dívida.")
  //         console.log(erro);
          
  //       })
  //     }
  //   });
  // }

  getTopics(){
    this.topics = [];  
    this.currentSelected = 'topic';
    this.loadingTopics = true;
    this.sns_sqsProvider.getTopics()
    .then(resp=>{
      console.log(resp);
      
      if(resp['success']==true){
        this.topics = resp['data']['Topics']

      }else if(resp['success']== false){
          this.toastr.warning(resp['data']['message']);
          throw(resp);
      }         
    }).catch( error => {
        console.log('erro: ' +  error);
        this.toastr.error('Erro ao se comunicar com o servidor', 'Ops!')       
    })    
    .then(()=>this.loadingTopics=false)
  }


  getTopicSubscriptions(){
    this.currentSelected = 'topicSubscription';
    // this.loadingTopics = ;
    let arrayRequest = [];
    this.topics.forEach(topic => {
      arrayRequest.push(this.sns_sqsProvider.getSubscriptiontTopic(topic.TopicArn));
    });

    Promise.all(arrayRequest).then((values) => {
      this.topicSubscription = []
      values.forEach(val => {   
        this.topicSubscription.push({
          TopicArn: val['data']['TopicArn'],
          Subscriptions: val['data']['Subscriptions']
        });
      });   
      console.log(this.topicSubscription);
      
    });

    
  }

  getSqs(){
    this.queue = [];
    this.currentSelected = 'queue';
    this.loadingSqs = true;

    
    this.sns_sqsProvider.getQueue()
    .then(resp=>{
      console.log(resp);
      
      if(resp['success']==true){
        this.queue = resp['data']['QueueUrls']

      }else if(resp['success']== false){
          this.toastr.warning(resp['data']['message']);
          throw(resp);
      }         
    }).catch( error => {
        console.log('erro: ' +  error);
        this.toastr.error('Erro ao se comunicar com o servidor', 'Ops!')       
    })    
    .then(()=>this.loadingSqs=false)
  }

  
  initNewForm(){
    this.snsForm = this.formBuilder.group({
      name: this.formBuilder.control(null, Validators.required),
    });

    this.sqsForm = this.formBuilder.group({
      name: this.formBuilder.control(null, Validators.required),
    });

    this.subForm = this.formBuilder.group({
      TopicArn: this.formBuilder.control(null, Validators.required),
      queueArn: this.formBuilder.control(null, Validators.required),
    });

    this.pubForm = this.formBuilder.group({
      Message: this.formBuilder.control(null, Validators.required),
      TopicArn: this.formBuilder.control(null, Validators.required),
    
    });

  }



  saveTopic(){
    this.savingOrUpdating = true;
    let snsFormToSave = this.snsForm.value;
    this.sns_sqsProvider.saveTopic(snsFormToSave)
    .then(resp=>{
      console.log(resp);
      
      if(resp['success']==true){
        this.toastr.success('Tópico criado com sucesso.');
        this.getTopics();
        this.snsForm.reset();
      }else if(resp['success']== false){
          this.toastr.warning(resp['data']['message']);
          throw(resp);
      }         
    }).catch( error => {
        console.log('erro: ' +  error);
        this.toastr.error('Erro ao se comunicar com o servidor', 'Ops!')       
    })
    .then(()=>this.savingOrUpdating=false)

  }

  saveSqs(){
    this.savingOrUpdating = true;
    let sqsFormToSave = this.sqsForm.value;
    this.sns_sqsProvider.saveQueue(sqsFormToSave)
    .then(resp=>{
      console.log(resp);
      
      if(resp['success']==true){
        this.toastr.success('Fila salva com sucesso.');
        this.getSqs();
        this.sqsForm.reset();
      }else if(resp['success']== false){
          this.toastr.warning(resp['data']['message']);
          throw(resp);
      }         
    }).catch( error => {
        console.log('erro: ' +  error);
        this.toastr.error('Erro ao se comunicar com o servidor', 'Ops!')       
    })
    .then(()=>this.savingOrUpdating=false)

  }


  subToTopic(){
    this.savingOrUpdating = true;
    let subFormToSend = this.subForm.value;
    this.sns_sqsProvider.subscriptTopic(subFormToSend)
    .then(resp=>{
      console.log(resp);
      
      if(resp['success']==true){
        this.toastr.success('Topico assinado com sucesso.');
        // this.getSqs();
        this.subForm.reset();
      }else if(resp['success']== false){
          this.toastr.warning(resp['data']['message']);
          throw(resp);
      }         
    }).catch( error => {
        console.log('erro: ' +  error);
        this.toastr.error('Erro ao se comunicar com o servidor', 'Ops!')       
    })
    .then(()=>this.savingOrUpdating=false)

  }







  pubToTopic(){
    this.savingOrUpdating = true;
    let pubFormToSend = this.pubForm.value;
    this.sns_sqsProvider.publishTopic(pubFormToSend)
    .then(resp=>{
      console.log(resp);
      
      if(resp['success']==true){
        this.toastr.success('Mensagem enviada com sucesso.');
        // this.getSqs();
        // this.pubForm.reset();
      }else if(resp['success']== false){
          this.toastr.warning(resp['data']['message']);
          throw(resp);
      }         
    }).catch( error => {
        console.log('erro: ' +  error);
        this.toastr.error('Erro ao se comunicar com o servidor', 'Ops!')       
    })
    .then(()=>this.savingOrUpdating=false)

  }


  



}


