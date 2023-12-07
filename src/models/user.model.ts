import { DefaultModel } from "./default.model"

export class UserDetailModel extends DefaultModel {
    id_user: number
    id_position: number
    id_shopping_cart: number
    username?: string
}

export class UserAuthModel extends DefaultModel {
    email: string
    password: string
    name?: string
}