import { DefaultModel } from "./default.model"
import { ProductModel } from "./product.model";

export class PurchaseModel extends DefaultModel {
    user_id?: string;
    user_detail_id?: number;
    shopping_cart_id?: number;
    product_id?: number;
    products?: ProductModel[];
    canceled?: boolean;

    payment_type?: string
    installments_value?: number
    installments_quantity?: number
    cep?: string
    street?: string
    neighbourhood?: string
    number_house?: number
}

export class DeliveryStatusModel extends DefaultModel {
    name: string;
    changed_at?: Date;
}
