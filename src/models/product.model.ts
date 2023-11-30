import { DefaultModel } from "./default.model";

export class ProductModel extends DefaultModel {
    name: string
    description: string
    id_category: number
    price: number
}