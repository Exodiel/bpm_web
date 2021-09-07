export interface ListResponse<T> {
    limit: string;
    offset: string;
    total: number;
    data: Array<T>;
}