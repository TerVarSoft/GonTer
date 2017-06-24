import { ProductPrice } from './productPrice';

/**
 * Product model.
 */
export class Product {

  name: string;

  category: string;

  properties: any;  

  publicPackagePrice: ProductPrice;
  
  publicPrices: ProductPrice[];

  thumbnailUrl: string;
}