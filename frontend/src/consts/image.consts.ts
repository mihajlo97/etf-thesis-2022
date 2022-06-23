import { AspectRatio, ImageScale } from "../model/image.model";

export const IMAGE_SCALES = [
  {
    id: 0,
    multiplier: 1,
    label: "x1",
  },
  {
    id: 1,
    multiplier: 2,
    label: "x2",
  },
  {
    id: 2,
    multiplier: 0.5,
    label: "x0.5",
  },
  {
    id: 3,
    multiplier: 0.2,
    label: "x0.25",
  },
] as ImageScale[];

export const ASPECT_RATIO = [
  {
    id: 0,
    aspectX: 1,
    aspectY: 1,
    label: "Original",
  },
  {
    id: 1,
    aspectX: 1,
    aspectY: 1,
    label: "1:1",
  },
  {
    id: 2,
    aspectX: 4,
    aspectY: 3,
    label: "4:3",
  },
  {
    id: 3,
    aspectX: 16,
    aspectY: 9,
    label: "16:9",
  },
  {
    id: 4,
    aspectX: 3,
    aspectY: 2,
    label: "3:2",
  },
  {
    id: 5,
    aspectX: 3,
    aspectY: 4,
    label: "3:4",
  },
  {
    id: 6,
    aspectX: 9,
    aspectY: 16,
    label: "9:16",
  },
  {
    id: 7,
    aspectX: 2,
    aspectY: 3,
    label: "2:3",
  },
] as AspectRatio[];

export const ORIGINAL_IMAGE_SCALE_ID = 0;
export const ORIGINAL_ASPECT_RATIO_ID = 0;
export const SQUARE_ASPECT_RATIO_ID = 1;
