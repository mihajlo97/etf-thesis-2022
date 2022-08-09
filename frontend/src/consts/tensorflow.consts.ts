import { ImageClassificationModel } from '../model/tensorflow.model';

export const MODELS = [
  {
    id: 0,
    label: 'MobileNetV2',
    name: 'mobilenet',
  },
  {
    id: 1,
    label: 'VGG19',
    name: 'vgg',
  },
  {
    id: 2,
    label: 'ResNet50',
    name: 'resnet',
  },
] as ImageClassificationModel[];
