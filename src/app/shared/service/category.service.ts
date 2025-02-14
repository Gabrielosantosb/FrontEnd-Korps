import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CategoryModel} from "../interface/category.model";
import {CategoryRequestModel} from "../model/Category/category-request.model";
import {environment} from "../../../env/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly ROUTE = `${environment.apiUrl}/Category`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategoryModel[]>{
    return this.http.get<CategoryModel[]>(`${this.ROUTE}/get-categories`);
  }

  createCategory(categoryRequest: CategoryRequestModel ): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(`${this.ROUTE}/create-category`, categoryRequest, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
