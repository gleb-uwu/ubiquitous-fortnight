import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {OVERLAP_SEC, FPS, pop} from './theme';

const OVERLAP = Math.round(OVERLAP_SEC * FPS); // 15 кадров

// Обёртка сцены: появление через spring, уход — fade + лёгкий zoom-out.
export const SceneShell: React.FC<{
  durationInFrames: number;
  enter?: boolean;
  exit?: boolean;
  children: React.ReactNode;
}> = ({durationInFrames, enter = true, exit = true, children}) => {
  const frame = useCurrentFrame();

  const inP = enter ? pop(frame, 0, 14, 110) : 1;
  const outP = exit
    ? interpolate(frame, [durationInFrames - OVERLAP, durationInFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, inP * 1.4) * (1 - outP),
        scale: String((0.94 + 0.06 * inP) * (1 - 0.06 * outP)),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
