import { Injectable } from '@angular/core';

import { SettingsCache } from '../../../providers/settings-cache';

import { Product } from '../../../models/product';

/**
 * Utility class for product img component. 
 */
@Injectable()
export class ProductImgUtil {      

  constructor(public settingsProvider: SettingsCache) {}
  
  buildProductImgUrl(product: Product): string {
    let name = product.name;
    let category = product.category;
    let type = product.properties.type || "";

    let finalUrl = this.settingsProvider.getImgServerUrl() + 
      "/" + category + "/" + type + "/" + name + "-S.jpg";
        
    return finalUrl;
  }
}