import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != theKeyWord) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyWord;
    console.log(`keyword: ${theKeyWord}, thePageNumber: ${this.thePageNumber}`)
    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyWord).subscribe(this.processResult());
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    // now get the products for the given category id

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId: ${this.currentCategoryId}, thePageNumber: ${this.thePageNumber}`)
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(this.processResult());
  }

  private processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to Cars: ${theProduct.name}, ${theProduct.unitPrice}`);
    const cartItem = new CartItem(theProduct);
    this.cartService.addToCart(cartItem);
  }

}
