import { UserResponse } from '../user/user-response';
import { DetailResponse } from '../detail/detail-response';

export interface OrderResponse {
    id: number;

    sequential: string;

    date: string;

    discount: number;

    subtotal: number;

    tax: number;

    total: number;

    description: string;

    type: string;

    payment: string;

    state: string;

    address: string;

    origin: string;

    user?: UserResponse;

    person?: UserResponse;

    details?: DetailResponse[];
}