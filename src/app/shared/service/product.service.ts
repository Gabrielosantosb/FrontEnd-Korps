import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PaginationModel} from "../model/Pagination/pagination.model";
import {Observable} from "rxjs";
import {ProductFilterModel} from "../model/Product/product-filter.model";
import {PaginatedProducts, ProductModel} from "../interface/product.model";
import {ProductRequestModel} from "../model/Product/product-request.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // TODO Colocar em outro lucar as env
  readonly ROUTE = 'https://localhost:7043/api/Product';
  constructor(private http: HttpClient) { }


  getProducts(leadFilter?: ProductFilterModel, pagination?: PaginationModel): Observable<PaginatedProducts> {
    console.log('aqui no service')
    const params = this.serializeParams({ ...leadFilter, ...pagination });

    return this.http.get<PaginatedProducts>(`${this.ROUTE}/get-products`, { params });
  }

  createProduct(productRequest: ProductRequestModel): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${this.ROUTE}/create-product`, productRequest, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  updateProduct(productId: number, updateRequest: ProductRequestModel): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${this.ROUTE}/update-product/${productId}`, updateRequest, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  toggleProductStatus(productId: number, isActive: boolean): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${this.ROUTE}/toggle-product-status/${productId}`, isActive, {
      headers: { 'Content-Type': 'application/json' },
    });
  }



  // TODO Arranjar uma outra forma de resolver os params
  private serializeParams(params: any): { [param: string]: string } {
    return Object.fromEntries(
      Object.entries(params || {}).map(([key, value]) => [
        key,
        value instanceof Date ? value.toISOString() : value?.toString() ?? '',
      ])
    );
  }
}
