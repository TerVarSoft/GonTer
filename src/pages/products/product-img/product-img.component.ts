import { Component, Input, OnInit } from '@angular/core';

import { TunariApi } from '../../../providers/tunari-api';
import { ProductImgUtil } from './product-img-util';

import { Product } from '../../../models/product';

@Component({
  selector: 'product-img',
  templateUrl: 'product-img.component.html',
  providers: [ProductImgUtil]
})
export class ProductImgComponent implements OnInit {

  @Input() product: Product;

  constructor(public api: TunariApi, public util: ProductImgUtil) {}

  ngOnInit() { 
    this.product.thumbnailUrl = 'assets/img/loading.gif';

    this.api
      .getImage(this.util.buildProductImgUrl(this.product))
      .subscribe(url => {
        this.product.thumbnailUrl = url;
      },
      error => {
        if(error.status === 0) {
          this.product.thumbnailUrl = 'assets/img/errorLoading.gif';
        } else if(error.status === 404) {
          this.product.thumbnailUrl = 'assets/img/defaultProduct.png';
        }
      });
  }
}