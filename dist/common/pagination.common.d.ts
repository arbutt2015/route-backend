export declare class Pagination {
    static readonly limit_page_size: number;
    static paginate(req: any, res: any): Promise<{
        limit: number;
        page: number;
    }>;
    static isInteger(value: string): boolean;
    static isPositiveInteger(value: string): boolean;
    static isNegativeInteger(value: string): boolean;
}
