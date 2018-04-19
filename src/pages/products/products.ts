import { Component, ElementRef, Renderer } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, NavParams, ActionSheetController, Platform, Alert, FabContainer } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import 'rxjs/add/observable/from';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged"
import "rxjs/add/operator/switchMap";

import { ProductDetailPage } from './product-detail/product-detail';
import { ProductUpdatePage } from './product-update/product-update';
import { ProductSellingUpdatePage } from './../products-sellings/product-selling-update/product-selling-update'

import { Connection } from '../../providers/connection';
import { Products } from '../../providers/products';
import { Sellings } from '../../providers/sellings';
import { ProductsUtil } from './products-util';
import { TunariMessages } from '../../providers/tunari-messages';
import { TunariNotifier } from '../../providers/tunari-notifier';

import { Product } from '../../models/product';
import { Selling } from '../../models/selling';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
  providers: [ProductsUtil]
})
export class ProductsPage {

  private products: Product[];

  private searchQuery: FormControl = new FormControl();

  private page: number = 0;

  private selectedPrice: number = 0;

  private selectedPriceText: string;

  constructor(public platform: Platform,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public keyboard: Keyboard,
    public renderer: Renderer,
    private elRef: ElementRef,
    public productsProvider: Products,
    public sellingsProvider: Sellings,
    public util: ProductsUtil,
    public notifier: TunariNotifier,
    public messages: TunariMessages,
    public connection: Connection,
    public params: NavParams) {

    this.setDefaultValues();
    this.setupKeyboard();
    this.initFavorites();
    this.initSearchQuery();
  }

  /** Main Page functions */

  public pullNextProductsPage(infiniteScroll) {

    if (this.page > 0 && this.connection.isConnected()) {
      this.page++;
      console.log('Pulling page ' + this.page + '...');
      const queryString = `${this.params.data.productCategory} ${this.searchQuery.value}`;
      this.productsProvider.get(queryString, this.page)
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
    let alert: Alert = this.util.getSelectPriceAlert(this.params.data.productCategory, this.selectedPrice);

    alert.addButton({
      text: 'OK',
      handler: key => {
        this.selectedPrice = key;
        this.selectedPriceText = this.util.getSelectedPriceText(this.params.data.productCategory, key);
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

  addPriceWhenNoPrice(event, product: Product) {
    event.stopPropagation();

    let alert: Alert = this.util.getAddPriceAlert(product, this.selectedPrice);
    alert.addButton({
      text: 'Guardar',
      handler: data => {
        let saveProductLoader = this.notifier.createLoader(`Salvando ${product.name}`);
        product.prices[this.selectedPrice].value = data.price;
        this.productsProvider.put(product).subscribe(() => {
          saveProductLoader.dismiss();

          if (product.isFavorite) {
            this.updateFavoritesInBackground();
          }
        });
      }
    });

    alert.present();
  }

  setProductQuantity(event, product: Product) {
    event.stopPropagation();

    let alert: Alert = this.util.getAddQuantityAlert(product);
    alert.addButton({
      text: 'Guardar',
      handler: data => {
        let saveProductLoader = this.notifier.createLoader(`Salvando ${product.name}`);
        product.quantity = data.quantity;
        this.productsProvider.put(product).subscribe(() => {
          saveProductLoader.dismiss();

          if (product.isFavorite) {
            this.updateFavoritesInBackground();
          }
        });
      }
    });

    alert.present();
  }

  createSelling(event, product: Product) {
    event.stopPropagation();

    this.navCtrl.push(ProductSellingUpdatePage, {
      selling: {},
      product: product
    });
  }

  openProductOptions(event, product) {
    event.stopPropagation();

    let actionSheet = this.actionSheetCtrl.create({
      title: product.name,
      cssClass: 'product-options',
      buttons: [
        {
          text: 'Ver',
          icon: !this.platform.is('ios') ? 'eye' : null,
          handler: () => {
            this.navCtrl.push(ProductDetailPage, {
              product: product
            });
          }
        }, {
          text: 'Editar',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            this.navCtrl.push(ProductUpdatePage, {
              product: product
            });
          }
        }, {
          text: 'Eliminar',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.removeProduct(product);
          }
        }
      ]
    });
    actionSheet.present();
  }

  /** Private functions */

  private setDefaultValues() {
    this.selectedPrice = 0;
    this.selectedPriceText
      = this.util.getSelectedPriceText(this.params.data.productCategory, this.selectedPrice);
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

  private removeProduct(productToDelete) {
    let removeProductAlert: Alert = this.util.getRemoveProductAlert(productToDelete.name);

    removeProductAlert.addButton({
      text: 'Borralo!',
      handler: () => {
        let removeProductLoader =
          this.notifier.createLoader(`Borrando el Producto ${productToDelete.name}`);
        this.productsProvider.remove(productToDelete).subscribe(() => {
          this.products =
            this.products.filter(product => product.name !== productToDelete.name)
          removeProductLoader.dismiss();
        });
      }
    });

    removeProductAlert.present();
  }

  private initFavorites() {
    this.page = 0;
    this.productsProvider.getFavorites(this.params.data.productCategory)
      .then(cachedFavorites => {
        if (cachedFavorites && cachedFavorites.length > 0) {
          console.log("Favorites pulled from storage...");
          this.products = cachedFavorites;
          this.updateFavoritesInBackground();
        } else {
          console.log("Favorites pulled from the server...");
          let loader = this.notifier.createLoader("Cargando Novedades");
          this.productsProvider.loadFavoritesFromServer(this.params.data.productCategory)
            .map(productsObject => productsObject.items)
            .subscribe(products => {
              this.products = products
              loader.dismiss();
            });
        }
      });
  }

  private updateFavoritesInBackground() {
    // Update storage in background with server response.
    console.log("Updating product favorites in background");
    this.productsProvider.loadFavoritesFromServer(this.params.data.productCategory)
      .subscribe();
  }

  private initSearchQuery() {
    this.searchQuery.valueChanges
      .filter(query => query)
      .filter(query => this.connection.isConnected())
      .map(query => `${this.params.data.productCategory} ${query}`)
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
