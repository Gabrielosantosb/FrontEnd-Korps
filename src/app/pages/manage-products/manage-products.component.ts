import {Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, finalize, Subject, takeUntil, throwError} from "rxjs";
import {ProductService} from "../../shared/service/product.service";
import {CategoryService} from "../../shared/service/category.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "../../shared/utils/messageService";
import {HttpErrorResponse} from "@angular/common/http";
import {ProductModel} from "../../shared/interface/product.model";
import {CategoryModel} from "../../shared/interface/category.model";

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  createProductForm !: FormGroup
  filterProductForm!: FormGroup;

  productsData!: ProductModel[]
  categoriesData!: CategoryModel[]
  pagination = {page: 1, pageSize: 10};
  totalItems: number = 0;
  isLoading: boolean = false;
  isTableLoading: boolean = false;
  showPagination: boolean = true;
  showCreateProductModal: boolean = false;
  showCreateCategoryModal: boolean = false;
  selectedProductId!: number
  isEditMode: boolean = false

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private formBuilder: FormBuilder,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.loadInstances()
    this.loadProducts()
    this.loadCategories()
  }


  loadProducts() {
    this.isTableLoading = true;
    const filterFormValue = this.filterProductForm.value;

    // Limpar valores nulos para nao mandar para o back
    const cleanedFilters = this.cleanObject({...filterFormValue, ...this.pagination});

    this.productService.getProducts(cleanedFilters, this.pagination).pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.isTableLoading = false)),
      catchError((err: HttpErrorResponse) => {
        const errMessage = err.error?.message || 'Erro ao carregar os produtos!';
        this.messageService.errorMessage(errMessage);
        return throwError(() => err);
      })
    ).subscribe((res) => {
      console.log('aqui a res', res);
      this.productsData = res.products;
      this.totalItems = res.totalCount;
    });
  }

  loadCategories(){
    this.categoryService.getCategories().pipe(takeUntil(this.destroy$)).subscribe((res) =>{
      console.log('aqui a res ao pegar categorias', res)
      this.categoriesData = res
    })
  }

  openEditProduct(product: ProductModel): void {
    this.isEditMode = true;
    this.selectedProductId = product.productId;

    this.createProductForm.patchValue({
      productName: product.productName,
      productPrice: product.productPrice,
      categoryId: product.categoryId
    });

    this.showCreateProductModal = true;
  }


  createProduct() {
    this.isLoading = true
    this.productService.createProduct(this.createProductForm.value).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false),
      catchError((err: HttpErrorResponse) => {
          const errorMessage = err.error?.message || 'Erro ao criar Produto!';
          console.error(err);
          this.messageService.errorMessage(errorMessage);
          return throwError(() => err);
        }
      )).subscribe((res) => {
      console.log('aqui a res do create', res)
      this.messageService.successMessage('Produto criado com sucesso!')
      this.closeCreateProductModal()
    })
  }

  createCategory() {
    this.isLoading = true
    this.categoryService.createCategory(this.createProductForm.value).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false),
      catchError((err: HttpErrorResponse) => {
          const errorMessage = err.error?.message || 'Erro ao criar Categoria!';
          console.error(err);
          this.messageService.errorMessage(errorMessage);
          return throwError(() => err);
        })
      ).subscribe((res) => {
      console.log('aqui a res do create', res)
      this.messageService.successMessage('Categoria criada com sucesso!')
      this.closeCreateProductModal()
    })
  }


  updateProduct(): void {
    if (this.createProductForm.valid) {
      this.isLoading = true;
      const updatedProduct = this.createProductForm.value;
      this.productService.updateProduct(this.selectedProductId, updatedProduct).pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false),
        catchError((err: HttpErrorResponse) => {
          const errorMessage = err.error?.message || 'Erro ao atualizar Produto!';
          console.error(err);
          this.messageService.errorMessage(errorMessage);
          return throwError(() => err);
        })
      ).subscribe(() => {
        this.messageService.successMessage('Produto atualizado com sucesso!')
        this.closeCreateProductModal()
      })
    }
  }


  toggleProductStatus(productId: number, active: boolean) {
    this.productService.toggleProductStatus(productId, active).pipe(
      takeUntil(this.destroy$),
      catchError((err: HttpErrorResponse) => {
        const errorMessage = err.error?.message || 'Erro ao alterar status';
        console.error(err);
        this.messageService.errorMessage(errorMessage);
        return throwError(() => err);
      })
    ).subscribe(() => {
      this.messageService.infoMessage('Produto desativado!')
      this.loadProducts()
    })
  }

  onPageIndexChange(pageIndex: number): void {
    this.pagination.page = pageIndex;
    this.loadProducts();
  }

  clearFilters() {
    this.filterProductForm.reset()
    this.loadProducts()
  }

  openRegisterProduct() {
    this.loadCategories()
    this.showCreateProductModal = true

  }
  openRegisterCategory() {
    this.showCreateCategoryModal = true
  }

  closeRegisterProduct(): void {
    this.createProductForm.reset();
    this.loadProducts()
    this.loadCategories()
    this.showCreateProductModal = false;
    this.isEditMode = false;
  }

  private closeCreateProductModal() {
    this.showCreateProductModal = false
    this.loadProducts()
  }

  closeCreateCategoryModal(){
    this.showCreateCategoryModal = false
    this.loadProducts()
  }


  // função para limpar objetos dos filtros, removendo valores nulos, vazios ou padrão
  private cleanObject(obj: any): any {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => {
        // Filtrar valores nulos, strings vazias e 0, exceto para paginação
        if (['page', 'pageSize'].includes(key)) {
          return true; // sempre manter `page` e `pageSize`
        }
        return value !== null && value !== undefined && value !== '' && value !== 0;
      })
    );
  }

  private loadInstances() {
    this.createProductForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productPrice: [0, Validators.required],
      categoryId: ['', Validators.required]
    })

    this.filterProductForm = this.formBuilder.group({
      productName: [''],
      dateCreatedStart: [null],
      dateCreatedEnd: [null],
      minPrice: [null],
      maxPrice: [null],
      isActive: [null],
    })
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
