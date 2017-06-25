import { Component, ElementRef, Renderer } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, Alert, FabContainer } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import 'rxjs/add/observable/from';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged"
import "rxjs/add/operator/switchMap";

import { ProductDetailPage } from './product-detail/product-detail';

import { Connection } from '../../providers/connection';
import { Products } from '../../providers/products';
import { ProductsUtil } from './products-util';
import { TunariMessages } from '../../providers/tunari-messages';
import { TunariNotifier } from '../../providers/tunari-notifier';

import { Product } from '../../models/product';

@Component({  
  selector: 'page-products',
  templateUrl: 'products.html',
  providers: [ProductsUtil]
})
export class ProductsPage {

  private products: Product[];

  private searchQuery: FormControl = new FormControl();
  
  private page: number = 0;

  private selectedPrice: string;

  private selectedPriceText: string;

  constructor(public navCtrl: NavController,    
    public keyboard: Keyboard,
    public renderer: Renderer,
    private elRef:ElementRef,
    public productsProvider: Products,
    public util: ProductsUtil, 
    public notifier: TunariNotifier,
    public messages: TunariMessages,
    public connection: Connection) {
    
    this.setDefaultValues();
    this.setupKeyboard();
    this.initFavorites();    
    this.initSearchQuery();
  }    

  public pullNextProductsPage(infiniteScroll) {
        
    if(this.page > 0 && this.connection.isConnected()) {
      this.page ++;
      console.log('Pulling page ' + this.page + '...');
      this.productsProvider.get(this.searchQuery.value, this.page)
      .map(productsObject => productsObject.items)
      .subscribe( 
        products => this.products.push(...products),
        null,
        () => {
          infiniteScroll.complete();
          console.log('Finished pulling page successfully');
      });
    } else {
      infiniteScroll.complete();
    }    
  }

  goToProductDetails(product: Product) {
    this.navCtrl.push(ProductDetailPage, {
      product: product
    });
  }

  onSearchClear(event) {
    this.blurSearchBar();
  }

  selectPriceToShow(fab: FabContainer) {
    fab.close();
    let alert: Alert = this.util.getSelectPriceAlert(this.selectedPrice);
        
    alert.addButton({
      text: 'OK',
      handler: key => {
        this.selectedPrice = key;
        this.selectedPriceText = this.util.getSelectedPriceText(key);
      }
    });
    alert.present();
  }

  private setDefaultValues() {
    this.selectedPrice = "clientPackagePrice";
    this.selectedPriceText 
      = this.util.getSelectedPriceText(this.selectedPrice);
  }

  private setupKeyboard() {
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.blurSearchBar();
    });
  }

  private blurSearchBar() {
    const searchInput = this.elRef.nativeElement.querySelector('.searchbar-input')    
    this.renderer
      .invokeElementMethod(searchInput, 'blur');
  }

  private initFavorites() {
    this.page = 0;
    this.productsProvider.getFavorites().then(productsObject => {
      if(productsObject) {
        console.log("Favorites pulled from storage...");
        this.products = productsObject.items;
        this.productsProvider.loadFavoritesFromServer().subscribe();
      } else {
        console.log("Favorites pulled from the server...");
        let loader = this.notifier.createLoader("Cargando Novedades");
        this.productsProvider.loadFavoritesFromServer()
          .map(productsObject => productsObject.items)
          .subscribe(products => {
            this.products = products
            loader.dismiss();
          });          
      }
    });
  }

  private initSearchQuery() {
    this.searchQuery.valueChanges
      .filter(query => query)
      .filter(query => this.connection.isConnected())
      .debounceTime(100)
      .distinctUntilChanged()
      .switchMap(query => this.productsProvider.get(query))
      .map(productsObject => productsObject.items)
      .subscribe(products => {
        this.page = 1;
        this.products = products
      });

    this.searchQuery.valueChanges
      .filter(query => query)
      .filter(query => !this.connection.isConnected())
      .subscribe(() => this.notifier.createToast(this.messages.noInternetError));
    
    this.searchQuery.valueChanges
      .filter(query => !query)
      .subscribe(() => this.initFavorites());
  }
}
