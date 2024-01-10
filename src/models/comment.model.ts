import { DefaultModel } from "./default.model";

export class CommentModel extends DefaultModel {
    comment: string;
    stars: number;
    user_detail_id?: number;

    user_image_url?: string;
    stars_array: null[]
}