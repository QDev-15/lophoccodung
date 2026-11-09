"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MotionFrame = {
  /** 0-100 overall motion intensity across the whole frame. */
  total: number;
  /** 0-100 motion intensity in the left half of the frame. */
  left: number;
  /** 0-100 motion intensity in the right half of the frame. */
  right: number;
};

const SAMPLE_WIDTH = 48;
const SAMPLE_HEIGHT = 36;

/**
 * Lightweight camera-based motion detector: no ML model, just compares
 * grayscale pixel values between consecutive downscaled frames. Good enough
 * to turn "move in front of the camera" into a playable classroom signal.
 */
export function useCameraMotion(onFrame: (frame: MotionFrame) => void) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);
  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  });

  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    prevFrameRef.current = null;
    setActive(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();

      if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
      const canvas = canvasRef.current;
      canvas.width = SAMPLE_WIDTH;
      canvas.height = SAMPLE_HEIGHT;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      setActive(true);

      const tick = () => {
        ctx.drawImage(video, 0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
        const { data } = ctx.getImageData(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);

        const gray = new Uint8ClampedArray(SAMPLE_WIDTH * SAMPLE_HEIGHT);
        for (let i = 0; i < gray.length; i++) {
          const o = i * 4;
          gray[i] = (data[o] + data[o + 1] + data[o + 2]) / 3;
        }

        const prev = prevFrameRef.current;
        if (prev) {
          let leftDiff = 0;
          let rightDiff = 0;
          const halfCol = SAMPLE_WIDTH / 2;
          for (let y = 0; y < SAMPLE_HEIGHT; y++) {
            for (let x = 0; x < SAMPLE_WIDTH; x++) {
              const idx = y * SAMPLE_WIDTH + x;
              const diff = Math.abs(gray[idx] - prev[idx]);
              if (x < halfCol) leftDiff += diff;
              else rightDiff += diff;
            }
          }

          const maxHalf = 255 * SAMPLE_WIDTH * SAMPLE_HEIGHT * 0.5;
          const left = Math.min(100, (leftDiff / maxHalf) * 100 * 6);
          const right = Math.min(100, (rightDiff / maxHalf) * 100 * 6);
          const total = Math.min(100, (left + right) / 2);
          onFrameRef.current({ total, left, right });
        }

        prevFrameRef.current = gray;
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError("Không thể truy cập camera. Hãy cho phép quyền camera trên trình duyệt rồi thử lại.");
      setActive(false);
    }
  }, []);

  useEffect(() => stop, [stop]);

  return { videoRef, start, stop, active, error };
}
