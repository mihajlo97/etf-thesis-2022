import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { ImageClassificationResults } from '../model/tensorflow.model';
import { getSourceImageData } from './image.service';
import { MODELS } from '../consts/tensorflow.consts';
import { classifyImage } from './api.service';
import { ModelName } from '../model/api-request.model';

export type ModelType = mobilenet.MobileNet | tf.LayersModel;

export const getModels = () => MODELS;

export const getModel = (modelId: number) => getModels()[modelId];

export const loadModel = async (model: ModelName): Promise<ModelType> => {
  switch (model) {
    case 'mobilenet':
      return mobilenet.load({ version: 2, alpha: 1 });

    case 'resnet':
      return tf.loadLayersModel('http://localhost:3000/assets/models/resnet/model.json');

    case 'vgg':
      return tf.loadLayersModel('http://localhost:3000/assets/models/vgg/model.json');
  }
};

export const performClassification = async (model: ModelType, name: ModelName, tensor: tf.Tensor3D) => {
  if (name === 'mobilenet') {
    return (model as mobilenet.MobileNet).classify(tensor);
  }

  return (model as tf.LayersModel).predict(tensor);
};

export const classifyImageLocally = async (model: ModelName): Promise<ImageClassificationResults> => {
  try {
    //const tfjsModel = await mobilenet.load({ version: 2, alpha: 1 });

    const tfjsModel = await loadModel(model);

    const imageData = (await getSourceImageData()).imageData;

    if (!imageData) {
      throw new Error('Error: Canvas returned undefined for image data.');
    }

    const tensor = tf.browser.fromPixels(imageData);

    //const results = await tfjsModel.classify(tensor);

    const results = performClassification(tfjsModel, model, tensor);

    return {
      resolution: { width: imageData.width, height: imageData.height },
      results,
    };
  } catch (err) {
    console.log('ClassifyImageError', { err });

    throw err;
  }
};

export const sendImageForClassification = async (model: ModelName): Promise<ImageClassificationResults> => {
  try {
    const sourceImageData = await getSourceImageData(true);
    const imageData = sourceImageData.imageData;
    const img = sourceImageData.base64 ?? '';

    if (!imageData) {
      throw new Error('Error: Canvas returned undefined for image data.');
    }

    const response = await classifyImage({ model, img });
    const results = [...response.data.results].slice(0, 3);

    return {
      resolution: { width: imageData.width, height: imageData.height },
      results,
    };
  } catch (err) {
    console.log('SendImageForClassificationError', { err });

    throw err;
  }
};
