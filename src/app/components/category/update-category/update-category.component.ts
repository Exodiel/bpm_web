import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { CategoryUpdateDTO } from '../../../shared/interfaces/category/category-update.dto';
import { CategoryResponse } from '../../../shared/interfaces/category/category-response';
import { CategoryService } from '../../../shared/services/category.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {
  id: number;
  public validate = false;
  public tooltipValidation = false;
  public updateCategoryForm: FormGroup;
  updateCategoryObserver$: Observable<CategoryResponse>;
  updateCategorySubscription: Subscription;
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    public router: Router,
    public ngZone: NgZone,
    public toster: ToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.categoryService.getCategoryById(this.id).subscribe(
      (data) => {
        this.updateCategoryForm = this.fb.group({
          name: [data.name, [Validators.required, Validators.minLength(3)]],
        });
        document.getElementById('name')['value'] = data.name;

      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.error['message']);
      }
    );
  }

  public submit() {
    this.validate = !this.validate;
    if (this.validate) {
      const data = <CategoryUpdateDTO>{
        id: this.id,
        name: document.getElementById('name')['value']
      };
      this.updateCategoryObserver$ = this.categoryService.updateCategory(data);

      this.updateCategorySubscription = this.updateCategoryObserver$.subscribe(
        (response) => {
          this.toster.success("Categoria actualizada correctamente!");
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
