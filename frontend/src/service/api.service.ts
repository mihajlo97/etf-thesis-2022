import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  API_USER_LOGIN,
  API_USER_REGISTER,
  API_ROOT,
  API_USER_REFRESH,
  API_MODEL_CLASSIFY,
  API_REPORTS_STORE,
} from '../consts/api.consts';
import { ClassifyImageRequest, LoginUserRequest, RegisterUserRequest } from '../model/api-request.model';
import {
  ClassifyImageResponse,
  LoginUserResponse,
  RegisterUserResponse,
  StoreReportResponse,
} from '../model/api-response.model';
import { ReportData } from '../model/dashboard.model';
import { assertTokenStillValid, doSilentRefresh, getAccessToken } from './auth.service';
import { getSourceImageURL } from './image.service';

const getAuthenticatedConfig = async (jwt: string | null, useFormHeader?: boolean): Promise<AxiosRequestConfig> => {
  const valid = assertTokenStillValid(jwt);

  if (!valid) {
    try {
      await doSilentRefresh();
    } catch (err: any) {
      return new Promise((resolve, reject) => reject('Authentication failed, logging out user.'));
    }
  }

  if (useFormHeader) {
    return new Promise((resolve, reject) =>
      resolve({
        headers: {
          Authorization: `Bearer ${valid ? jwt : getAccessToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  return new Promise((resolve, reject) =>
    resolve({
      headers: {
        Authorization: `Bearer ${valid ? jwt : getAccessToken()}`,
      },
    })
  );
};

export const registerUser = (req: RegisterUserRequest): Promise<AxiosResponse<RegisterUserResponse>> => {
  return axios.post(`${API_ROOT}${API_USER_REGISTER}`, {
    ...req,
  });
};

export const loginUser = (req: LoginUserRequest): Promise<AxiosResponse<LoginUserResponse>> => {
  return axios.post(`${API_ROOT}${API_USER_LOGIN}`, {
    ...req,
  });
};

export const refreshUser = (jwtRefresh: string | null): Promise<AxiosResponse<LoginUserResponse>> => {
  return axios.get(`${API_ROOT}${API_USER_REFRESH}`, {
    headers: {
      Authorization: `Bearer ${jwtRefresh}`,
    },
  });
};

export const classifyImage = async (req: ClassifyImageRequest): Promise<AxiosResponse<ClassifyImageResponse>> => {
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

export const storeReport = async (payload: ReportData): Promise<AxiosResponse<StoreReportResponse>> => {
  const headers = await getAuthenticatedConfig(getAccessToken(), true);
  const data = new FormData();

  data.append('name', payload.name);
  data.append('resolution', payload.resolution);
  data.append('aspectRatio', payload.aspectRatio);
  data.append('model', payload.model);
  data.append('timestamp', payload.timestamp);
  data.append('clientClass', payload.clientClass);
  data.append('clientConfidence', payload.clientConfidence);
  data.append('clientTimeImage', payload.clientTimeImage);
  data.append('clientTimePrediction', payload.clientTimePrediction);
  data.append('clientTimeProcessing', payload.clientTimeProcessing);
  data.append('serverClass', payload.serverClass);
  data.append('serverConfidence', payload.serverConfidence);
  data.append('serverTimeImage', payload.serverTimeImage);
  data.append('serverTimePrediction', payload.serverTimePrediction);
  data.append('serverTimeProcessing', payload.serverTimeProcessing);
  data.append('serverTimeResponse', payload.serverTimeResponse);
  data.append('image', new Blob([getSourceImageURL()], { type: 'image/jpg' }), `${payload.name}.jpg`);

  return axios.post(`${API_ROOT}${API_REPORTS_STORE}`, data, {
    ...headers,
  });
};
