/**
 * Product model.
 */
export class Product {

  _id: string;

  name: string;

  category: string;

  properties: any;  

  locations: any[];

  isFavorite: boolean;

  publicPackagePrice: number;

  publicUnitPrice: number;

  clientPackagePrice: number;

  clientUnitPrice: number;

  thumbnailUrl: string;

  provider: string;

  quantityPerPackage: number;

  quantity: number;

  tags: string[];
}