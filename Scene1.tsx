import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {COLORS, FONT, pop, sceneFrames} from './theme';
import {SceneShell} from './SceneShell';

const QUESTION = 'Как работает ИИ?';
const HEADLINE = ['30', 'секунд', 'внутри', 'ИИ'];

const ENTER_AT = 45; // кадр нажатия Enter (1,5 с)

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  // Печать вопроса
  const typed = Math.floor(
    interpolate(frame, [10, 40], [0, QUESTION.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const typing = frame < ENTER_AT;
  // Мигающий курсор (мигает пока не печатаем)
  const blinkOn = Math.floor(frame / 8) % 2 === 0;
  const cursorVisible = typing && (frame < 10 || frame >= 40 ? blinkOn : true);

  // Enter: нажатие клавиши
  const key = pop(frame, ENTER_AT - 2, 8, 220);
  const keyOpacity = interpolate(frame, [ENTER_AT - 8, ENTER_AT - 2, ENTER_AT + 10], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Вопрос после Enter: уходит вверх и тускнеет
  const after = interpolate(frame, [ENTER_AT, ENTER_AT + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const drift = Math.sin(frame / 14) * 4;

  return (
    <SceneShell durationInFrames={sceneFrames('s1')} enter={false}>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: FONT}}>
        {/* Круговая волна света от текста */}
        {[0, 7, 14].map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: '50%',
              border: `${6 - i * 1.5}px solid ${i === 1 ? COLORS.cyan : COLORS.violet}`,
              boxShadow: `0 0 50px ${i === 1 ? COLORS.cyan : COLORS.violet}, inset 0 0 50px ${
                i === 1 ? COLORS.cyan : COLORS.violet
              }`,
              scale: String(
                interpolate(frame, [ENTER_AT + d, ENTER_AT + d + 30], [0.2, 11], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.bezier(0.2, 0.7, 0.3, 1),
                }),
              ),
              opacity: interpolate(
                frame,
                [ENTER_AT + d, ENTER_AT + d + 4, ENTER_AT + d + 30],
                [0, 0.9, 0],
                {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
              ),
            }}
          />
        ))}

        {/* Вопрос с курсором */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            fontSize: 96,
            fontWeight: 700,
            color: COLORS.text,
            translate: `0px ${-after * 300 + drift}px`,
            opacity: 1 - after * 0.65,
            scale: String(
              1 - after * 0.38 + interpolate(frame, [ENTER_AT, ENTER_AT + 5, ENTER_AT + 14], [0, 0.07, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            ),
            textShadow: `0 0 30px ${COLORS.violet}`,
          }}
        >
          <span>{QUESTION.slice(0, typed)}</span>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 100,
              marginLeft: 8,
              backgroundColor: COLORS.cyan,
              boxShadow: `0 0 16px ${COLORS.cyan}`,
              opacity: cursorVisible ? 1 : 0,
            }}
          />
        </div>

        {/* Клавиша Enter */}
        <div
          style={{
            position: 'absolute',
            translate: `0px ${190}px`,
            padding: '14px 36px',
            borderRadius: 18,
            border: `2px solid ${COLORS.cyan}`,
            color: COLORS.cyan,
            fontSize: 44,
            fontWeight: 700,
            boxShadow: `0 0 28px ${COLORS.cyan}66`,
            opacity: keyOpacity,
            scale: String(0.7 + 0.3 * key),
          }}
        >
          ⏎ Enter
        </div>

        {/* Заголовок: слова вылетают на волне */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            gap: 36,
            translate: `0px ${60 + Math.sin(frame / 18) * 5}px`,
            filter: `drop-shadow(0 0 26px ${COLORS.violet}) drop-shadow(0 0 10px ${COLORS.cyan}88)`,
          }}
        >
          {HEADLINE.map((w, i) => {
            const p = pop(frame, ENTER_AT + 8 + i * 5, 10, 130);
            return (
              <span
                key={w}
                style={{
                  display: 'inline-block',
                  fontSize: 150,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  background: `linear-gradient(90deg, ${COLORS.violet}, ${COLORS.cyan})`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  opacity: Math.min(1, p * 1.6),
                  scale: String(0.2 + 0.8 * p),
                  translate: `0px ${(1 - p) * 90}px`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
