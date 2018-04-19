import { ProductPrice } from "./product-price";

/**
 * Product model.
 */
export class Product {

  _id: string;

  name: string;

  category: string;

  description: string;

  properties: any;  

  prices: ProductPrice[];

  buyingUnitPrice: number;

  locations: any[];

  isFavorite: boolean;

  publicPackagePrice: number;

  publicUnitPrice: number;

  clientPackagePrice: number;

  clientUnitPrice: number;

  thumbnailUrl: string;

  previewUrl: string;

  imageUrl: string;

  provider: string;

  quantityPerPackage: number;

  quantity: number;

  tags: string[];
}