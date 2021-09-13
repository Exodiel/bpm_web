import { ProductResponse } from "../product/product-response";

export interface DetailResponse {
    id: number;
    price: number;
    discount: number;
    discountvalue: number;
    subtotal: number;
    quantity: number;
    product: ProductResponse;
}