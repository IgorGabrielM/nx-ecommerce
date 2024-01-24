import { DefaultModel } from "./default.model";
import { UserDetailModel } from "./user.model";

export class CommentModel extends DefaultModel {
    id_user_detail: number
    userDetail: UserDetailModel
    id_product: string
    user_image_url?: string;
    comment_message: string
    stars: number
    stars_array?: any[]
    isOpen?: boolean
}