import { OrderResponse } from '../order/order-response';

export interface NotificationResponse {
    id: number;
    topic: string;
    title: string;
    body: string;
    imageUrl: string;
    created_at: string;
    updated_at: string;
    order: OrderResponse;
}