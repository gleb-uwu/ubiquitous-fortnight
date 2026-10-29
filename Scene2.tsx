import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT, pop, rand, sceneFrames} from './theme';
import {SceneShell} from './SceneShell';

const TOKENS = ['Как', ' рабо', 'тает', ' ИИ', '?'];
const WIDTHS = [190, 250, 220, 200, 120];
const GAP = 24;
const BARS = 6;
const ROW_Y = 430;

const sumTo = (i: number): number => WIDTHS.slice(0, i).reduce((a, b) => a + b, 0);
const TOTAL_COMPACT = WIDTHS.reduce((a, b) => a + b, 0);
const TOTAL_ROW = TOTAL_COMPACT + GAP * (TOKENS.length - 1);

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  // Счётчик токенов: растёт по мере того как плашки встают в ряд
  const count = TOKENS.filter((_, i) => frame >= 26 + i * 6).length;
  const pulse = Math.max(
    ...TOKENS.map((_, i) =>
      interpolate(frame, [26 + i * 6, 30 + i * 6, 40 + i * 6], [0, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    ),
  );
  const counterIn = pop(frame, 14, 12, 140);

  // Подписи
  const cap1In = pop(frame, 18, 12, 130);
  const cap1Out = interpolate(frame, [100, 118], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cap2In = pop(frame, 112, 12, 130);

  return (
    <SceneShell durationInFrames={sceneFrames('s2')}>
      <AbsoluteFill style={{fontFamily: FONT}}>
        {/* Счётчик токенов */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 1920,
            top: 215 + Math.sin(frame / 22) * 6,
            textAlign: 'center',
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.cyan,
            opacity: Math.min(1, counterIn * 1.5),
            scale: String(0.8 + 0.2 * counterIn + 0.12 * pulse),
            textShadow: `0 0 24px ${COLORS.cyan}`,
          }}
        >
          токенов: {count}
        </div>

        {/* Плашки-токены → столбики-числа */}
        {TOKENS.map((t, i) => {
          const color = i % 2 === 0 ? COLORS.violet : COLORS.cyan;
          const compactX = (1920 - TOTAL_COMPACT) / 2 + sumTo(i);
          const rowX = (1920 - TOTAL_ROW) / 2 + sumTo(i) + GAP * i;

          const spread = pop(frame, 10 + i * 4, 12, 120);
          const bump = interpolate(frame, [8 + i * 3, 22 + i * 3, 52 + i * 3], [0, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          const sx = (rand(i + 7) - 0.5) * 520;
          const sy = (rand(i + 17) - 0.5) * 380;
          const rot = (rand(i + 27) - 0.5) * 46;

          const x = compactX + (rowX - compactX) * spread + sx * bump;
          const y = ROW_Y + sy * bump + Math.sin(frame / 20 + i) * 7;

          // Превращение в столбики
          const morph = interpolate(frame, [100 + i * 3, 124 + i * 3], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: WIDTHS[i],
                height: 130,
                rotate: `${rot * bump}deg`,
              }}
            >
              {/* Плашка */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 28,
                  border: `3px solid ${color}`,
                  background: `linear-gradient(135deg, ${color}44, rgba(20,20,40,0.85))`,
                  boxShadow: `0 0 36px ${color}88, inset 0 0 24px ${color}33`,
                  fontSize: 68,
                  fontWeight: 800,
                  color: COLORS.text,
                  whiteSpace: 'pre',
                  opacity: 1 - morph,
                  scale: String(0.6 + 0.4 * Math.min(1.1, pop(frame, 4 + i * 3, 11, 160)) - 0.25 * morph),
                }}
              >
                {t}
              </div>

              {/* Столбик из 6 тонких полосок (числа) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                {Array.from({length: BARS}).map((_, j) => {
                  const h0 = 40 + rand(i * 10 + j + 3) * 170;
                  const grow = pop(frame, 108 + i * 3 + j * 2, 12, 150);
                  const breathe = 1 + 0.09 * Math.sin(frame / 9 + j * 1.3 + i);
                  return (
                    <div
                      key={j}
                      style={{
                        width: 12,
                        height: Math.max(0, h0 * grow * breathe),
                        borderRadius: 6,
                        background: `linear-gradient(180deg, ${color}, ${
                          i % 2 === 0 ? COLORS.cyan : COLORS.violet
                        })`,
                        boxShadow: `0 0 14px ${color}`,
                        opacity: interpolate(frame, [104 + i * 3, 112 + i * 3], [0, 1], {
                          extrapolateLeft: 'clamp',
                          extrapolateRight: 'clamp',
                        }),
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Подписи */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 1920,
            top: 780 + (1 - cap1In) * 40 - cap1Out * 30,
            textAlign: 'center',
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.text,
            opacity: Math.min(1, cap1In * 1.5) * (1 - cap1Out),
          }}
        >
          <span style={{color: COLORS.cyan}}>1.</span> Текст → кусочки (токены)
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 1920,
            top: 780 + (1 - cap2In) * 40 + Math.sin(frame / 18) * 5,
            textAlign: 'center',
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.text,
            opacity: Math.min(1, cap2In * 1.5),
          }}
        >
          <span style={{color: COLORS.violet}}>2.</span> Кусочки → числа
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
