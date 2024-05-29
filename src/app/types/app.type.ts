export interface UserProps {
  userId: String;
  id: string;
  uid: string;
  email: string;
  phone: string;
  names: string;
  username: string;
  password?: string;
  profile_url: string;
  role: string;
  about: string;
  gender: string;
  address: string;
  dateOfBirth: string;
  receiveNews: boolean;
  main_image_url: string;
} 

export interface ProductThunkProp {
  group: String;
  discountPercentage: number;
  points: number;
  main_image_url: string;
  product_id: string;
  category_id: string;
  description: string;
  name: string;
  price: number;
  quantity: number;
}


export interface WalletProp {
  userId: string;
  points: number;
}

export interface OrderProp {
  productId: string;
    main_image_url: string;
    price: number;
    name: string;
    quantity: number;
    owner: string;
    points: number;
    status: string;
}