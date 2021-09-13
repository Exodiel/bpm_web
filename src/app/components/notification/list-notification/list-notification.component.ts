import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationMapped } from '../../../shared/model/notification-mapped';
import { Page } from '../../../shared/model/page.model';
import { NotificationResponse } from '../../../shared/interfaces/notification/notification-response';
import { Pagination } from '../../../shared/interfaces/pagination.interface';
import { PagedData } from '../../../shared/model/page-data';
import { HttpErrorResponse } from '@angular/common/http';
declare var require
const Swal = require('sweetalert2')

@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.component.html',
  styleUrls: ['./list-notification.component.css']
})
export class ListNotificationComponent implements OnInit {
  page = new Page();
  rows = new Array<NotificationMapped>();
  constructor(
    private notificationService: NotificationService,
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
    this.notificationService.getAll(this.page.size, (pageInfo.offset * this.page.size)).subscribe(response => {
      let pageData = this.getPageData(this.page, response.data, response.total);
      
      this.page = pageData.page;
      if (reload) {
        this.rows = [...pageData.data];
      } else {
        this.rows = pageData.data;
      }
    });
  }

  private getPageData(page: Page, data: Array<NotificationResponse>, total: number): PagedData<NotificationMapped> {
    const pagedData = new PagedData<NotificationMapped>();
    page.totalElements = total;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min(start + page.size, page.totalElements);
    for (let i = 0; i < data.length; i++) {
      const jsonObj = data[i];
      const mapped = new NotificationMapped(
        jsonObj.id,
        jsonObj.title,
        jsonObj.topic,
        jsonObj.body,
      );
      pagedData.data.push(mapped);
    }
    pagedData.page = page;
    return pagedData;
  }

  deleteNotification(value: NotificationMapped) {
    Swal.fire({
      title: '¿Estas seguro de eliminar esta notificacion?',
      text: "No podras revertir la accion una vez sea realizada",
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
          'La notificacion ha sido eliminado con exito.',
          'success'
        );
        this.notificationService.deleteONotificacionById(value.id).subscribe(
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

}
