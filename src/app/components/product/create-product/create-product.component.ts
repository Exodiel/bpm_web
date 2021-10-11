import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { ProductResponse } from '../../../shared/interfaces/product/product-response';
import { ProductDTO } from '../../../shared/interfaces/product/product.dto';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { CategoryResponse } from '../../../shared/interfaces/category/category-response';
import { UploadsService } from '../../../shared/services/uploads.service';
import { environment } from '../../../../environments/environment';

const URL = environment.wsUrl;

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  categories: Array<CategoryResponse>;
  public validate = false;
  public tooltipValidation = false;
  public createProductForm: FormGroup;
  createProductObserver$: Observable<ProductResponse>;
  createProductSubscription: Subscription;
  file: File = null;
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private uploadService: UploadsService,
    public router: Router,
    public ngZone: NgZone,
    public toster: ToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategoriesSimple().subscribe(
      (data) => {
        this.categories = data;
      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.error['message']);
      }
    );
    this.createProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      cost: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(1)]],
      categoryId: ['', [Validators.required]],
    });
  }

  onChange(event) {
    this.file = (event.target as HTMLInputElement).files[0];
  }

  public submit() {
    this.validate = !this.validate;
    if (this.validate) {
      this.uploadService.uploadImage(this.file).subscribe(
        (data) => {
          const body = <ProductDTO>{
            name: this.createProductForm.value['name'],
            description: this.createProductForm.value['description'],
            cost: this.createProductForm.value['cost'],
            price: this.createProductForm.value['price'],
            stock: this.createProductForm.value['stock'],
            categoryId: +this.createProductForm.value['categoryId'],
            image: `${URL}/` + data.filepath,
          };

          this.createProductObserver$ = this.productService.createProduct(body);

          this.createProductSubscription = this.createProductObserver$.subscribe(
            (data) => {
              this.toster.success("Producto creado correctamente");
              this.ngZone.run(() => {
                this.router.navigate(['/products/list-product']);
              });
            },
            (httpError: HttpErrorResponse) => {
              this.toster.error(httpError.error['message']);
            }
          );
        },
        (httpError: HttpErrorResponse) => {
          this.toster.error(httpError.error['message']);
        }
      );
    }
  }
}
