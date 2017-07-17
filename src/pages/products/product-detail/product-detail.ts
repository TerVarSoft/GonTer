import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProductUpdatePage } from '../product-update/product-update';

import { Product } from '../../../models/product';

@Component({
  selector: 'product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {

  segment = 'prices';

  product: Product;

  constructor(public navParams: NavParams, public navCtrl: NavController) {
    this.product = this.navParams.data.product;
  }

  editProduct() {
    this.navCtrl.push(ProductUpdatePage, {
      product: this.product
    });
  }
}