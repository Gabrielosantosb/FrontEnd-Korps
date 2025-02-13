export interface ProductFilterModel{
  productName : string;
  dateCreatedStart : Date;
  dateCreatedEnd : Date;
  minPrice : number;
  maxPrice : number;
  isActive : boolean;
}
