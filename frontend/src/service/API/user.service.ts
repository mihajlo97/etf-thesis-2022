import axios, { AxiosResponse } from "axios";
import { API_ENDPOINT_LOGIN, API_ENDPOINT_REGISTER, API_ROOT } from "../../consts/api.consts";
import { LoginUserRequest, RegisterUserRequest } from "../../model/api-request.model";
import { LoginUserResponse, RegisterUserResponse } from "../../model/api-response.model";

export const registerUser = (req: RegisterUserRequest): Promise<AxiosResponse<RegisterUserResponse>> => {
    return axios.post(`${API_ROOT}${API_ENDPOINT_REGISTER}`, {
        ...req
    });
}

export const loginUser = (req: LoginUserRequest): Promise<AxiosResponse<LoginUserResponse>> => {
    return axios.post(`${API_ROOT}${API_ENDPOINT_LOGIN}`, {
        ...req
    });
}