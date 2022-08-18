export interface RegisterUserResponse {
  msg?: string;
}

export interface LoginUserResponse {
  msg?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface ClassifyImageResponse {
  msg?: string;
  results?: any;
  processingTime?: any;
}
