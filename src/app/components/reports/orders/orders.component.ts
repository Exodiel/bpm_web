import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../shared/services/user.service';
import { UserResponse } from '../../../shared/interfaces/user/user-response';
import { OrderService } from '../../../shared/services/order.service';
import { OrderReportDto } from '../../../shared/interfaces/reports/order-report.dto';
import { ReportsExcelService } from '../../../shared/services/reports-excel.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  public searchOrderForm: FormGroup;
  public validate = false;
  people: Array<UserResponse>;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public toster: ToastrService,
    private orderService: OrderService,
    private reports: ReportsExcelService,
  ) { }

  ngOnInit(): void {
    this.userService.getUserByType('client').subscribe(
      (data) => {
        this.people = data;
      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.error['message']);
      }
    );

    this.searchOrderForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      personId: ['', Validators.maxLength(20)],
      tipo: ['', Validators.maxLength(20)],
      state: ['', Validators.maxLength(20)],
    });
  }

  generateExcel() {
    this.validate = !this.validate;
    if (this.validate) {
      
      const data = <OrderReportDto>{
        startDate: this.searchOrderForm.value['startDate'],
        endDate: this.searchOrderForm.value['endDate'],
        personId: +this.searchOrderForm.value['personId'],
        type: this.searchOrderForm.value['tipo'],
        state: this.searchOrderForm.value['state'],
      };
      this.orderService.reportOrder(data).subscribe(
        (response) => {
          this.reports.downloadTransactionExcel(response);
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
      
      const data = <OrderReportDto>{
        startDate: this.searchOrderForm.value['startDate'],
        endDate: this.searchOrderForm.value['endDate'],
        personId: +this.searchOrderForm.value['personId'],
        type: this.searchOrderForm.value['tipo'],
        state: this.searchOrderForm.value['state'],
      };
      this.orderService.reportOrder(data).subscribe(
        (response) => {
          this.reports.downloadTransactionPdf(response);
        },
        (httpError: HttpErrorResponse) => {
          this.toster.error(httpError.error['message']);
        }
      );
    }
  }

}
