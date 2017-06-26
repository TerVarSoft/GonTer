import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Product } from '../../../models/product';

@Component({
  selector: 'product-update',
  templateUrl: 'product-update.html',
})
export class ProductUpdatePage {

  segment = 'prices';

  product: Product;

  constructor(public navParams: NavParams) {
    this.product = this.navParams.data.product;
  }
}