import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent  } from '@swimlane/ngx-datatable';
import { Page } from '../../../shared/model/page.model';
import { UserMapped } from '../../../shared/model/user-mapped';
import { UserService } from '../../../shared/services/user.service';
import { UserResponse } from '../../../shared/interfaces/user/user-response';
import { PagedData } from '../../../shared/model/page-data';
import { Pagination } from '../../../shared/interfaces/pagination.interface';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
declare var require
const Swal = require('sweetalert2')

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  page = new Page();
  rows = new Array<UserMapped>();
  @ViewChild('ngxDatatable') ngxDatatable: DatatableComponent;
  constructor(
    private userService: UserService,
    private router: Router,
    public toster: ToastrService,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo: Pagination, reload = false) {
    this.page.pageNumber = pageInfo.offset;
    this.userService.getUsers(this.page.size, (pageInfo.offset * this.page.size), 'user').subscribe(response => {
      let pageData = this.getPageData(this.page, response.data, response.total);
      
      this.page = pageData.page;
      if (reload) {
        this.rows = [...pageData.data];
      } else {
        this.rows = pageData.data;
      }
    });
  }

  private getPageData(page: Page, data: Array<UserResponse>, total: number): PagedData<UserMapped> {
    const pagedData = new PagedData<UserMapped>();
    page.totalElements = total;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min(start + page.size, page.totalElements);
    for (let i = 0; i < data.length; i++) {
      const jsonObj = data[i];
      const user = new UserMapped(
        jsonObj.name, 
        jsonObj.email, 
        jsonObj.rol, 
        jsonObj.identification, 
        jsonObj.image, 
        jsonObj.id,
        jsonObj.username,
        jsonObj.identification_type,
        jsonObj.active,
        jsonObj.phone,
        jsonObj.address
      );
      pagedData.data.push(user);
    }
    pagedData.page = page;
    return pagedData;
  }

  deleteUser(value: UserMapped) {
    Swal.fire({
      title: '¿Estas seguro de eliminar este usuario?',
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
          'El usuario ha sido eliminado con exito.',
          'success'
        );
        this.userService.deleteUserById(value.id).subscribe(
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

  editUser(value: UserMapped) {
    this.router.navigate(['update-user/:id', value.id]);
  }
}
