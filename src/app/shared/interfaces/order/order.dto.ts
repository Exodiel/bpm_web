export interface OrderDTO {
    date: string;
    sequential?: string;
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
    userId: number;
    personId: number;
}