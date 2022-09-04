// export type ModelName = 'mobilenet' | 'vgg' | 'resnet';

export type ModelName = 'mobilenet' | 'mobilenet_v2';

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

export interface DeleteReportRequest {
  reportId: string;
}
