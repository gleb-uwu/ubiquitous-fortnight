import {loadFont} from '@remotion/google-fonts/Inter';

// Только нужные начертания и подмножества (кириллица + латиница)
const {fontFamily} = loadFont('normal', {
  weights: ['500', '700', '800'],
  subsets: ['cyrillic', 'latin'],
});

export const FPS = 30;
export const TOTAL_FRAMES = 900;

export const COLORS = {
  bg: '#07070F',
  violet: '#8B5CF6',
  cyan: '#22D3EE',
  orange: '#FB923C',
  text: '#F4F4FF',
  dim: '#9A9AB8',
  panel: 'rgba(20, 20, 40, 0.72)',
} as const;

export const FONT = fontFamily;

// Сцены в секундах: [начало, конец]. Соседние перекрываются на 0,5 с.
export const OVERLAP_SEC = 0.5;
export const SCENES = {
  s1: {from: 0, to: 3},
  s2: {from: 2.5, to: 8.5},
  s3: {from: 8, to: 15},
  s4: {from: 14.5, to: 21},
  s5: {from: 20.5, to: 26},
  s6: {from: 25.5, to: 30},
} as const;

export const sec = (s: number): number => Math.round(s * FPS);
export const sceneFrames = (k: keyof typeof SCENES): number =>
  sec(SCENES[k].to) - sec(SCENES[k].from);

// Детерминированный «рандом» (без Math.random — иначе кадры не повторяются)
export const rand = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Пружина с лёгким перелётом: значение 0 → 1 (с небольшим overshoot)
import {spring} from 'remotion';
export const pop = (frame: number, delay = 0, damping = 11, stiffness = 140): number =>
  spring({
    frame: frame - delay,
    fps: FPS,
    config: {damping, stiffness, mass: 0.8},
  });
