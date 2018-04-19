import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';

import { SettingsCache } from '../../providers/settings-cache';

import { Product } from '../../models/product';

/**
 * Utility class for products endpoint provider. 
 */
@Injectable()
export class ProductsUtil {

  constructor(public alertCtrl: AlertController,
    private settingsProvider: SettingsCache) { }
  
  /* *Get Alert helper methods */

  getSelectPriceAlert(selectedProductCategory: string, selectedPrice: number): Alert {
    let productCategory =
      this.settingsProvider.getProductCategories().filter(category => category.name == selectedProductCategory)[0];

    let alert = this.alertCtrl.create();

    alert.setTitle('Precio');

    productCategory.priceTypes.forEach(priceType => {
      alert.addInput({
        type: 'radio',
        label: priceType.name,
        value: priceType.id,
        checked: selectedPrice === priceType.id
      });
    });

    alert.addButton('Cancel');

    return alert;
  }

  getAddPriceAlert(product: Product, selectedPriceType: number) {
    let alert = this.alertCtrl.create({
      title: product.name,
      message: this.getSelectedPriceText(product.category, selectedPriceType),
      inputs: [
        {
          name: 'price',
          type: 'number',
          placeholder: 'Agrega un precio!',
          value: "" + product.prices[selectedPriceType].value
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        }
      ]
    });

    return alert;
  }

  getAddQuantityAlert(product: Product) {
    let alert = this.alertCtrl.create({
      title: product.name,
      message: "Cantidad",
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Especifica la cantidad!',
          value: "" + product.quantity
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        }
      ]
    });

    return alert;
  }

  getCreateSellingAlert(product: Product) {
    let alert = this.alertCtrl.create({
      title: "Nueva Venta",
      message: product.name,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Especifica la cantidad!'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        }
      ]
    });

    return alert;
  }

  getRemoveProductAlert(productName: string) {
    let alert = this.alertCtrl.create({
      title: 'Borrando!',
      message: `Estas Seguro de borrar el producto ${productName}`,
      buttons: [
        {
          text: 'Cancelar',
        }
      ]
    });

    return alert;
  }

  getPriceTypes(selectedProductCategory: string): any[] {
    let productCategory =
      this.settingsProvider
      .getProductCategories()
      .filter(category => category.name == selectedProductCategory)[0];
 
    return productCategory.priceTypes;
  }

  getSelectedPriceText(selectedCategory: string, priceTypeId: number): string {
    let priceName =
      this.settingsProvider
      .getProductCategories()
      .filter(category => category.name == selectedCategory)[0]
      .priceTypes[priceTypeId]
      .name;
    return priceName;
  }
}