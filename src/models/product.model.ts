import { CommentModel } from "./comment.model";
import { DefaultModel } from "./default.model";
import { DeliveryStatusModel } from "./purchase.model";

export class ProductModel extends DefaultModel {
    name: string
    description: string
    images: string[]
    imagesUrl: string[]
    id_category: number
    price: number
    discount?: number
    comments?: CommentModel[]
    delivery_statuses?: DeliveryStatusModel[]
}