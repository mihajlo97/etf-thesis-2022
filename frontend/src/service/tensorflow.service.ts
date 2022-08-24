import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { ImageClassificationResults } from '../model/tensorflow.model';
import { getSourceImageData } from './image.service';
import { MODELS } from '../consts/tensorflow.consts';
import { classifyImage } from './api.service';
import { ModelName } from '../model/api-request.model';

// export type ModelType = mobilenet.MobileNet | tf.LayersModel;

export const getModels = () => MODELS;

export const getModel = (modelId: number) => getModels()[modelId];

export const loadModel = async (model: ModelName): Promise<mobilenet.MobileNet> => {
  /*switch (model) {
    case 'mobilenet':
      return mobilenet.load({ version: 2, alpha: 1 });

    case 'resnet':
      return tf.loadLayersModel(
        'https://raw.githubusercontent.com/mihajlo97/etf-thesis-2022/main/frontend/src/assets/models/resnet/model.json'
      );

    case 'vgg':
      return tf.loadLayersModel(
        'https://raw.githubusercontent.com/mihajlo97/etf-thesis-2022/main/frontend/src/assets/models/vgg/model.json'
      );
  }*/

  switch (model) {
    case 'mobilenet':
      return mobilenet.load({ version: 1, alpha: 1 });

    case 'mobilenet_v2':
      return mobilenet.load({ version: 2, alpha: 1 });

    default:
      throw new Error(`LoadModelError: No such model ${model}.`);
  }
};

/*export const performClassification = async (model: ModelType, name: ModelName, image: ImageData) => {
  const tensor = tf.browser.fromPixels(image);

  console.log('Tensor', tensor);

  if (name === 'mobilenet') {
    return (model as mobilenet.MobileNet).classify(tensor);
  }

  return (model as tf.LayersModel).predict(tensor.reshape([1, 224, 224, 3]));
};*/

export const classifyImageLocally = async (model: ModelName): Promise<ImageClassificationResults> => {
  try {
    const tfjsModel = await loadModel(model);

    const startMeasuring = Date.now();

    const imageData = (await getSourceImageData()).imageData;

    if (!imageData) {
      throw new Error('Error: Canvas returned undefined for image data.');
    }

    const tensor = tf.browser.fromPixels(imageData);

    const imagePreparationTime = Date.now() - startMeasuring;

    const startMeasuringPredictionTime = Date.now();

    const results = await tfjsModel.classify(tensor);

    const predictionTime = Date.now() - startMeasuringPredictionTime;

    const totalProcessingTime = Date.now() - startMeasuring;

    const responseTime = totalProcessingTime;

    return {
      resolution: { width: imageData.width, height: imageData.height },
      results,
      processingTime: { imagePreparationTime, predictionTime, totalProcessingTime, responseTime },
    };
  } catch (err) {
    console.error('ClassifyImageError', { err });

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
    const { imagePreparationTime, predictionTime, totalProcessingTime } = response.data;

    return {
      resolution: { width: imageData.width, height: imageData.height },
      results,
      processingTime: { imagePreparationTime, predictionTime, totalProcessingTime },
    };
  } catch (err) {
    console.error('SendImageForClassificationError', { err });

    throw err;
  }
};
