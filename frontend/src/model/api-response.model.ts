export interface RegisterUserResponse {
    msg?: string;
};

export interface LoginUserResponse {
    msg?: string;
    accessToken?: string;
    refreshToken?: string;
}