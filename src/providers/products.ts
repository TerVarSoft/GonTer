import { RequestOptions, URLSearchParams  } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


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
    let commonTags = "Invitaciones ";
    params.set('tags', commonTags + query); 
    params.set('page', page.toString()); 
    let requestOptions = new RequestOptions({search: params});

    return this.api.get(this.endpoint, requestOptions);
  }

  put(product) {
    console.log(product._id);
    return this.api.put(`${this.endpoint}/${product._id}`, product);
  }
  
  getFavorites() {
    return this.storage.getProductFavorites();
  }
  
  loadFavoritesFromServer() {        
    let params: URLSearchParams = new URLSearchParams();
    params.set('isFavorite', "true"); 
    let requestOptions = new RequestOptions({search: params});        

    return this.api.get(this.endpoint, requestOptions)
      .map(productsObject => {
        this.storage.setProductFavorites(productsObject);
        return productsObject;
      });      
  }  
}