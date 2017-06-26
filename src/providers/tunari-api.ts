import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';

import { TunariStorage } from './tunari-storage'; 

/**
 * Tunari Api, generic REST api handler.
 */
@Injectable()
export class TunariApi {
  
  baseUrl: string = 'https://tunariserver.herokuapp.com/api/';

  authKey: string = 'authorization';

  headers: Headers;    

  constructor(public http: Http, public storage: TunariStorage, 
    public sanitizer: DomSanitizer) {    
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  get(endpoint: string, requestOptions: RequestOptions = new RequestOptions()) {
    let url = this.baseUrl + endpoint;
    requestOptions.headers = new Headers(this.headers);

    return this.getApiToken().flatMap(token => {
      if(token) {
        requestOptions.headers.append(this.authKey, 'Bearer ' + token);
      }

      return this.http.get(url, requestOptions)
        .map(resp => resp.json().data);
    });    
  }

  post(endpoint: string, body: any) {
    let url = this.baseUrl + endpoint;
    let requestOptions = new RequestOptions();
    requestOptions.headers = new Headers(this.headers);

    return this.getApiToken().flatMap(token => {
      if(token) {
        requestOptions.headers.append(this.authKey, 'Bearer ' + token);      
      }

      return this.http
        .post(url, body, requestOptions)
        .map(resp => resp.json().data);
    });
  }

  put(endpoint: string, body: any) {
    let url = this.baseUrl + endpoint;
    let requestOptions = new RequestOptions();
    requestOptions.headers = new Headers(this.headers);

    return this.getApiToken().flatMap(token => {
      if(token) {
        requestOptions.headers.append(this.authKey, 'Bearer ' + token);      
      }

      return this.http.put(url, body, requestOptions)
        .map(resp => resp.json().data);
    });
  }

  remove(endpoint: string) {
    let url = this.baseUrl + endpoint;
    let requestOptions = new RequestOptions();
    requestOptions.headers = new Headers(this.headers);

    return this.getApiToken().flatMap(token => {
      if(token) {
        requestOptions.headers.append(this.authKey, 'Bearer ' + token);      
      }

      return this.http.delete(url, requestOptions)
        .map(resp => resp.json());
    });
  }

  getImage(productUrl: string) {
    let requestOptions = new RequestOptions({ 
      headers: new Headers(this.headers), 
      responseType: ResponseContentType.Blob 
    });

    return this.getApiToken().flatMap(token => {
      if(token) {
        requestOptions.headers.append(this.authKey, 'Bearer ' + token);
      }

      return this.http.get(productUrl, requestOptions)
        .map(res => res.blob())
        .map(blob => URL.createObjectURL(blob))        
    });      
  }

  private getApiToken(): Observable<Headers> {
    return Observable.fromPromise(this.storage.getAuthtoken());      
  }
}