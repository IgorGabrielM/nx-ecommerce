import { DefaultModel } from "./default.model";
import { ProductModel } from "./product.model";

export class ShoppingCartModel extends DefaultModel {
    products?: ProductModel[]
}