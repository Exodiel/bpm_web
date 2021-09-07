import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from '../../../shared/services/category.service';
import { CategoryResponse } from '../../../shared/interfaces/category/category-response';
import { CategoryDTO } from '../../../shared/interfaces/category/category.dto';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  public validate = false;
  public tooltipValidation = false;
  public createCategoryForm: FormGroup;
  createCategoryObserver$: Observable<CategoryResponse>;
  createCategorySubscription: Subscription;
  constructor(
    private categoryService: CategoryService,
    public router: Router,
    public ngZone: NgZone,
    public toster: ToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  public submit() {
    this.validate = !this.validate;
    if (this.validate) {
      const data = <CategoryDTO>{
        name: this.createCategoryForm.value['name']
      };

      this.createCategoryObserver$ = this.categoryService.createCategory(data);

      this.createCategorySubscription = this.createCategoryObserver$.subscribe(
        (data) => {
          this.toster.success("Categoria creada correctamente");
          this.ngZone.run(() => {
            this.router.navigate(['/categories/list-category']);
          });
        },
        (httpError: HttpErrorResponse) => {
          this.toster.error(httpError.error['message']);
        }
      );
    }
  }

}
