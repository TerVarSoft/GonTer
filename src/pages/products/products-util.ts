import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';

import { SettingsCache } from '../../providers/settings-cache';

import { Product } from '../../models/product';

/**
 * Utility class for products endpoint provider. 
 */
@Injectable()
export class ProductsUtil {  

  packageKey: string = "Paquete";

  constructor(public alertCtrl: AlertController,
    private settingsProvider: SettingsCache) {}

  getSelectPriceAlert(selectedPrice: string): Alert {
    let alert = this.alertCtrl.create();

    alert.setTitle('Precio');

    const priceTypes: Map<string, string> = 
      this.settingsProvider.getPriceTypes();
      
    priceTypes.forEach((priceTypeValue, priceTypeKey) =>  {
      alert.addInput({
        type: 'radio',
        label: priceTypeValue,
        value: priceTypeKey,
        checked: selectedPrice === priceTypeKey
      });
    });    

    alert.addButton('Cancel');

    return alert;
  }

  getSelectedPriceText(key): string {    
    return this.settingsProvider.getPriceTypeText(key);
  }
}