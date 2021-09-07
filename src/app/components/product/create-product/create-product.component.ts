import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { ProductResponse } from '../../../shared/interfaces/product/product-response';
import { ProductDTO } from '../../../shared/interfaces/product/product.dto';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  public validate = false;
  public tooltipValidation = false;
  public createProductForm: FormGroup;
  createProductObserver$: Observable<ProductResponse>;
  createProductSubscription: Subscription;
  constructor(
    private productService: ProductService,
    public router: Router,
    public ngZone: NgZone,
    public toster: ToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createProductForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      rol: ['', Validators.required],
      identification: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]],
    });
  }

  public submit() {
    this.validate = !this.validate;
    if (this.validate) {}
  }
}
