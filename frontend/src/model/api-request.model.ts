export interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
};

export interface LoginUserRequest {
    email: string;
    password: string;
}