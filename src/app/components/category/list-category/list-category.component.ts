import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Page } from '../../../shared/model/page.model';
import { CategoryMapped } from '../../../shared/model/category-mapped';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../shared/services/category.service';
import { PagedData } from '../../../shared/model/page-data';
import { Pagination } from '../../../shared/interfaces/pagination.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryResponse } from '../../../shared/interfaces/category/category-response';
import { FormGroup } from '@angular/forms';
import { ReportsExcelService } from '../../../shared/services/reports-excel.service';

declare var require
const Swal = require('sweetalert2');

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css'],
})
export class ListCategoryComponent implements OnInit {
  page = new Page();
  rows = new Array<CategoryMapped>();
  closeResult: string;
  public createCategoryForm: FormGroup;
  public updateCategoryForm: FormGroup;
  @ViewChild('ngxDatatable') ngxDatatable: DatatableComponent;
  constructor(
    private categoryService: CategoryService,
    public toster: ToastrService,
    private reportService: ReportsExcelService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo: Pagination, reload = false) {
    this.page.pageNumber = pageInfo.offset;
    this.categoryService.getCategories(this.page.size, (pageInfo.offset * this.page.size)).subscribe(response => {
      let pageData = this.getPageData(this.page, response.data, response.total);
      
      this.page = pageData.page;
      if (reload) {
        this.rows = [...pageData.data];
      } else {
        this.rows = pageData.data;
      }
    });
  }

  private getPageData(page: Page, data: Array<CategoryResponse>, total: number): PagedData<CategoryMapped> {
    const pagedData = new PagedData<CategoryMapped>();
    page.totalElements = total;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min(start + page.size, page.totalElements);
    for (let i = 0; i < data.length; i++) {
      const jsonObj = data[i];
      const categoryMapped = new CategoryMapped(jsonObj.id, jsonObj.name, jsonObj.image);
      pagedData.data.push(categoryMapped);
    }
    pagedData.page = page;
    return pagedData;
  }

  deleteCategory(value: CategoryMapped) {
    Swal.fire({
      title: '¿Estas seguro de eliminar esta categoria?',
      text: "No podras revertir la accion una vez realizada",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          '¡Eliminado!',
          'La categoria ha sido eliminada con exito.',
          'success'
        );
        this.categoryService.deleteCategoryById(value.id).subscribe(
          (data) => {

            this.setPage({ offset: 0 }, true);
          },
          (httpError: HttpErrorResponse) => {
            this.toster.error(httpError.error['message']);
          }
        );
      }
    })
  }

  generateExcel() {
    this.categoryService.findCategories().subscribe(
      (response) => {
        this.reportService.downloadCategoriesExcel(response);
      },
      (error: HttpErrorResponse) => {
        this.toster.error(error.message);
      }
    );
  }

  generatePdf() {
    this.categoryService.findCategories().subscribe(
      (response) => {
        this.reportService.downloadCategoriesPdf(response);
      },
      (error: HttpErrorResponse) => {
        this.toster.error(error.message);
      }
    );
  }
}
