import { RequestOptions, URLSearchParams  } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as _ from "lodash";

import { TunariApi } from './tunari-api';
import { TunariStorage } from './tunari-storage';

/**
 * Products endpoint provider. 
 */
@Injectable()
export class Products {

  baseUrl: string;

  endpoint: string = "products";

  constructor(public api: TunariApi, public storage: TunariStorage) { }

  get(query: string, page: number = 1) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('tags', query); 
    params.set('page', page.toString()); 
    let requestOptions = new RequestOptions({search: params});

    return this.api.get(this.endpoint, requestOptions);
  }

  save(product) {
    if(product._id) {
      return this.put(product);
    } else {
      return this.post(product);
    }
  }

  post(product) {
    return this.api.post(this.endpoint, product);
  }

  put(product) {    
    return this.api.put(`${this.endpoint}/${product._id}`, product);
  }
  
  remove(product) {
    return this.api.remove(`${this.endpoint}/${product._id}`);
  }

  getFavorites(productCategory) {
    return this.storage.getProductFavorites().then(favoritesObject => {
      return favoritesObject ? 
        _.filter(favoritesObject.items, favorite => favorite.category === productCategory) :
        null;
    });
  }
  
  loadFavoritesFromServer(productCategory) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('isFavorite', "true"); 
    let requestOptions = new RequestOptions({search: params});

    return this.api.get(this.endpoint, requestOptions)
      .map(productsObject => {        
        this.storage.setProductFavorites(productsObject);
        productsObject.items = _.filter(productsObject.items, favorite => favorite.category === productCategory);
        return productsObject;
      });
  }

  getLowQuantity() {
    let params: URLSearchParams = new URLSearchParams();
    params.set('isLowQuantity', "true"); 
    let requestOptions = new RequestOptions({search: params});

    return this.api.get(this.endpoint, requestOptions);
  }
}