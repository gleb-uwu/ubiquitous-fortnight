import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, TOTAL_FRAMES, rand} from './theme';

const PARTICLES = 46;

// Общий слой: мягкий градиент, плывущие светящиеся частицы, линия прогресса.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const appear = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* Медленно «дышащие» градиентные пятна */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 700px at ${
            30 + Math.sin(frame / 160) * 8
          }% ${35 + Math.cos(frame / 190) * 8}%, rgba(139,92,246,0.20), rgba(7,7,15,0) 70%),
            radial-gradient(800px 650px at ${
              72 + Math.cos(frame / 170) * 8
            }% ${68 + Math.sin(frame / 140) * 8}%, rgba(34,211,238,0.14), rgba(7,7,15,0) 70%)`,
          opacity: appear,
        }}
      />

      {/* Частицы */}
      {Array.from({length: PARTICLES}).map((_, i) => {
        const baseX = rand(i + 1) * 1920;
        const baseY = rand(i + 101) * 1080;
        const size = 3 + rand(i + 201) * 7;
        const speed = 0.006 + rand(i + 301) * 0.012;
        const phase = rand(i + 401) * Math.PI * 2;
        const x = baseX + Math.sin(frame * speed + phase) * (40 + rand(i + 501) * 70);
        // медленный подъём вверх с «заворотом» по высоте
        const y = (((baseY - frame * (0.12 + rand(i + 601) * 0.35)) % 1160) + 1160) % 1160 - 40;
        const twinkle = 0.45 + 0.55 * Math.sin(frame * 0.05 + phase);
        const color = i % 3 === 0 ? COLORS.cyan : COLORS.violet;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: appear * (0.25 + 0.5 * twinkle),
              boxShadow: `0 0 ${size * 4}px ${size}px ${color}55`,
            }}
          />
        );
      })}

      {/* Линия прогресса на всю ширину */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: 6,
          backgroundColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            width: `${interpolate(frame, [0, TOTAL_FRAMES], [0, 100], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${COLORS.violet}, ${COLORS.cyan})`,
            boxShadow: `0 0 18px ${COLORS.cyan}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
