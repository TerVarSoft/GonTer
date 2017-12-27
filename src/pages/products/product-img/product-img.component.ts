import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProductPreviewPage } from '../product-preview/product-preview';

import { TunariApi } from '../../../providers/tunari-api';

import { Product } from '../../../models/product';

@Component({
  selector: 'product-img',
  templateUrl: 'product-img.component.html'
})
export class ProductImgComponent implements OnInit {

  @Input() product: Product;

  url: string = 'assets/img/loading.gif';

  constructor(public navCtrl: NavController, public api: TunariApi) {}

  ngOnInit() {
    
    this.api
      .getImage(this.product.thumbnailUrl)
      .subscribe(url => {
        this.url = url;
      },
      error => {
        if(error.status === 0) {
          this.url = 'assets/img/errorLoading.gif';
          this.product.thumbnailUrl = this.url;
        } else if(error.status === 404) {
          this.url = 'assets/img/defaultProduct.png';
          this.product.thumbnailUrl = this.url;
        }
      });
  }

  openImage(event, product: Product) {
    event.stopPropagation();

    this.navCtrl.push(ProductPreviewPage, {
      product: product
    });
  }
}