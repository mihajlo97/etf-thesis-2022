import { Resolution, VideoConstraints } from "../model/dashboard.model";

export const DEFAULT_WEBCAM_CONSTRAINTS = {
  width: 1280,
  height: 720,
  facingMode: "user",
} as VideoConstraints;

export const RESOLUTIONS = [
  {
    label: "720p",
    width: 1280,
    height: 720,
  },
  {
    label: "480p",
    width: 640,
    height: 480,
  },
  {
    label: "240p",
    width: 320,
    height: 240,
  },
  {
    label: "144p",
    width: 256,
    height: 144,
  },
] as Resolution[];

export const MODELS = [
  "Image classification",
  "Object detection",
  "Face detection",
];
