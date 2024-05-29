export default interface ShippingAddress {
    owner: string; // User ID of the owner
    address: string;
    apartment: string;
    city: string;
    country: string;
    province: string;
    postalCode: string;
    district: string;
    street: string;
    house: string;
    addressType: 'home' | 'office';
  }