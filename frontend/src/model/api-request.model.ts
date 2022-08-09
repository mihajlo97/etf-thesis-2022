export type ModelName = 'mobilenet' | 'vgg' | 'resnet';

export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface ClassifyImageRequest {
  model: ModelName;
  img: string;
}
