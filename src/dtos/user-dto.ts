import { UserDtoType } from "../repositories/types";

export class UserDto {
    id;
    email;
    isConfirmed;

    constructor(model: UserDtoType) {
        this.id = model.id;
        this.email = model.email;
        this.isConfirmed = model.isConfirmed;
    }
}
