import { BrowserModule } from '@angular/platform-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from "@ionic-native/network";

import { GrafTunariApp } from './app.component';
import { ProductsPage } from '../pages/products/products';
import { ProductDetailPage } from '../pages/products/product-detail/product-detail';
import { ProductUpdatePage } from '../pages/products/product-update/product-update';
import { LoginPage } from '../pages/login/login';
import { ProductImgComponent } from '../pages/products/product-img/product-img.component';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';

import { Connection } from '../providers/connection';
import { Login } from '../providers/login';
import { TunariNotifier } from '../providers/tunari-notifier';
import { TunariMessages } from '../providers/tunari-messages';
import { Products } from '../providers/products';
import { Settings } from '../providers/settings';
import { SettingsCache } from '../providers/settings-cache';
import { TunariApi } from '../providers/tunari-api';
import { TunariStorage } from '../providers/tunari-storage';

export function providers() {
  return [    
    Connection,
    Keyboard,
    Login,    
    Network,
    Products,    
    Settings,
    SettingsCache,
    SplashScreen,
    StatusBar,    
    TunariApi,
    TunariMessages,
    TunariNotifier,
    TunariStorage,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: [
    GrafTunariApp,
    ProductsPage,
    ProductDetailPage,
    ProductUpdatePage,
    LoginPage,
    ProductImgComponent,
    SafeUrlPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(GrafTunariApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    GrafTunariApp,
    ProductsPage,
    ProductDetailPage,
    ProductUpdatePage,
    LoginPage
  ],
  providers: providers()
})
export class AppModule {}
