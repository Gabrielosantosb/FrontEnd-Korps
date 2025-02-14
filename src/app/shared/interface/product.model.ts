import {CategoryModel} from "./category.model";

export interface ProductModel {
  productId: number;
  productName: string;
  productPrice: number;
  dateCreated: Date;
  updatedAt: Date;
  isActive: boolean
  categoryId: number
  category: CategoryModel;
}

export interface PaginatedProducts {
  totalCount: number;
  products: ProductModel[];
}
