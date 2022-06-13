import {
  KEY_RESIZED_IMAGE_URL,
  KEY_UPLOADED_IMAGE_URL,
} from "../consts/keys.consts";

export const getUploadedImageURL = () =>
  sessionStorage.getItem(KEY_UPLOADED_IMAGE_URL) ?? "";

export const storeUploadedImage = (webcam: boolean, image: any) =>
  sessionStorage.setItem(
    KEY_UPLOADED_IMAGE_URL,
    webcam ? image : URL.createObjectURL(image)
  );

export const storeResizedImage = (url: string) =>
  sessionStorage.setItem(KEY_RESIZED_IMAGE_URL, url);

export const removeUploadedImage = () => {
  sessionStorage.removeItem(KEY_UPLOADED_IMAGE_URL);
  sessionStorage.removeItem(KEY_RESIZED_IMAGE_URL);
};

export const clearResizedImage = () =>
  sessionStorage.removeItem(KEY_RESIZED_IMAGE_URL);

export const resizeImage = (resizeWidth: number, resizeHeight: number) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const image = new Image();
  image.src = getUploadedImageURL();

  canvas.width = resizeWidth;
  canvas.height = resizeHeight;

  context?.drawImage(image, 0, 0, resizeWidth, resizeHeight);

  storeResizedImage(canvas.toDataURL());
};
