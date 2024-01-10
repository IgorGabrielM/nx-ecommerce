import { DefaultModel } from "./default.model"
import { ProductModel } from "./product.model";

export class PurchaseModel extends DefaultModel {
    user_id?: string;
    user_detail_id?: number;
    shopping_cart_id?: number;
    product_id?: number;
    products?: ProductModel[]
}

export class HistoricPurchaseModel extends DefaultModel {
    user_id?: string;
    user_detail_id?: number;
    shopping_cart_id?: number;
    product_id?: number;
    products?: ProductModel[];
    purchase_id: number;
}