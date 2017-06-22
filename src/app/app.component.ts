import { Component } from '@angular/core';
import { LoadingController, AlertController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from "@ionic-native/network";

import { ProductsPage } from '../pages/products/products';
import { LoginPage } from '../pages/login/login';

import { Connection } from '../providers/connection';
import { Login } from '../providers/login';
import { SettingsCache } from '../providers/settings-cache';
import { TunariMessages } from '../providers/tunari-messages';
import { TunariNotifier } from '../providers/tunari-notifier';
import { TunariStorage } from '../providers/tunari-storage';

import { UserToken } from '../models/user-token';

@Component({
  templateUrl: 'app.html',
})
export class GrafTunariApp {
  
  rootPage:any = LoginPage;

  private userToken: UserToken;

  private isReady: boolean = false;

  constructor(
    public platform: Platform, 
    statusBar: StatusBar,
    public network: Network, 
    splashScreen: SplashScreen,    
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,    
    public storage: TunariStorage,
    public messages: TunariMessages,
    public notifier: TunariNotifier,
    public settingsProvider: SettingsCache,
    public login: Login,
    public connection: Connection
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.network.onDisconnect().subscribe(() => {
        this.notifier.createToast(this.messages.noInternetError);
      });

      this.network.onConnect().subscribe(() => {
        this.notifier.createToast(this.messages.connectedToInternet);
      });

      if(!connection.isConnected()) {
        this.notifier.createToast(this.messages.noInternetError);
      }
    });

    this.setRootPage();    
  }

  private setRootPage() {
    this.storage.getAuthtoken().then(token => {
      if(token) {  
        this.rootPage = ProductsPage;
        this.loadConfiguration();
      } else {
        this.finishLoading();        
      }
    });
  }
 
  private loadConfiguration() {    
    
    this.settingsProvider.loadFromStorage().then(settings => {
      if(settings) {
        console.log("Settings loaded from local storage...");
        this.finishLoading();
        this.settingsProvider.loadFromServer().subscribe();
      } else {
        let loader = this.notifier.createLoader(this.messages.loadingSettings);
        this.settingsProvider.loadFromServer().subscribe(() => {
          console.log("Settings loaded from the server...");
          this.finishLoading();
          loader.dismiss();          
        });
      }                  
    });    
  }  

  private finishLoading() {
    this.isReady = true;           
  }
}

