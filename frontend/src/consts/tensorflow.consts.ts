import { ImageClassificationModel } from '../model/tensorflow.model';

export const MODELS = [
  {
    id: 0,
    label: 'MobileNet v1',
    name: 'mobilenet',
  },
  {
    id: 1,
    label: 'MobileNet v2',
    name: 'mobilenet_v2',
  },
] as ImageClassificationModel[];
