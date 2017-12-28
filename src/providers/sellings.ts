import { RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { TunariApi } from './tunari-api';

/**
 * Sellings endpoint provider. 
 */
@Injectable()
export class Sellings {

  baseUrl: string;

  endpoint: string = "sellings";

  constructor(public api: TunariApi) { }

  get() {
    let requestOptions = new RequestOptions();

    return this.api.get(this.endpoint, requestOptions);
  }

  save(selling) {
    if(selling._id) {
      return this.put(selling);
    } else {
      return this.post(selling);
    }
  }

  post(selling) {
    return this.api.post(this.endpoint, selling);
  }

  put(selling) {
    return this.api.put(`${this.endpoint}/${selling._id}`, selling);
  }
  
  remove(selling) {
    return this.api.remove(`${this.endpoint}/${selling._id}`);
  }
}