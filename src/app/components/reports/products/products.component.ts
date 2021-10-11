import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportsExcelService } from '../../../shared/services/reports-excel.service';
import { CategoryService } from '../../../shared/services/category.service';
import { CategoryResponse } from '../../../shared/interfaces/category/category-response';
import { ProductReportDto } from '../../../shared/interfaces/reports/product-report.dto';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  searchProductForm: FormGroup;
  validate = false;
  categories = Array<CategoryResponse>();
  constructor(
    private fb: FormBuilder,
    private toster: ToastrService,
    private categoryService: CategoryService,
    private reportService: ReportsExcelService,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.categoryService.findCategories().subscribe(
      (response) => {
        this.categories = response;
      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.message);
      }
    );
    this.searchProductForm = this.fb.group({
      startDate: ['', Validators.maxLength(20)],
      endDate: ['', Validators.maxLength(20)],
      categoryId: ['', Validators.maxLength(20)],
      tipo: ['', Validators.required],
    });
  }

  generateExcel() {
    this.validate = !this.validate;
    if (this.validate) {

      const data = <ProductReportDto>{
        categoryId: +this.searchProductForm.value['categoryId'],
        type: this.searchProductForm.value['tipo'],
        startDate: this.searchProductForm.value['startDate'],
        endDate: this.searchProductForm.value['endDate'],
      }
      this.productService.getProductReport(data).subscribe(
        (response) => {
          if (data.type == 'profit-utility') {
            this.reportService.downloadProfitUtilityExcel(response);
          } else {
            this.reportService.downloadMostSellingExcel(response);

          }
        },
        (httpError: HttpErrorResponse) => {
          this.toster.error(httpError.error['message']);
        }
      );
    }
  }

  generatePdf() {
    this.validate = !this.validate;
    if (this.validate) {

      const data = <ProductReportDto>{
        categoryId: +this.searchProductForm.value['categoryId'],
        type: this.searchProductForm.value['tipo'],
        startDate: this.searchProductForm.value['startDate'],
        endDate: this.searchProductForm.value['endDate'],
      }
      this.productService.getProductReport(data).subscribe(
        (response) => {
          if (data.type == 'profit-utility') {
            this.reportService.downloadProfitUtilityPdf(response);
          } else {
            this.reportService.downloadMostSellingPdf(response);

          }
        },
        (httpError: HttpErrorResponse) => {
          this.toster.error(httpError.error['message']);
        }
      );
    }
  }

}
