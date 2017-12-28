import { Component } from '@angular/core';

import { ProductsPage } from '../products/products';
import { ProductsSellingsPage } from '../products-sellings/products-sellings';
import { ProductsWarehousePage } from '../products-warehouse/products-warehouse';

@Component({
  selector: 'products-tabs',
  templateUrl: 'products-tabs.html'
})
export class ProductsTabsPage {
  tab1Root: any = ProductsWarehousePage;
  tab2Root: any = ProductsPage;
  tab3Root: any = ProductsSellingsPage;

  tab1Title = "Deposito";
  tab2Title = "Productos";
  tab3Title = "Ventas";
}
