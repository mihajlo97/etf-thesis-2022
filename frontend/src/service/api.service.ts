import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  API_USER_LOGIN,
  API_USER_REGISTER,
  API_ROOT,
  API_USER_REFRESH,
  API_MODEL_CLASSIFY,
} from "../consts/api.consts";
import {
  ClassifyImageRequest,
  LoginUserRequest,
  RegisterUserRequest,
} from "../model/api-request.model";
import {
  ClassifyImageResponse,
  LoginUserResponse,
  RegisterUserResponse,
} from "../model/api-response.model";
import {
  assertTokenStillValid,
  doSilentRefresh,
  getAccessToken,
} from "./auth.service";

const getAuthenticatedConfig = async (
  jwt: string | null
): Promise<AxiosRequestConfig> => {
  const valid = assertTokenStillValid(jwt);

  if (!valid) {
    try {
      await doSilentRefresh();
    } catch (err: any) {
      return new Promise((resolve, reject) =>
        reject("Authentication failed, logging out user.")
      );
    }
  }

  return new Promise((resolve, reject) =>
    resolve({
      headers: {
        Authorization: `Bearer ${valid ? jwt : getAccessToken()}`,
      },
    })
  );
};

export const registerUser = (
  req: RegisterUserRequest
): Promise<AxiosResponse<RegisterUserResponse>> => {
  return axios.post(`${API_ROOT}${API_USER_REGISTER}`, {
    ...req,
  });
};

export const loginUser = (
  req: LoginUserRequest
): Promise<AxiosResponse<LoginUserResponse>> => {
  return axios.post(`${API_ROOT}${API_USER_LOGIN}`, {
    ...req,
  });
};

export const refreshUser = (
  jwtRefresh: string | null
): Promise<AxiosResponse<LoginUserResponse>> => {
  return axios.get(`${API_ROOT}${API_USER_REFRESH}`, {
    headers: {
      Authorization: `Bearer ${jwtRefresh}`,
    },
  });
};

export const classifyImage = async (
  req: ClassifyImageRequest
): Promise<AxiosResponse<ClassifyImageResponse>> => {
  const headers = await getAuthenticatedConfig(getAccessToken());

  return axios.post(
    `${API_ROOT}${API_MODEL_CLASSIFY}`,
    {
      ...req,
    },
    {
      ...headers,
    }
  );
};
