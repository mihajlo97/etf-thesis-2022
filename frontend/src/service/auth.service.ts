import { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN } from "../consts/keys.consts";
import { LoginUserRequest } from "../model/api-request.model";
import { loginUser } from "./api.service";

export const loginUserWithCredentials = async (req: LoginUserRequest): Promise<number> => {
    try {
        const res = await loginUser(req);

        const { accessToken, refreshToken } = res.data;

        sessionStorage.setItem(KEY_ACCESS_TOKEN, `${accessToken}`);
        sessionStorage.setItem(KEY_REFRESH_TOKEN, `${refreshToken}`);

        console.log('LoginUserWithCredentialsSuccess', { res });

        return new Promise((resolve, reject) => resolve(res.status));
    }
    catch (err: any) {
        console.error('LoginUserWithCredentialsError', { err });

        const status = err.response.status as number;

        return new Promise((resolve, reject) => reject(status));
    }
}