import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../services/notification.service';
import { NotificationResponse } from '../../../../interfaces/notification/notification-response';
import { HttpErrorResponse } from '@angular/common/http';
import { format, register } from 'timeago.js';
import { SocketService, IOEventName } from '../../../../services/socket.service';

register('es_ES', (number, index, total_sec) => [
  ['justo ahora', 'ahora mismo'],
  ['hace %s segundos', 'en %s segundos'],
  ['hace 1 minuto', 'en 1 minuto'],
  ['hace %s minutos', 'en %s minutos'],
  ['hace 1 hora', 'en 1 hora'],
  ['hace %s horas', 'in %s horas'],
  ['hace 1 dia', 'en 1 dia'],
  ['hace %s dias', 'en %s dias'],
  ['hace 1 semana', 'en 1 semana'],
  ['hace %s semanas', 'en %s semanas'],
  ['1 mes', 'en 1 mes'],
  ['hace %s meses', 'en %s meses'],
  ['hace 1 año', 'en 1 año'],
  ['hace %s años', 'en %s años']
][index] as [string, string]);

const timeago = timestamp => format(timestamp, 'es_ES');

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notifications: Array<NotificationResponse> = [];
  pageNumber: number;
  size: number;
  total: number;
  public openNotification: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private socketService: SocketService,
  ) {
    this.pageNumber = 0;
    this.size = 5;
  }

  ngOnInit() {
    this.socketService.onEvent<NotificationResponse>(IOEventName.NEW_NOTIFICATION).subscribe(
      (message) => {
        this.notifications.pop();
        this.notifications.push(message);
        this.total++;
      }
    );
    this.notificationService.getAll(this.size, this.pageNumber).subscribe(
      (response) => {
        this.total = response.total;
        this.notifications = response.data;
      },
      (httpError: HttpErrorResponse) => {
        console.log(httpError.message);
      }
    );
  }

  formatBody(date: string) {
    return timeago(date);
  }

  toggleNotificationMobile() {
    this.openNotification = !this.openNotification;
  }

}
