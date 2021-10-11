import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import * as chartData from '../../../shared/data/dashboard/default'
import { UserResponse } from '../../../shared/interfaces/user/user-response';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ValuesByYear } from '../../../shared/interfaces/dashboard/dashboard-reponse';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  user: UserResponse;
  public greeting: string;
  public time: any;
  public today = new Date();
  public currentHour = this.today.getHours();
  public m = this.today.getMinutes();
  public ampm = this.currentHour >= 12 ? 'PM' : 'AM';
  public date: { year: number, month: number };

  // Charts
  public currentSales = chartData.currentSales;
  public smallBarCharts = chartData.smallBarCharts;
  public marketValue = chartData.marketValue;
  public knob = chartData.knob;
  public knobRight = chartData.knobRight;

  totalActualMonth: string;
  totalPastMonth: string;
  complete: string;
  inventoried: string;
  processing: string;
  returning: string;

  constructor(
    private userService: UserService,
    private dashboardService: DashboardService,
    public toster: ToastrService,
  ) {
  }

  ngOnInit() {
    this.dashboardService.getTotalsMonth().subscribe(
      (response) => {
        this.totalActualMonth = Number(response.data.actualMonth.total).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        this.totalPastMonth = Number(response.data.pastMonth.total).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.message);
      }
    );
    this.dashboardService.getTotalsByYears().subscribe(
      (response) => {
        let actual = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let past = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        response.data.actualYear.forEach((value) => {
          this.fillValues(value, actual);
        });
        response.data.pastYear.forEach((value) => {
          this.fillValues(value, past);
        });
        this.currentSales = chartData.CurrentSales(actual, past);
      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.message);
      }
    );
    this.dashboardService.getCountersByState().subscribe(
      (response) => {
        this.complete =  response.data.complete;
        this.inventoried =  response.data.inventoried;
        this.processing =  response.data.processing;
        this.returning =  response.data.returning;
      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.message);
      }
    );
    this.userService.getLoggedUser().subscribe(
      (data) => {
        this.user = data;
      }
    );
    if (this.currentHour >= 0 && this.currentHour < 4) {
      this.greeting = 'Buenas noches'
    } else if (this.currentHour >= 4 && this.currentHour < 12) {
      this.greeting = 'Buenos dias'
    } else if (this.currentHour >= 12 && this.currentHour < 16) {
      this.greeting = 'Buenas tardes'
    } else {
      this.greeting = 'Buenas noches'
    }
    this.startTime();
  }

  startTime() {
    this.currentHour = this.currentHour % 12;
    this.currentHour = this.currentHour ? this.currentHour : 12;
    this.m = this.checkTime(this.m);
    this.time = this.currentHour + ":" + this.m + ' ' + this.ampm;
  }

  checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
  }

  fillValues(value: ValuesByYear, values: number[]) {
    if (value.month === 1) {
      values[0] = parseFloat(value.total);
    } else if (value.month === 2) {
        values[1] = parseFloat(value.total);
    } else if (value.month === 3) {
        values[2] = parseFloat(value.total);
    } else if (value.month === 4) {
        values[3] = parseFloat(value.total);
    } else if (value.month === 5) {
        values[4] = parseFloat(value.total);
    } else if (value.month === 6) {
        values[5] = parseFloat(value.total);
    } else if (value.month === 7) {
        values[6] = parseFloat(value.total);
    } else if (value.month === 8) {
        values[7] = parseFloat(value.total);
    } else if (value.month === 9) {
        values[8] = parseFloat(value.total);
    } else if (value.month === 10) {
        values[9] = parseFloat(value.total);
    } else if (value.month === 11) {
        values[10] = parseFloat(value.total);
    } else {
        values[11] = parseFloat(value.total);
    }
  }
}
