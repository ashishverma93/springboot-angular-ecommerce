import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8080/api/products"
  private categoryUrl = "http://localhost:8080/api/product-category"

  constructor(private httpClient: HttpClient) { }

  // getProductList(currentCategoryId: number): Observable<Product[]> {
  //   return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
  //     map(response => response._embedded.products)
  //   );
  // }

  getProductListPaginate(thePage: number,
    thePageSize: number,
    currentCategoryId: number): Observable<GetResponseProduct> {
    var url = `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProduct>(url);
  }

  getProductList(currentCategoryId: number): Observable<Product[]> {
    var url = `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`;
    return this.getProducts(url);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    var url = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(url);
  }

  searchProductsPaginate(thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<GetResponseProduct> {
    var url = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProduct>(url);
  }

  private getProducts(url: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(url).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number) {
    var url = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(url).pipe(
      map(response => response)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}
interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number,
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
