import axios, { Axios, AxiosResponse } from "axios";
import { LoginUserRequest, RegisterUserRequest } from "../../model/api-request.model";
import { RegisterUserResponse } from "../../model/api-response.model";

export const registerUser = (req: RegisterUserRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 3200);
    })
}

export const loginUser = (req: LoginUserRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 3200);
    })
}