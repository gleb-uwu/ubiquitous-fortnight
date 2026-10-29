import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT, pop, sceneFrames} from './theme';
import {SceneShell} from './SceneShell';

const WORDS = ['Как', 'рабо', 'тает', 'ИИ', '?'];
const COL_X = [930, 1130, 1330, 1530, 1730];
const rowY = (r: number): number => 270 + r * 120;
const PILL_X = 130;
const PILL_W = 230;
const PILL_RIGHT = PILL_X + PILL_W;

// «Сила внимания» каждой плашки: чем выше, тем толще и ярче линии
const BOOST = [0.8, 1.0, 0.7, 1.0, 0.5];
const LINK_WEIGHTS = [1.0, 0.6, 0.35];

const curve = (x1: number, y1: number, x2: number, y2: number): string => {
  const dx = (x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const draw = (start: number, len: number): number =>
    interpolate(frame, [start, start + len], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.45, 0, 0.2, 1),
    });

  // Подписи
  const cap3In = pop(frame, 10, 12, 130);
  const cap3Out = interpolate(frame, [112, 130], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cap4In = pop(frame, 126, 12, 130);

  return (
    <SceneShell durationInFrames={sceneFrames('s3')}>
      <AbsoluteFill style={{fontFamily: FONT}}>
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{position: 'absolute', left: 0, top: 0}}
        >
          <g style={{filter: `drop-shadow(0 0 8px ${COLORS.cyan}aa)`}}>
            {/* Внимание: от плашек к узлам первой колонки */}
            {WORDS.map((_, i) =>
              LINK_WEIGHTS.map((w, k) => {
                const target = (i + [0, 1, 3][k]) % 5;
                const strength = w * BOOST[i];
                const p = draw(18 + i * 6 + k * 4, 40);
                return (
                  <path
                    key={`a-${i}-${k}`}
                    d={curve(PILL_RIGHT, rowY(i) + Math.sin(frame / 24 + i) * 6, COL_X[0], rowY(target))}
                    pathLength={1}
                    fill="none"
                    stroke={(i + k) % 2 === 0 ? COLORS.violet : COLORS.cyan}
                    strokeWidth={1.5 + 7 * strength}
                    strokeLinecap="round"
                    strokeDasharray={1}
                    strokeDashoffset={1 - p}
                    opacity={0.25 + 0.7 * strength}
                  />
                );
              }),
            )}

            {/* Связи между слоями сети */}
            {COL_X.slice(0, 4).map((x, c) =>
              Array.from({length: 5}).map((_, r) =>
                [0, 2].map((shift, k) => {
                  const target = (r + shift) % 5;
                  const p = draw(60 + c * 16 + r * 2 + k * 3, 34);
                  return (
                    <path
                      key={`b-${c}-${r}-${k}`}
                      d={curve(x, rowY(r), COL_X[c + 1], rowY(target))}
                      pathLength={1}
                      fill="none"
                      stroke={(c + r) % 2 === 0 ? COLORS.violet : COLORS.cyan}
                      strokeWidth={k === 0 ? 3 : 1.5}
                      strokeLinecap="round"
                      strokeDasharray={1}
                      strokeDashoffset={1 - p}
                      opacity={k === 0 ? 0.55 : 0.28}
                    />
                  );
                }),
              ),
            )}
          </g>

          {/* Узлы: вспышки волной слева направо */}
          {COL_X.map((x, c) =>
            Array.from({length: 5}).map((_, r) => {
              const appear = pop(frame, 8 + c * 5 + r * 2, 12, 150);
              const t = frame - 70 - c * 14;
              const ph = t < 0 ? 0 : t % 78;
              const glow =
                t < 0
                  ? 0
                  : interpolate(ph, [0, 6, 34], [0, 1, 0.1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    });
              const radius = (20 + 5 * glow + Math.sin(frame / 14 + c + r) * 1.5) * Math.min(1.15, appear);
              const cy = rowY(r) + Math.sin(frame / 26 + c * 0.9 + r) * 5;
              return (
                <g key={`n-${c}-${r}`}>
                  <circle
                    cx={x}
                    cy={cy}
                    r={Math.max(0, radius + 12 * glow)}
                    fill={COLORS.cyan}
                    opacity={0.22 * glow}
                  />
                  <circle
                    cx={x}
                    cy={cy}
                    r={Math.max(0, radius)}
                    fill="#12122B"
                    stroke={COLORS.violet}
                    strokeWidth={4}
                  />
                  <circle cx={x} cy={cy} r={Math.max(0, radius - 4)} fill={COLORS.cyan} opacity={glow} />
                </g>
              );
            }),
          )}

          {/* Подписи слоёв */}
          {COL_X.map((x, c) => (
            <text
              key={`l-${c}`}
              x={x}
              y={880}
              textAnchor="middle"
              fontFamily={FONT}
              fontSize={34}
              fontWeight={500}
              fill={COLORS.dim}
              opacity={Math.min(1, pop(frame, 30 + c * 6, 12, 130))}
            >
              {`слой ${c + 1}`}
            </text>
          ))}
        </svg>

        {/* Плашки слева */}
        {WORDS.map((w, i) => {
          const color = i % 2 === 0 ? COLORS.violet : COLORS.cyan;
          const p = pop(frame, i * 4, 12, 130);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: PILL_X,
                top: rowY(i) - 42 + Math.sin(frame / 24 + i) * 6,
                width: PILL_W,
                height: 84,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 26,
                border: `3px solid ${color}`,
                background: `linear-gradient(135deg, ${color}44, rgba(20,20,40,0.85))`,
                boxShadow: `0 0 30px ${color}88`,
                fontSize: 52,
                fontWeight: 800,
                color: COLORS.text,
                opacity: Math.min(1, p * 1.5),
                scale: String(0.6 + 0.4 * p),
                translate: `${(1 - p) * -140}px 0px`,
              }}
            >
              {w}
            </div>
          );
        })}

        {/* Подписи сверху */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 1920,
            top: 100 + (1 - cap3In) * 40 - cap3Out * 30,
            textAlign: 'center',
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.text,
            opacity: Math.min(1, cap3In * 1.5) * (1 - cap3Out),
          }}
        >
          <span style={{color: COLORS.cyan}}>3.</span> Смотрю, какие слова связаны
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 1920,
            top: 100 + (1 - cap4In) * 40 + Math.sin(frame / 18) * 5,
            textAlign: 'center',
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.text,
            opacity: Math.min(1, cap4In * 1.5),
          }}
        >
          <span style={{color: COLORS.violet}}>4.</span> Смысл проходит через слои сети
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
