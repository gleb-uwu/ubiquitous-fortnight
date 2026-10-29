import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT, pop, sceneFrames} from './theme';
import {SceneShell} from './SceneShell';

const WORDS = (
  'ИИ учился на огромном количестве текстов и умеет предсказывать следующее слово. ' +
  'Так слово за словом и складывается ответ.'
).split(' ');

const FIRST_WORD_AT = 30; // кадр, когда печатается 2-е слово
const STEP = 6; // кадров между словами

// Кадр появления каждого слова (ИИ прилетает сразу)
const appearAt = (k: number): number => (k === 0 ? 0 : FIRST_WORD_AT + (k - 1) * STEP);

const RING_CX = 1560;
const RING_CY = 520;
const RING_R = 150;

// Наконечник стрелки на конце дуги (78% окружности по часовой)
const END_ANGLE = Math.PI * 2 * 0.78;
const px = RING_CX + RING_R * Math.cos(END_ANGLE);
const py = RING_CY + RING_R * Math.sin(END_ANGLE);
const tx = -Math.sin(END_ANGLE); // касательная по часовой
const ty = Math.cos(END_ANGLE);
const nx = Math.cos(END_ANGLE);
const ny = Math.sin(END_ANGLE);
const ARROW = [
  [px + tx * 34, py + ty * 34],
  [px - tx * 6 + nx * 24, py - ty * 6 + ny * 24],
  [px - tx * 6 - nx * 24, py - ty * 6 - ny * 24],
]
  .map((p) => p.join(','))
  .join(' ');

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  const wordsShown = WORDS.filter((_, k) => frame >= appearAt(k) + (k === 0 ? 14 : 3)).length;
  const lastChange = Math.max(...WORDS.map((_, k) => (frame >= appearAt(k) + (k === 0 ? 14 : 3) ? appearAt(k) + (k === 0 ? 14 : 3) : 0)));
  const pulse = interpolate(frame, [lastChange, lastChange + 3, lastChange + 10], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bubbleIn = pop(frame, 4, 13, 120);
  const counterIn = pop(frame, 10, 12, 130);
  const ringIn = pop(frame, 14, 12, 120);
  const capIn = pop(frame, 18, 12, 130);

  return (
    <SceneShell durationInFrames={sceneFrames('s5')}>
      <AbsoluteFill style={{fontFamily: FONT}}>
        {/* Имя говорящего */}
        <div
          style={{
            position: 'absolute',
            left: 200,
            top: 215,
            fontSize: 40,
            fontWeight: 700,
            color: COLORS.cyan,
            opacity: Math.min(1, bubbleIn * 1.5),
            textShadow: `0 0 16px ${COLORS.cyan}`,
          }}
        >
          Claude
        </div>

        {/* Чат-пузырь */}
        <div
          style={{
            position: 'absolute',
            left: 180,
            top: 280 + Math.sin(frame / 24) * 5,
            width: 1060,
            padding: '52px 56px',
            borderRadius: 44,
            borderTopLeftRadius: 12,
            background: COLORS.panel,
            border: `3px solid ${COLORS.violet}`,
            boxShadow: `0 0 44px ${COLORS.violet}77, inset 0 0 40px ${COLORS.violet}22`,
            opacity: Math.min(1, bubbleIn * 1.5),
            scale: String(0.7 + 0.3 * bubbleIn),
            transformOrigin: '0% 0%',
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 16,
            rowGap: 6,
            fontSize: 54,
            fontWeight: 500,
            lineHeight: 1.35,
            color: COLORS.text,
          }}
        >
          {WORDS.map((w, k) => {
            const isFirst = k === 0;
            const t = frame - appearAt(k);
            const p = pop(frame, appearAt(k), 12, 150);
            const glow = interpolate(t, [0, 4, 24], [0, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            // «ИИ» прилетает справа из прошлой сцены
            const flyX = isFirst
              ? interpolate(frame, [0, 24], [1700, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })
              : 0;
            return (
              <span
                key={k}
                style={{
                  display: 'inline-block',
                  fontWeight: isFirst ? 800 : 500,
                  color: isFirst ? COLORS.orange : COLORS.text,
                  opacity: isFirst ? 1 : Math.min(1, p * 1.6),
                  translate: isFirst ? `${flyX}px 0px` : `0px ${(1 - p) * 18}px`,
                  scale: String(isFirst ? 1 : 0.8 + 0.2 * p),
                  textShadow: isFirst
                    ? `0 0 ${18 + 8 * Math.sin(frame / 10)}px ${COLORS.orange}`
                    : `0 0 ${22 * glow}px ${COLORS.cyan}`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>

        {/* Счётчик слов */}
        <div
          style={{
            position: 'absolute',
            left: RING_CX - 260,
            width: 520,
            top: 240 + Math.sin(frame / 20) * 5,
            textAlign: 'center',
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.cyan,
            opacity: Math.min(1, counterIn * 1.5),
            scale: String(0.8 + 0.2 * counterIn + 0.1 * pulse),
            textShadow: `0 0 24px ${COLORS.cyan}`,
          }}
        >
          слов: {wordsShown}
        </div>

        {/* Круговая стрелка «повторяю» */}
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{position: 'absolute', left: 0, top: 0}}
        >
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.violet} />
              <stop offset="100%" stopColor={COLORS.cyan} />
            </linearGradient>
          </defs>
          <g
            opacity={Math.min(1, ringIn * 1.5)}
            style={{filter: `drop-shadow(0 0 12px ${COLORS.cyan}aa)`}}
          >
            <g transform={`rotate(${frame * 4.5} ${RING_CX} ${RING_CY})`}>
              <circle
                cx={RING_CX}
                cy={RING_CY}
                r={RING_R}
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth={12}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.78 0.22"
              />
              <polygon points={ARROW} fill={COLORS.cyan} />
            </g>
          </g>
          <text
            x={RING_CX}
            y={RING_CY + 16 + Math.sin(frame / 12) * 3}
            textAnchor="middle"
            fontFamily={FONT}
            fontSize={48}
            fontWeight={700}
            fill={COLORS.text}
            opacity={Math.min(1, ringIn * 1.5)}
          >
            повторяю
          </text>
        </svg>

        {/* Подпись */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 1920,
            top: 880 + (1 - capIn) * 40 + Math.sin(frame / 18) * 4,
            textAlign: 'center',
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.text,
            opacity: Math.min(1, capIn * 1.5),
          }}
        >
          <span style={{color: COLORS.cyan}}>6.</span> Повторяю, пока ответ не готов
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
