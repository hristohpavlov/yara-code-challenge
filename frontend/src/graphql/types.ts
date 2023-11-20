export interface Product {
    id: string;
    name: string;
    size: number;
    hazardous: boolean;
  }
  
  export interface Warehouse {
    id: string;
    name: string;
    size: number;
    products: Product;
    hazardous: Boolean;
  }
  
  export interface Movement {
    id: string;
    date: string;
    type: string;
    amount: number;
    product: Product;
    warehouse: Warehouse;
  }