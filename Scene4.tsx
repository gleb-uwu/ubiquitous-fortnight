import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT, pop, sceneFrames} from './theme';
import {SceneShell} from './SceneShell';

const ITEMS = [
  {word: 'ИИ', pct: 38},
  {word: 'Нейросеть', pct: 22},
  {word: 'Всё', pct: 13},
  {word: 'Коротко', pct: 9},
  {word: 'Если', pct: 6},
];

const LABEL_RIGHT = 600; // правый край подписей слов
const BAR_X = 640;
const BAR_PER_PCT = 22; // px на 1%
const ROW_TOP = 290;
const ROW_STEP = 112;
const BAR_H = 68;

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  const titleIn = pop(frame, 0, 12, 130);
  const capIn = pop(frame, 14, 12, 130);

  // Победитель: вспышка оранжевым → улетает вправо
  const flash = interpolate(frame, [92, 104], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const flyX = interpolate(frame, [124, 186], [0, 1500], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.6, 0, 0.9, 0.4),
  });
  const flyScale = interpolate(frame, [124, 140, 186], [1, 1.08, 0.9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const othersFade = interpolate(frame, [100, 120], [1, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneShell durationInFrames={sceneFrames('s4')}>
      <AbsoluteFill style={{fontFamily: FONT}}>
        {/* Заголовок диаграммы */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 1920,
            top: 100 + (1 - titleIn) * 40 + Math.sin(frame / 22) * 4,
            textAlign: 'center',
            fontSize: 84,
            fontWeight: 800,
            color: COLORS.text,
            opacity: Math.min(1, titleIn * 1.5),
            textShadow: `0 0 28px ${COLORS.violet}`,
          }}
        >
          Что дальше?{' '}
          <span style={{color: COLORS.cyan, fontWeight: 500, fontSize: 56}}>(пример)</span>
        </div>

        {/* Ось */}
        <div
          style={{
            position: 'absolute',
            left: BAR_X - 6,
            top: ROW_TOP - 20,
            width: 4,
            height: ROW_STEP * 5 - 10,
            borderRadius: 2,
            background: `linear-gradient(180deg, ${COLORS.violet}, ${COLORS.cyan})`,
            opacity: 0.6 * Math.min(1, pop(frame, 6, 14, 120)),
          }}
        />

        {/* Строки диаграммы */}
        {ITEMS.map((it, i) => {
          const isWinner = i === 0;
          const grow = pop(frame, 22 + i * 10, 13, 120);
          const shown = Math.round(it.pct * Math.min(1, Math.max(0, grow)));
          const color = i % 2 === 0 ? COLORS.violet : COLORS.cyan;
          const baseW = it.pct * BAR_PER_PCT;
          const w = Math.max(0, baseW * grow * (1 + 0.012 * Math.sin(frame / 12 + i)));
          const y = ROW_TOP + i * ROW_STEP + Math.sin(frame / 26 + i * 1.2) * 4;
          const op = isWinner ? 1 : othersFade;

          return (
            <div
              key={it.word}
              style={{
                position: 'absolute',
                left: 0,
                top: y,
                width: 1920,
                height: BAR_H,
                opacity: op * Math.min(1, grow * 1.6) * (isWinner ? interpolate(frame, [172, 190], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1),
                translate: isWinner ? `${flyX}px 0px` : '0px 0px',
                scale: isWinner ? String(flyScale) : '1',
              }}
            >
              {/* Слово */}
              <div
                style={{
                  position: 'absolute',
                  right: 1920 - LABEL_RIGHT,
                  top: 0,
                  height: BAR_H,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 56,
                  fontWeight: 700,
                  color: isWinner && flash > 0.5 ? COLORS.orange : COLORS.text,
                  textShadow: isWinner ? `0 0 ${10 + 24 * flash}px ${COLORS.orange}` : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {it.word}
              </div>

              {/* Полоса: базовая + оранжевая вспышка поверх */}
              <div
                style={{
                  position: 'absolute',
                  left: BAR_X,
                  top: 0,
                  width: w,
                  height: BAR_H,
                  borderRadius: 18,
                  background: `linear-gradient(90deg, ${color}, ${
                    i % 2 === 0 ? COLORS.cyan : COLORS.violet
                  })`,
                  boxShadow: `0 0 28px ${color}99`,
                  overflow: 'hidden',
                }}
              >
                {isWinner ? (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(90deg, ${COLORS.orange}, #FDBA74)`,
                      opacity: flash,
                      boxShadow: `0 0 ${20 + 40 * flash}px ${COLORS.orange}`,
                    }}
                  />
                ) : null}
                {/* Блик, плывущий по полосе */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: 90,
                    left: -90 + ((frame * 5 + i * 70) % (baseW + 180)),
                    background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.28), rgba(255,255,255,0))',
                  }}
                />
              </div>

              {/* Процент */}
              <div
                style={{
                  position: 'absolute',
                  left: BAR_X + w + 24,
                  top: 0,
                  height: BAR_H,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 56,
                  fontWeight: 800,
                  color: isWinner && flash > 0.5 ? COLORS.orange : COLORS.text,
                  textShadow: isWinner ? `0 0 ${10 + 20 * flash}px ${COLORS.orange}` : 'none',
                }}
              >
                {shown}%
              </div>
            </div>
          );
        })}

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
          <span style={{color: COLORS.cyan}}>5.</span> Выбираю следующее слово по вероятности
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
