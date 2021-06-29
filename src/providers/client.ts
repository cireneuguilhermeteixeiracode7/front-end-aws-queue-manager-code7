import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';


@Injectable()
export class ClientProvider {

    config = environment;

    constructor(
        private http: HttpClient,
        private router: Router
    ){}


    getCarga(){
        return this.http.get(this.config.apiUrl + '/carga/')
        .toPromise()
        .then(resp=>{
            return resp;
        });

    }


    
}