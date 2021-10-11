import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from '../../../shared/services/category.service';
import { ProductService } from '../../../shared/services/product.service';
import { UploadsService } from '../../../shared/services/uploads.service';
import { ProductResponse } from '../../../shared/interfaces/product/product-response';
import { CategoryResponse } from '../../../shared/interfaces/category/category-response';
import { ProductDTO } from '../../../shared/interfaces/product/product.dto';
import { environment } from '../../../../environments/environment';

const URL = environment.wsUrl;

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  id: number;
  public validate = false;
  public tooltipValidation = false;
  public updateProductForm: FormGroup;
  updateProductObserver$: Observable<ProductResponse>;
  updateProductSubscription: Subscription;
  file: File = null;
  categories: Array<CategoryResponse>;
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private uploadService: UploadsService,
    private route: ActivatedRoute,
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

    this.id = this.route.snapshot.params['id'];
    this.productService.getProductById(this.id).subscribe(
      (data) => {
        this.updateProductForm = this.fb.group({
          name: [data.name, [Validators.required, Validators.minLength(3)]],
          description: [data.description, [Validators.required, Validators.minLength(3)]],
          cost: [data.cost, [Validators.required, Validators.min(1)]],
          price: [data.price, [Validators.required, Validators.min(1)]],
          stock: [data.stock, [Validators.required, Validators.min(1)]],
          categoryId: [data.category.id, [Validators.required]],
        });

        document.getElementById('name')['value'] = data.name;
        document.getElementById('description')['value'] = data.description;
        document.getElementById('cost')['value'] = data.cost;
        document.getElementById('price')['value'] = data.price;
        document.getElementById('stock')['value'] = data.stock;
        document.getElementById('categoryId')['value'] = data.category.id;
      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.error['message']);
      }
    );
  }

  onChange(event) {
    this.file = event.target.files[0];
  }

  public submit() {
    this.validate = !this.validate;
    if (this.validate) {
      this.uploadService.uploadImage(this.file).subscribe(
        (data) => {
          const body = <ProductDTO>{
            name: document.getElementById('name')['value'],
            description: document.getElementById('description')['value'],
            cost: +document.getElementById('cost')['value'],
            price: +document.getElementById('price')['value'],
            stock: +document.getElementById('stock')['value'],
            categoryId: +document.getElementById('categoryId')['value'],
            image: `${URL}/` + data.filepath,
          };

          this.updateProductObserver$ = this.productService.updateProduct(this.id, body);

          this.updateProductSubscription = this.updateProductObserver$.subscribe(
            (data) => {
              this.toster.success("Producto actualizado correctamente");
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
