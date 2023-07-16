import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import { useAnimationFrame } from "@lib/hooks/useAnimationFrame";
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
  return model;
}

let classesDir = {
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

async function setupVideo() {
  const video = document.getElementById('video');
  const stream = await window.navigator.mediaDevices.getUserMedia({ video: true });

  video.srcObject = stream;
  await new Promise((resolve) => {
      video.onloadedmetadata = () => {
          resolve();
      }
  });
  video.play();

  video.width = video.videoWidth;
  video.height = video.videoHeight;

  return video;
}

async function setupCanvas(video) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = video.width;
  canvas.height = video.height;

  return ctx;
}

const ObjCamara = () => {
  // const detectorRef = useRef();
  const videoRef = useRef();
  const [ctx, setCtx] = useState();
  const [modelPromise, setModelPromise] = useState();

  useEffect(() => {
    async function initialize() {
        videoRef.current = await setupVideo();
        const ctx = await setupCanvas(videoRef.current);
        // detectorRef.current = await setupDetector();

        setCtx(ctx);
        setModelPromise(load_model());
    }

    initialize();
  }, []);

  async function detectFrame (video, model) {
    tf.engine().startScope();
    console.log('model');
    console.log(model);
    if (model) {
      model.predictions
    }
    // model?.predict(process_input(video)).then(predictions => {
    //   renderPredictions(predictions, video);
    //   requestAnimationFrame(() => {
    //     detectFrame(video, model);
    //   });
    //   tf.engine().endScope();
    // });
  };

  const process_input = (video_frame) => {
    const tfimg = tf.browser.fromPixels(video_frame); // .toInt();
    // const expandedimg = tfimg.transpose([0,1,2]).expandDims();
    return tfimg;
  };

  const buildDetectedObjects = (scores, threshold, boxes, classes, classesDir) => {
    const detectionObjects = []
    var video_frame = document.getElementById('video');

    scores[0].forEach((score, i) => {
      if (score > threshold) {
        const bbox = [];
        const minY = boxes[0][i][0] * video_frame.offsetHeight;
        const minX = boxes[0][i][1] * video_frame.offsetWidth;
        const maxY = boxes[0][i][2] * video_frame.offsetHeight;
        const maxX = boxes[0][i][3] * video_frame.offsetWidth;
        bbox[0] = minX;
        bbox[1] = minY;
        bbox[2] = maxX - minX;
        bbox[3] = maxY - minY;
        detectionObjects.push({
          class: classes[i],
          label: classesDir[classes[i]].name,
          score: score.toFixed(4),
          bbox: bbox
        })
      }
    })
    return detectionObjects
  }

  const renderPredictions = (predictions) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    //Getting predictions
    const boxes = predictions[4].arraySync();
    const scores = predictions[5].arraySync();
    const classes = predictions[6].dataSync();
    const detections = buildDetectedObjects(scores, threshold,
                                    boxes, classes, classesDir);

    detections.forEach(item => {
      const x = item['bbox'][0];
      const y = item['bbox'][1];
      const width = item['bbox'][2];
      const height = item['bbox'][3];

    console.log(detections);

      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%").width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    detections.forEach(item => {
      const x = item['bbox'][0];
      const y = item['bbox'][1];

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(item["label"] + " " + (100*item["score"]).toFixed(2) + "%", x, y);
    });
  };

  useEffect(() => {
    detectFrame(videoRef.current, modelPromise);
  }, [modelPromise, videoRef.current]);

  return (
    <div>
      <h1>Real-Time Object Detection: Hands</h1>
      <h3>MobileNetV2</h3>
      <video
        style={{height: '600px', width: "500px"}}
        className="size"
        autoPlay
        playsInline
        muted
        width="600"
        height="500"
        id="video"
      />
      <canvas
        className="size"
        width="600"
        height="500"
        id="canvas"
      />
    </div>
  );
}

export default ObjCamara;