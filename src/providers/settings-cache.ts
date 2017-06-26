import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Settings } from './settings';
import { TunariStorage } from './tunari-storage';

/**
 * Settings Cache provider. 
 */
@Injectable()
export class SettingsCache {  

  settings: any;

  priceTypes: Map<string, string> = new Map();

  constructor(public settingsProvider: Settings, 
    public storage: TunariStorage) {
      this.buildPriceTypes();
  }

  getImgServerUrl() : string {
    return this.settings.filter(setting => setting.key === 'imgServer')[0].value;
  }

  getProductCategories() : string[] {    
    return this.settings.filter(setting => setting.key === 'productCategories')[0].value;
  } 

  getPriceTypes() : Map<string, string> {    
    return this.priceTypes;
  }

  getPriceTypeText(key: string) : string {    
    return this.priceTypes.get(key);
  } 

  loadFromStorage() {    
    return this.storage.getSettings().then(settings => {
      this.setSettings(settings);
      return settings;
    });    
  }

  loadFromServer() {
    return this.settingsProvider.get()
      .map(settingsResponse => settingsResponse.items)
      .map(settings => {
        this.storage.setSettings(settings);
        this.setSettings(settings);

        return settings;
      });    
  }

  setSettings(settings: any) {
    this.settings = settings;    
  }

  private buildPriceTypes() {
    this.priceTypes.set("clientUnitPrice", "Unidad Cliente"); 
    this.priceTypes.set("clientPackagePrice", "Paquete Cliente"); 
    this.priceTypes.set("publicUnitPrice", "Unidad Publico"); 
    this.priceTypes.set("publicPackagePrice", "Paquete Publico");     
  }
}