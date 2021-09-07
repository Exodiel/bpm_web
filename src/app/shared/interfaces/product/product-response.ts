export interface Category {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface ProductResponse {
    name: string;
    description: string;
    cost: number;
    price: number;
    stock: number;
    image: string;
    category: Category;
    id: number;
    created_at: Date;
    updated_at: Date;
}