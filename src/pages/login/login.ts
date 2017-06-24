import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from 'ionic-angular';

import { ProductsPage } from '../../pages/products/products';

import { Login } from '../../providers/login';
import { SettingsCache } from '../../providers/settings-cache';
import { TunariMessages } from '../../providers/tunari-messages';
import { TunariNotifier } from '../../providers/tunari-notifier';
import { TunariStorage } from '../../providers/tunari-storage';

import { UserToken } from '../../models/user-token';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: {username?: string, password?: string} = {};
  submitted: boolean = false;
  isLoggedIn: boolean = true;
  
  constructor(public navCtrl: NavController,
    public loginService: Login,
    public settingsProvider: SettingsCache,
    public notifier: TunariNotifier,
    public storage: TunariStorage,
    public messages: TunariMessages) { 
      this.storage.getAuthtoken().then(token => {
        if(!token) {            
          this.isLoggedIn = false;          
        } else {
          this.loadConfiguration();
        }
      });
  }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {  
      let loader = this.notifier.createLoader(this.messages.authenticating);
      this.loginService.post(this.login.username, this.login.password)
        .subscribe(resp => {
          const userToken: UserToken = resp;
          this.storage.setAuthToken(userToken.token).then(() => {
            console.log("Token Authentication: " + userToken.token);
            loader.dismiss(); 
            this.loadConfiguration(); 
          });                                                                    
        });
    }    
  }

  private loadConfiguration() {    
    
    this.settingsProvider.loadFromStorage().then(settings => {
      if(settings) {
        console.log("Settings loaded from local storage...");
        this.navCtrl.setRoot(ProductsPage);

        console.log("Updating settings from server in background...");
        this.settingsProvider.loadFromServer().subscribe();
      } else {
        let loader = this.notifier.createLoader(this.messages.loadingSettings);
        this.settingsProvider.loadFromServer().subscribe(() => {
          console.log("Settings loaded from the server...");
          this.navCtrl.setRoot(ProductsPage);
          loader.dismiss();          
        });
      }                  
    });    
  } 
}
