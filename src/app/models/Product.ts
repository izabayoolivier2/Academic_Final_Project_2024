// Product.ts

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    points: number;
    variants: any[];
    main_image_url: string;
    images: string[];
    sizes: string[];
    status: "جديد" | "عرض محدود" | "نفذت الكمية" | "50%";
    ratings: number;
    allOfSizes?: string[];
    variantType: string;
    product_features: string[];
    likes: string[];
    size_id: string;
    featured: boolean;
    lastStockUpdate: string; // You can use Date if you parse it properly
    category_id: string;
    createdDate: string; // You can use Date if you parse it properly
    lastUpdateDate: string; // You can use Date if you parse it properly
    discountPrice: number;
    discountPercentage: number;
  }
  