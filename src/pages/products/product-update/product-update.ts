import { Component } from '@angular/core';
import { NavParams, AlertController, NavController } from 'ionic-angular';


import { Products } from '../../../providers/products';
import { TunariNotifier } from '../../../providers/tunari-notifier';
import { SettingsCache } from '../../../providers/settings-cache';

import { Product } from '../../../models/product';

@Component({
  selector: 'product-update',
  templateUrl: 'product-update.html',
})
export class ProductUpdatePage {

  private INVITATION_TYPE: string = 'Invitaciones';

  segment = 'general';

  isInvitation: boolean;

  product: Product;

  categories: any[];

  invitationTypes: string[];

  constructor(public navParams: NavParams,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public productsProvider: Products,
    public notifier: TunariNotifier,
    private settingsProvider: SettingsCache) {
    this.product = this.navParams.data.product;

    this.categories = settingsProvider.getProductCategories();
    this.invitationTypes = settingsProvider.getInvitationTypes();

    this.product.category = this.product.category || this.categories[0].name;
    this.product.properties = this.product.properties || {};
    this.product.properties.type = this.product.properties.type || this.invitationTypes[0];
    this.product.tags = this.product.tags || [];
    this.product.properties = this.product.properties || {type: "", size: "", genre: ""};
    this.product.locations = this.product.locations || [];

    this.isInvitation = this.product.category == this.INVITATION_TYPE;
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
}