import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Debt } from 'model/debt';
import { environment } from '../environments/environment';


@Injectable()
export class SNSSQSProvider {

    config = environment;

    constructor(
        private http: HttpClient,
        private router: Router
    ){}


    getTopics(){
        return this.http.get(this.config.apiUrl + '/sns/topic/')
        .toPromise()
        .then(resp=>{
            return resp;
        });

    }

    getQueue(){
        return this.http.get(this.config.apiUrl + '/sqs/queue/')
        .toPromise()
        .then(resp=>{
            return resp;
        });

    }

    saveTopic(topic){
        return this.http.post(this.config.apiUrl + '/sns/topic/',topic)
        .toPromise()
        .then(resp=>{
            return resp;
        });
    }


    saveQueue(queue){
        return this.http.post(this.config.apiUrl + '/sqs/queue/',queue)
        .toPromise()
        .then(resp=>{
            return resp;
        });

    }


    publishTopic(message){
        return this.http.post(this.config.apiUrl + '/sns/topic/pub',message)
        .toPromise()
        .then(resp=>{
            return resp;
        });
    }


    getSubscriptiontTopic(topicArn){
        return this.http.get(this.config.apiUrl + '/sns/topic/sub/'+topicArn)
        .toPromise()
        .then(resp=>{
            return resp;
        });
    }

    subscriptTopic(obj){
        return this.http.post(this.config.apiUrl + '/sns/topic/sub',obj)
        .toPromise()
        .then(resp=>{
            return resp;
        });
    }

    setFilterPolicyAttribute(obj){
        return this.http.post(this.config.apiUrl + '/sns/topic/sub/filter_policity',obj)
        .toPromise()
        .then(resp=>{
            return resp;
        });
    }
  

}