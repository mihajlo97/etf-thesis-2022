import * as tf from "@tensorflow/tfjs-core";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { Result } from "../model/tensorflow.model";
import { getSourceImageData } from "./image.service";
import { MODELS } from "../consts/tensorflow.consts";

export const getModels = () => MODELS;

export const getModel = (modelId: number) => getModels()[modelId];

export const classifyImage = async (): Promise<Result[]> => {
  try {
    const tfjsModel = await mobilenet.load({ version: 2, alpha: 1 });

    const imageData = await getSourceImageData();

    if (!imageData) {
      throw new Error("Error: Canvas returned undefined for image data.");
    }

    const tensor = tf.browser.fromPixels(imageData);
    const results = await tfjsModel.classify(tensor);

    return results;
  } catch (err) {
    console.log("ClassifyImageError", { err });

    throw err;
  }
};
