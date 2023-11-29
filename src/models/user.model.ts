import { DefaultModel } from "./default.model"

export class UserModel extends DefaultModel {

}

export class UserAuthModel extends DefaultModel {
    email: string
    password: string
    name?: string
}