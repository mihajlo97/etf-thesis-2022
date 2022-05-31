import { KEY_UPLOADED_IMAGE_URL } from "../consts/keys.consts"

export const getUploadedImageURL = () => sessionStorage.getItem(KEY_UPLOADED_IMAGE_URL) ?? '';

export const storeUploadedImage = (webcam: boolean, image: any) => 
    sessionStorage.setItem(KEY_UPLOADED_IMAGE_URL, webcam ? image : URL.createObjectURL(image));


export const removeUploadedImage = () => 
    sessionStorage.removeItem(KEY_UPLOADED_IMAGE_URL);
