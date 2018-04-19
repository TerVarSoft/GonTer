import { Component } from '@angular/core';
import { NavParams, AlertController, NavController } from 'ionic-angular';

import { Products } from '../../../providers/products';
import { ProductsUtil } from './../products-util';
import { TunariNotifier } from '../../../providers/tunari-notifier';
import { SettingsCache } from '../../../providers/settings-cache';

import { Product } from '../../../models/product';
import { ProductPrice } from '../../../models/product-price';

@Component({
  selector: 'product-update',
  templateUrl: 'product-update.html',
  providers: [ProductsUtil]
})
export class ProductUpdatePage {

  private INVITATION_TYPE: string = 'Invitaciones';

  segment = 'general';

  isInvitation: boolean;

  product: Product;

  categories: any[];

  invitationTypes: string[];

  priceTypes: any[]

  constructor(public navParams: NavParams,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public util: ProductsUtil,
    public productsProvider: Products,
    public notifier: TunariNotifier,
    private settingsProvider: SettingsCache) {
    this.product = this.navParams.data.product;

    this.categories = settingsProvider.getProductCategories();
    this.invitationTypes = settingsProvider.getInvitationTypes();
    this.product.category = this.product.category || this.categories[0].name;

    this.product.properties = this.product.properties || {};
    this.product.tags = this.product.tags || [];
    this.product.locations = this.product.locations || [];

    this.initCategory();
  }

  public initCategory() {
    this.isInvitation = this.product.category == this.INVITATION_TYPE;
    this.initProperties();
    this.initProductPrices();
  }

  public initProperties() {
    this.product.properties = this.isInvitation ?
      (this.product.properties || { type: "", size: "", genre: "" }) :
      {};

    this.product.properties.type = this.isInvitation ?
      (this.product.properties.type || this.invitationTypes[0]) :
      null;
  }

  public initProductPrices() {
    // Init product prices
    this.priceTypes = this.util.getPriceTypes(this.product.category);
    this.product.prices = this.product.prices || [];
    this.product.prices = this.priceTypes.map(priceType => {
      let productPrice: ProductPrice = {
        type: priceType.id,
        value: this.product.prices[priceType.id] ?
          this.product.prices[priceType.id].value :
          undefined
      };

      return productPrice;
    })
  }

  addTag() {
    let addTagAlert = this.alertCtrl.create({
      title: 'Agregar Etiqueta',
      message: this.product.name,
      inputs: [
        {
          name: 'newTag',
          placeholder: 'Nueva Etiqueta'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Agregar',
          handler: data => {
            this.product.tags.unshift(data.newTag);
          }
        }
      ]
    });
    addTagAlert.present();
  }

  save() {
    let createProductLoader = this.notifier.createLoader(`Guardando producto ${this.product.name}`);
    this.productsProvider.save(this.product).subscribe(() => {
      this.updateFavoritesInBackground();
      this.navCtrl.pop();
      createProductLoader.dismiss();
    });
  }

  removeTag(tagToRemove: string) {
    this.product.tags = this.product.tags.filter(tag => tag !== tagToRemove);
  }

  addWarehouseLocation() {
    this.addLocation("Deposito");
  }

  addStoreLocation() {
    this.addLocation("Tienda");
  }

  private addLocation(type: string) {
    let addLocationAlert = this.alertCtrl.create({
      title: 'Agregar Ubicacion',
      message: type,
      inputs: [
        {
          name: 'newLocation',
          placeholder: 'Nueva Ubicacion'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Agregar',
          handler: data => {
            this.product.locations.unshift({
              type: type,
              value: data.newLocation
            });
          }
        }
      ]
    });
    addLocationAlert.present();
  }

  removeLocation(locationToRemove) {
    this.product.locations = this.product.locations.filter(location => location !== locationToRemove);
  }

  private updateFavoritesInBackground() {
    console.log("Updating product favorites in background");
    // Just update, no need to retrieve the favorites so sending ""
    // to this method
    this.productsProvider.loadFavoritesFromServer("")
      .subscribe();
  }
}