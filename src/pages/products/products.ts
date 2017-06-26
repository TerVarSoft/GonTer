import { Component, ElementRef, Renderer } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, Alert, FabContainer } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import 'rxjs/add/observable/from';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged"
import "rxjs/add/operator/switchMap";

import { ProductDetailPage } from './product-detail/product-detail';
import { ProductUpdatePage } from './product-update/product-update';

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

  /** Main Page functions */

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

  onSearchClear(event) {
    this.blurSearchBar();
  }

  /** Main Fab button functions. */

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

  createProduct(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(ProductUpdatePage, {
      product: new Product()
    });
  }

  /** Individual Products functions. */

  goToProductDetails(product: Product) {
    this.navCtrl.push(ProductDetailPage, {
      product: product
    });
  }

  addPriceWhenNoPrice(event, product:Product) {
    event.stopPropagation();

    let alert: Alert = this.util.getAddPriceAlert(product, this.selectedPrice);    
    alert.addButton({
      text: 'Guardar',
      handler: data => {
        let saveProductLoader = this.notifier.createLoader(`Salvando ${product.name}`);
        product[this.selectedPrice] = data.price;
        this.productsProvider.put(product).subscribe(() => {
          saveProductLoader.dismiss();
          
          if(product.isFavorite) {
            this.updateFavoritesInBackground();
          }
        });
      }
    });

    alert.present();
  }

  /** Private functions */

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
        this.updateFavoritesInBackground();
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

  private updateFavoritesInBackground() {
    // Update storage in backgroun with server response.
    console.log("Updating product favorites in background");
    this.productsProvider.loadFavoritesFromServer().subscribe();
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
