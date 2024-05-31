export type User = {
  id: string;
  name: string;
  username: string;
  password?: string;
  image: string;
};

export interface Product {
  product_id: string;
  category_id: string;
  description: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cake {
  title: string;
  price: number;
  desc: string;
  image: string;
}

export interface Order {
  eventType: string;
  total: number;
  services: any[];
  customerInfo: any;
  error: string | null;
}