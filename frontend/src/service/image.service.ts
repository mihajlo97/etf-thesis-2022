import {
  ASPECT_RATIO,
  IMAGE_SCALES,
  ORIGINAL_ASPECT_RATIO_ID,
  ORIGINAL_IMAGE_SCALE_ID,
  SQUARE_ASPECT_RATIO_ID,
} from '../consts/image.consts';
import { KEY_RESIZED_IMAGE_URL, KEY_UPLOADED_IMAGE_URL } from '../consts/keys.consts';
import { AspectRatio, ImageScale, SourceImageData } from '../model/image.model';

export const getImageScales = () => IMAGE_SCALES;

export const getImageScale = (imageScaleId: number) => getImageScales()[imageScaleId];

export const getAspectRatios = () => ASPECT_RATIO;

export const getAspectRatio = (aspectRatioId: number) => getAspectRatios()[aspectRatioId];

export const getUploadedImageURL = () => sessionStorage.getItem(KEY_UPLOADED_IMAGE_URL) ?? '';

export const getSourceImageURL = () =>
  sessionStorage.getItem(KEY_RESIZED_IMAGE_URL) ?? sessionStorage.getItem(KEY_UPLOADED_IMAGE_URL) ?? '';

export const storeUploadedImage = (webcam: boolean, image: any) =>
  sessionStorage.setItem(KEY_UPLOADED_IMAGE_URL, webcam ? image : URL.createObjectURL(image));

export const storeResizedImage = (image: any) =>
  sessionStorage.setItem(KEY_RESIZED_IMAGE_URL, URL.createObjectURL(image));

export const removeUploadedImages = () => {
  sessionStorage.removeItem(KEY_UPLOADED_IMAGE_URL);
  sessionStorage.removeItem(KEY_RESIZED_IMAGE_URL);
};

export const clearResizedImage = () => sessionStorage.removeItem(KEY_RESIZED_IMAGE_URL);

export const resizeImage = (resizeWidth: number, resizeHeight: number) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const image = new Image();
  image.src = getUploadedImageURL();

  canvas.width = resizeWidth;
  canvas.height = resizeHeight;

  context?.drawImage(image, 0, 0, resizeWidth, resizeHeight);

  canvas.toBlob((blob) => storeResizedImage(blob));
};

export const resizeToSquareAspectRatio = (rescaledWidth: number, rescaledHeight: number) => {
  const transformedWidth = rescaledWidth >= rescaledHeight ? rescaledWidth : rescaledHeight;
  const transformedHeight = transformedWidth;

  resizeImage(transformedWidth, transformedHeight);
};

export const transformImage = async (imageScale: ImageScale, aspectRatio: AspectRatio) => {
  const image = new Image();
  image.src = getUploadedImageURL();

  try {
    await image.decode();

    const keepAspectRatio = aspectRatio.id === ORIGINAL_ASPECT_RATIO_ID;
    const squareAspectRatio = aspectRatio.id === SQUARE_ASPECT_RATIO_ID;
    const noTransformationsNeeded = imageScale.id === ORIGINAL_IMAGE_SCALE_ID && keepAspectRatio;

    if (noTransformationsNeeded) {
      return;
    }

    const rescaledWidth = Math.round(image.width * imageScale.multiplier);
    const rescaledHeight = Math.round(image.height * imageScale.multiplier);

    if (keepAspectRatio) {
      resizeImage(rescaledWidth, rescaledHeight);
      return;
    }

    if (squareAspectRatio) {
      resizeToSquareAspectRatio(rescaledWidth, rescaledHeight);
      return;
    }

    const { aspectX, aspectY } = aspectRatio;
    let transformedWidth = rescaledWidth,
      transformedHeight = rescaledHeight;

    if (aspectX > aspectY) {
      transformedHeight = Math.floor((aspectY / aspectX) * transformedWidth);
    } else {
      transformedWidth = Math.floor((aspectX / aspectY) * transformedHeight);
    }

    resizeImage(transformedWidth, transformedHeight);
  } catch (err) {
    throw err;
  }
};

export const getSourceImageData = async (fetchBase64?: boolean): Promise<SourceImageData> => {
  const image = new Image();
  image.src = getSourceImageURL();

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return new Promise((resolve, reject) => reject());
  }

  try {
    await image.decode();

    const width = image.width;
    const height = image.height;

    context.drawImage(image, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);

    if (fetchBase64) {
      const dataURL = canvas.toDataURL('image/jpg');
      const base64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, '');

      return {
        imageData,
        base64,
      };
    }

    return {
      imageData,
    };
  } catch (err) {
    console.error('GetSourceImageDataError', { err });

    return new Promise((resolve, reject) => reject());
  }
};
