import { DefaultModel } from "./default.model"

export class UserDetailModel extends DefaultModel {
    id_user: string
    id_position: number
    id_shopping_cart: number
    username?: string
    image: string
    imageUrl?: string
}

export class UserAuthModel extends DefaultModel {
    email: string
    password: string
    name?: string
}