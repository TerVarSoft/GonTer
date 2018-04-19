import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProductUpdatePage } from '../product-update/product-update';

import { Product } from '../../../models/product';

import { ProductsUtil } from './../products-util';

@Component({
  selector: 'product-detail',
  templateUrl: 'product-detail.html',
  providers: [ProductsUtil]
})
export class ProductDetailPage {

  segment = 'prices';

  product: Product;

  priceTypes: any[];

  constructor(public navParams: NavParams, public navCtrl: NavController, public util: ProductsUtil) {
    this.product = this.navParams.data.product;
    this.priceTypes = this.util.getPriceTypes(this.product.category);
  }

  editProduct() {
    this.navCtrl.push(ProductUpdatePage, {
      product: this.product
    });
  }
}