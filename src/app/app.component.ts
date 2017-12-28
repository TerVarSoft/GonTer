import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from "@ionic-native/network";

import * as moment from 'moment';

import { LoginPage } from '../pages/login/login';

import { Connection } from '../providers/connection';
import { TunariMessages } from '../providers/tunari-messages';
import { TunariNotifier } from '../providers/tunari-notifier';
import { TunariStorage } from '../providers/tunari-storage';

@Component({
  templateUrl: 'app.html',
})
export class GrafTunariApp {
  
  @ViewChild('rootNavController') navCtrl: NavController;

  rootPage:any = LoginPage;

  constructor(
    public platform: Platform, 
    statusBar: StatusBar,
    public network: Network, 
    splashScreen: SplashScreen,    
    public storage: TunariStorage,
    public messages: TunariMessages,
    public notifier: TunariNotifier,
    public connection: Connection
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      moment.locale('es');

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
  }

  onLogout() {
    this.storage.removeStorage();
    this.navCtrl.setRoot(LoginPage);
  }
}

