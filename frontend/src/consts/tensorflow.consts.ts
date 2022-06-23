import { ImageClassificationModel } from "../model/tensorflow.model";

export const MODELS = [
  {
    id: 0,
    label: "MobileNetV2",
  },
  {
    id: 1,
    label: "VGG19",
  },
  {
    id: 2,
    label: "ResNet50",
  },
] as ImageClassificationModel[];
