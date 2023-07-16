import * as tf from '@tensorflow/tfjs';
tf.setBackend('webgl');

const threshold = 0.75;

class L2 {

  static className = 'L2';

  constructor(config) {
    return tf.regularizers.l1l2(config)
  }
}

async function load_model() {
  // It's possible to load the model locally or from a repo
  // You can choose whatever IP and PORT you want in the "http://127.0.0.1:8080/model.json" just set it before in your https server
  //const model = await loadGraphModel("http://127.0.0.1:8080/model.json");
  tf.serialization.registerClass(L2);
  const model = await tf.loadLayersModel("https://raw.githubusercontent.com/ad-ejami/ASL_demo/main/models/alexnet_model/model.json");
  console.log('Model Loaded');
  console.log(model);
  return model;
}

const classesDir = {
  1: {
      name: 'A',
      id: 1,
  },
  2: {
      name: 'B',
      id: 2,
  },
  3: {
      name: 'C',
      id: 3,
  },
  4: {
      name: 'D',
      id: 4,
  },
  5: {
      name: 'E',
      id: 5,
  },
  6: {
      name: 'F',
      id: 6,
  },
  7: {
      name: 'G',
      id: 7,
  },
  8: {
      name: 'H',
      id: 8,
  },
  9: {
      name: 'I',
      id: 9,
  },
  10: {
      name: 'J',
      id: 10,
  },
  11: {
      name: 'K',
      id: 11,
  },
  12: {
      name: 'L',
      id: 12,
  },
  13: {
      name: 'M',
      id: 13,
  },
  14: {
      name: 'N',
      id: 14,
  },
  15: {
      name: 'O',
      id: 15,
  },
  16: {
      name: 'P',
      id: 16,
  },
  17: {
      name: 'Q',
      id: 17,
  },
  18: {
      name: 'R',
      id: 18,
  },
  19: {
      name: 'S',
      id: 19,
  },
  20: {
      name: 'T',
      id: 20,
  },
  21: {
      name: 'U',
      id: 21,
  },
  22: {
      name: 'V',
      id: 22,
  },
  23: {
      name: 'W',
      id: 23,
  },
  24: {
      name: 'X',
      id: 24,
  },
  25: {
      name: 'Y',
      id: 25,
  },
  26: {
      name: 'Z',
      id: 26,
  },
}

export {load_model, classesDir};