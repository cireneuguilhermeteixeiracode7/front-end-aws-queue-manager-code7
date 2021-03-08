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

    getDebtById(debtId: String){
        return this.http.get(this.config.apiUrl + '/debt/'+debtId)
        .toPromise()
        .then(resp=>{
            return resp;
        });

    }


    createDebt(debt: Debt){
        return this.http.post(this.config.apiUrl + '/debt',debt)
        .toPromise()
        .then(resp=>{
            return resp;
        });
    }

    updateDebt(debt: Debt){
        return this.http.put(this.config.apiUrl + '/debt',debt)
        .toPromise()
        .then(resp=>{
            return resp;
        });
    }

    deleteDebt(debtId: String){
        return this.http.delete(this.config.apiUrl + '/debt/' + debtId)
        .toPromise()
        .then(resp=>{
            return resp;
        });
    }

}