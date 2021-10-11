import { Component, OnInit } from '@angular/core';
import { Page } from '../../../shared/model/page.model';
import { PagedData } from '../../../shared/model/page-data';
import { Pagination } from '../../../shared/interfaces/pagination.interface';
import { ProductMapped } from '../../../shared/model/product-mapped';
import { ProductResponse } from '../../../shared/interfaces/product/product-response';
import { ProductService } from '../../../shared/services/product.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ReportsExcelService } from '../../../shared/services/reports-excel.service';
declare var require
const Swal = require('sweetalert2')

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
  page = new Page();
  rows = new Array<ProductMapped>();
  constructor(
    private productService: ProductService,
    private router: Router,
    public toster: ToastrService,
    private reportsService: ReportsExcelService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo: Pagination, reload = false) {
    this.page.pageNumber = pageInfo.offset;
    this.productService.getProducts(this.page.size, (pageInfo.offset * this.page.size)).subscribe(response => {
      let pageData = this.getPageData(this.page, response.data, response.total);
      
      this.page = pageData.page;
      if (reload) {
        this.rows = [...pageData.data];
      } else {
        this.rows = pageData.data;
      }
    });
  }

  private getPageData(page: Page, data: Array<ProductResponse>, total: number): PagedData<ProductMapped> {
    const pagedData = new PagedData<ProductMapped>();
    page.totalElements = total;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min(start + page.size, page.totalElements);
    for (let i = 0; i < data.length; i++) {
      const jsonObj = data[i];
      const product = new ProductMapped(
        jsonObj.id,
        jsonObj.name,
        jsonObj.description,
        jsonObj.cost,
        jsonObj.price,
        jsonObj.stock,
        jsonObj.image,
        jsonObj.category.name,
        jsonObj.category.id
      );
      pagedData.data.push(product);
    }
    pagedData.page = page;
    return pagedData;
  }

  deleteProduct(value: ProductMapped) {
    Swal.fire({
      title: '¿Estas seguro de eliminar este producto?',
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
          'El producto ha sido eliminado con exito.',
          'success'
        );
        this.productService.deleteProductById(value.id).subscribe(
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

  editProduct(value: ProductMapped) {
    this.router.navigate(['update-product/:id', value.id]);
  }

  generateExcel() {

    this.productService.getProductsSimple().subscribe(
      (response) => {
        this.reportsService.downloadProductsExcel(response);
      },
      (error: HttpErrorResponse) => {
        this.toster.error(error.message);
      }
    );
  }

  generatePdf() {
    this.productService.getProductsSimple().subscribe(
      (response) => {
        this.reportsService.downloadProductsPdf(response);
      },
      (error: HttpErrorResponse) => {
        this.toster.error(error.message);
      }
    );
  }
}
