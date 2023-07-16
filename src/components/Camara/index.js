import { useEffect, useRef, useState } from 'react';
import { createDetector, SupportedModels } from "@tensorflow-models/hand-pose-detection";
import '@tensorflow/tfjs-backend-webgl';
// import { drawHands } from "../../lib/utils";
import { useAnimationFrame } from "@lib/hooks/useAnimationFrame";
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import styles from "@styles/Camara.module.css";
import { min } from '@tensorflow/tfjs-core';

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

async function setupDetector() {
  const model = SupportedModels.MediaPipeHands;
  const detector = await createDetector(
      model,
      {
          runtime: "mediapipe",
          maxHands: 1,
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
      }
  );

  return detector;
}

async function setupCanvas(video) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = video.width;
  canvas.height = video.height;

  return ctx;
}

export const drawboxHand = (hands, ctx) => {
    if (hands.length <= 0) { return; }
    for (let i = 0; i < hands.length; i++) {
        ctx.fillStyle = hands[i].handedness === 'Left' ? 'black' : 'Blue';
        ctx.strokeStyle = 'White';
        ctx.lineWidth = 2;
        let minY = hands[i].keypoints[0].y;
        let maxY = hands[i].keypoints[0].y;
        let minX = hands[i].keypoints[0].x;
        let maxX = hands[i].keypoints[0].x;

        for (let y = 0; y < hands[i].keypoints.length; y++) {
            const keypoint = hands[i].keypoints[y];
            if (minY > keypoint.y) minY = keypoint.y;
            if (maxY < keypoint.y) maxY = keypoint.y;
            if (minX > keypoint.x) minX = keypoint.x;
            if (maxX < keypoint.x) maxX = keypoint.x;
        }
        const points = [
            {x: minX - 30, y: minY - 30},
            {x: minX - 30, y: maxY + 30},
            {x: maxX + 30, y: maxY + 30},
            {x: maxX + 30, y: minY - 30},
            {x: minX - 30, y: minY - 30},
        ]
        drawPath(points, ctx);
    }
}

export const drawHands = (hands, ctx, showNames = false) => {
  if (hands.length <= 0) { return; }

  hands.sort((hand1, hand2) => {
      if (hand1.handedness < hand2.handedness) return 1;
      if (hand1.handedness > hand2.handedness) return -1;
      return 0;
  });

  // while (hands.length < 2) { hands.push(); }

  for (let i = 0; i < hands.length; i++) {
      ctx.fillStyle = hands[i].handedness === 'Left' ? 'black' : 'Blue';
      ctx.strokeStyle = 'White';
      ctx.lineWidth = 2;

      for (let y = 0; y < hands[i].keypoints.length; y++) {
          const keypoint = hands[i].keypoints[y];
          ctx.beginPath();
          ctx.arc(
              keypoint.x,
              keypoint.y,
              4,
              0,
              2 * Math.PI
          );
          ctx.fill();

          if (showNames) {
              drawInvertedText(keypoint, ctx);
          }
      }

      const fingers = Object.keys(FINGER_LOOKUP_INDICES);
      for (let z = 0; z < fingers.length; z++) {
          const finger = fingers[z];
          const points = FINGER_LOOKUP_INDICES[finger].map(idx => hands[i].keypoints[idx]);
          drawPath(points, ctx);
      }
  }
}

const FINGER_LOOKUP_INDICES = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

const drawPath = (points, ctx, closePath = false) => {
  const region = new Path2D();
  region.moveTo(points[0]?.x, points[0]?.y);
  for (let i = 1; i < points.length; i++) {
      const point = points[i];
      region.lineTo(point?.x, point?.y);
  }

  if (closePath) { region.closePath(); }

  ctx.stroke(region);
}

export default function Camara() {
  const detectorRef = useRef();
  const videoRef = useRef();
  const [ctx, setCtx] = useState();

  useEffect(() => {
    async function initialize() {
        videoRef.current = await setupVideo();
        const ctx = await setupCanvas(videoRef.current);
        detectorRef.current = await setupDetector();

        setCtx(ctx);
    }

    initialize();
  }, []);

  useAnimationFrame(async delta => {
    const hands = await detectorRef.current.estimateHands(
        video,
        {
            flipHorizontal: false
        }
    );

    ctx.clearRect(0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
    ctx.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
    // drawHands(hands, ctx);
    drawboxHand(hands, ctx);
  }, !!(detectorRef.current && videoRef.current && ctx));

  return (
    <div className={styles.container}>
        <main className={styles.main}>
            <code style={{ marginBottom: '1rem' }}>Work in progress...</code>
            <canvas
                style={{
                    transform: "scaleX(-1)",
                    zIndex: 1,
                    borderRadius: "1rem",
                    boxShadow: "0 3px 10px rgb(0 0 0)",
                    maxWidth: "85vw"
                }}
                id="canvas">
            </canvas>
            <video
                style={{
                    visibility: "hidden",
                    transform: "scaleX(-1)",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0
                }}
                id="video"
                playsInline>
            </video>
        </main>
        <div className={styles.output}><h1 className={styles.text}>A</h1></div>
    </div>
  )
}