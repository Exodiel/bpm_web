import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../services/notification.service';
import { NotificationResponse } from '../../../../interfaces/notification/notification-response';
import { HttpErrorResponse } from '@angular/common/http';
import { format } from 'timeago.js';
import { SocketService, IOEventName, INotificationMessage } from '../../../../services/socket.service';

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
    this.socketService.onEvent<INotificationMessage>(IOEventName.NEW_NOTIFICATION).subscribe(
      (message) => {
        this.notifications.pop();
        const notification = this.parseNotification(message);
        this.notifications.push(notification);
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

  parseNotification(message: INotificationMessage): NotificationResponse {
    const { id, address, date, description, sequential, state, subtotal, discount, origin, payment, tax, total, type } = message.order;
    return {
      id: message.id,
      topic: message.topic,
      body: message.body,
      created_at: message.created_at,
      imageUrl: message.imageUrl,
      title: message.title,
      updated_at: message.updated_at,
      order: {
        id,
        address,
        date,
        description,
        sequential,
        state,
        subtotal,
        discount,
        origin,
        payment,
        tax,
        total,
        type,
      }
    };
  }

  formatBody(date: string) {
    return format(date, 'es');
  }

  toggleNotificationMobile() {
    this.openNotification = !this.openNotification;
  }

}
