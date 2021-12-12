export interface IProduct {
    product_id: string,
    product_name: string,
    product_price: number,
    product_image: string,
    product_description: string,
    product_category: string,
    product_discount_percentage: number,
    product_soft_deleted: string,
    product_hard_deleted: string,
    product_gender: string
};

export interface IFilterParams {
    key: string;
    value: string | any;
    exactMatch?: boolean;
    additionalKeys?: string[];
    multiple?: Array<string>;
}