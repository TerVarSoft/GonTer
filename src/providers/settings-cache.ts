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

  constructor(public settingsProvider: Settings, 
    public storage: TunariStorage) {
  }

  getImgServerUrl() : string {
    return this.settings.filter(setting => setting.key === 'imgServer')[0].value;
  }

  getProductCategories() : any[] {    
    return this.settings.filter(setting => setting.key === 'productCategories')[0].value;
  }

  getInvitationTypes() : string[] {    
    return this.settings.filter(setting => setting.key === 'invitationTypes')[0].value;
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
}