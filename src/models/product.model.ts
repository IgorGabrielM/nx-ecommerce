import { DefaultModel } from "./default.model";

export class ProductModel extends DefaultModel {
    name: string
    description: string
    image: string
    imageUrl: string
    id_category: number
    price: number
    discount?: number
}