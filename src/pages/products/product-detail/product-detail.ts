import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Product } from '../../../models/product';

@Component({
  selector: 'product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {

  segment = 'prices';

  product: Product;

  constructor(public navParams: NavParams) {
    this.product = this.navParams.data.product;
  }
}