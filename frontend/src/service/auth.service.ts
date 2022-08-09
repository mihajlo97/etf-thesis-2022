import { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN, KEY_SESSION_EXPIRED } from '../consts/keys.consts';
import { LoginUserRequest } from '../model/api-request.model';
import { loginUser, refreshUser } from './api.service';
import { JwtPayload } from 'jwt-decode';
import decodeJWT from 'jwt-decode';

const saveCredentials = (jwtAccess: string | undefined, jwtRefresh: string | undefined) => {
  sessionStorage.setItem(KEY_ACCESS_TOKEN, `${jwtAccess}`);
  sessionStorage.setItem(KEY_REFRESH_TOKEN, `${jwtRefresh}`);
};

const deleteCredentials = () => {
  sessionStorage.removeItem(KEY_ACCESS_TOKEN);
  sessionStorage.removeItem(KEY_REFRESH_TOKEN);
};

export const getAccessToken = (): string | null => sessionStorage.getItem(KEY_ACCESS_TOKEN);

export const getRefreshToken = (): string | null => sessionStorage.getItem(KEY_REFRESH_TOKEN);

export const assertTokenStillValid = (jwt: string | null) => {
  if (!jwt) {
    return false;
  }

  const token = decodeJWT<JwtPayload>(jwt);
  const expiresIn = token?.exp ?? 0;
  const expiresInSeconds = expiresIn * 1000;

  const now = new Date().getTime();

  return expiresInSeconds >= now;
};

export const assertSessionStillValid = () => assertTokenStillValid(getAccessToken());

export const doSilentRefresh = async (): Promise<void> => {
  try {
    const jwtRefresh = getRefreshToken();

    if (!assertTokenStillValid(jwtRefresh)) {
      throw new Error('Refresh token expired.');
    }

    const res = await refreshUser(jwtRefresh);

    const { accessToken, refreshToken } = res.data;
    saveCredentials(accessToken, refreshToken);

    console.log('DoSilentRefreshSuccess', { res });

    return new Promise((resolve, reject) => resolve());
  } catch (err: any) {
    console.error('DoSilentRefreshError', { err });

    return new Promise((resolve, reject) => reject());
  }
};

export const assertUserLoggedIn = () => getAccessToken() !== null;

export const loginUserWithCredentials = async (req: LoginUserRequest): Promise<number> => {
  try {
    const res = await loginUser(req);

    const { accessToken, refreshToken } = res.data;
    saveCredentials(accessToken, refreshToken);

    console.log('LoginUserWithCredentialsSuccess', { res });

    return new Promise((resolve, reject) => resolve(res.status));
  } catch (err: any) {
    console.error('LoginUserWithCredentialsError', { err });

    const status = err.response.status as number;

    return new Promise((resolve, reject) => reject(status));
  }
};

export const logoutUser = () => deleteCredentials();

export const setSessionExpired = () => sessionStorage.setItem(KEY_SESSION_EXPIRED, 'true');

export const assertSessionExpiredLogout = () => sessionStorage.getItem(KEY_SESSION_EXPIRED) !== null;

export const clearSessionExpiredLogout = () => sessionStorage.removeItem(KEY_SESSION_EXPIRED);

export const getCheckSessionValidityInterval = () => 1000 * 60 * 10;
