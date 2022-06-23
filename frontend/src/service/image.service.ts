import { ASPECT_RATIO, IMAGE_SCALES } from "../consts/image.consts";
import {
  KEY_RESIZED_IMAGE_URL,
  KEY_UPLOADED_IMAGE_URL,
} from "../consts/keys.consts";

export const getImageScales = () => IMAGE_SCALES;

export const getImageScale = (imageScaleId: number) =>
  getImageScales()[imageScaleId];

export const getAspectRatios = () => ASPECT_RATIO;

export const getAspectRatio = (aspectRatioId: number) =>
  getAspectRatios()[aspectRatioId];

export const getUploadedImageURL = () =>
  sessionStorage.getItem(KEY_UPLOADED_IMAGE_URL) ?? "";

export const getSourceImageURL = () =>
  sessionStorage.getItem(KEY_RESIZED_IMAGE_URL) ??
  sessionStorage.getItem(KEY_UPLOADED_IMAGE_URL) ??
  "";

export const storeUploadedImage = (webcam: boolean, image: any) =>
  sessionStorage.setItem(
    KEY_UPLOADED_IMAGE_URL,
    webcam ? image : URL.createObjectURL(image)
  );

export const storeResizedImage = (image: any) =>
  sessionStorage.setItem(KEY_RESIZED_IMAGE_URL, URL.createObjectURL(image));

export const removeUploadedImages = () => {
  sessionStorage.removeItem(KEY_UPLOADED_IMAGE_URL);
  sessionStorage.removeItem(KEY_RESIZED_IMAGE_URL);
};

export const clearResizedImage = () =>
  sessionStorage.removeItem(KEY_RESIZED_IMAGE_URL);

export const getSourceImageData = async (): Promise<ImageData> => {
  const image = new Image();
  image.src = getSourceImageURL();

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return new Promise((resolve, reject) => reject());
  }

  await image.decode();

  const width = image.width;
  const height = image.height;

  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);

  return imageData;
};

export const resizeImage = (resizeWidth: number, resizeHeight: number) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const image = new Image();
  image.src = getUploadedImageURL();

  canvas.width = resizeWidth;
  canvas.height = resizeHeight;

  context?.drawImage(image, 0, 0, resizeWidth, resizeHeight);

  canvas.toBlob((blob) => storeResizedImage(blob));
};
