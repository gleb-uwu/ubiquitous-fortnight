import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT, pop, rand, sceneFrames} from './theme';
import {SceneShell} from './SceneShell';

const CX = 960;
const CY = 470;
const CHIP_WORDS = ['Как', 'рабо', 'тает', 'ИИ', 'токен', 'слово', 'слой', '38%', 'число', 'связь', 'ответ', '?'];
const CHIPS = 26;
const LINE1 = ['Я', '—', 'Claude,'];
const LINE2 = ['ИИ', 'от', 'Anthropic'];

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const total = sceneFrames('s6');

  // Шар: появляется, пульсирует при поглощении, затем становится ореолом за текстом
  const orbIn = pop(frame, 6, 12, 110);
  const absorb = frame > 20 && frame < 58 ? 0.07 * Math.sin(frame * 0.9) : 0;
  const halo = interpolate(frame, [50, 76], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const orbScale = Math.max(0, (0.15 + 0.85 * orbIn) * (1 + 1.9 * halo) + absorb + Math.sin(frame / 14) * 0.03);
  const coreOpacity = interpolate(frame, [46, 66], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const noteIn = pop(frame, 88, 12, 130);

  // Финальное затухание в чёрный: последние 15 кадров
  const fadeOut = interpolate(frame, [total - 15, total], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneShell durationInFrames={total} exit={false}>
      <AbsoluteFill style={{fontFamily: FONT}}>
        {/* Кольца вокруг шара */}
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <linearGradient id="orbRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.violet} />
              <stop offset="100%" stopColor={COLORS.cyan} />
            </linearGradient>
          </defs>
          <g
            opacity={Math.min(1, orbIn * 1.4) * (0.9 - 0.45 * halo)}
            style={{filter: `drop-shadow(0 0 14px ${COLORS.violet})`}}
          >
            <ellipse
              cx={CX}
              cy={CY}
              rx={190 * (0.4 + 0.6 * orbIn) + 220 * halo}
              ry={70 * (0.4 + 0.6 * orbIn) + 80 * halo}
              fill="none"
              stroke="url(#orbRing)"
              strokeWidth={4}
              transform={`rotate(${frame * 2.2} ${CX} ${CY})`}
            />
            <ellipse
              cx={CX}
              cy={CY}
              rx={160 * (0.4 + 0.6 * orbIn) + 200 * halo}
              ry={60 * (0.4 + 0.6 * orbIn) + 70 * halo}
              fill="none"
              stroke="url(#orbRing)"
              strokeWidth={3}
              transform={`rotate(${-frame * 3 + 60} ${CX} ${CY})`}
            />
          </g>
        </svg>

        {/* Светящийся шар */}
        <div
          style={{
            position: 'absolute',
            left: CX - 130,
            top: CY - 130,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: `radial-gradient(circle at 38% 35%, #E9D5FF, ${COLORS.violet} 42%, ${COLORS.cyan} 100%)`,
            boxShadow: `0 0 90px 30px ${COLORS.violet}88, 0 0 200px 70px ${COLORS.cyan}44`,
            scale: String(orbScale),
            opacity: 1 - 0.62 * halo,
          }}
        />
        {/* Оранжевое ядро — итог */}
        <div
          style={{
            position: 'absolute',
            left: CX - 55,
            top: CY - 55,
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: `radial-gradient(circle, #FFEDD5, ${COLORS.orange} 60%, ${COLORS.orange}00 100%)`,
            boxShadow: `0 0 60px 20px ${COLORS.orange}aa`,
            scale: String(orbScale * (1 + 0.1 * Math.sin(frame / 6))),
            opacity: coreOpacity * Math.min(1, orbIn),
          }}
        />

        {/* Всё засасывается в шар */}
        {Array.from({length: CHIPS}).map((_, i) => {
          const r0 = 420 + rand(i + 3) * 520;
          const a0 = rand(i + 33) * Math.PI * 2;
          const start = 4 + i * 1.4;
          const q = interpolate(frame, [start, start + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.6, 0, 0.9, 0.5),
          });
          const r = r0 * (1 - q);
          const a = a0 + 2.4 * q;
          const idle = (1 - q) * 12;
          const x = CX + r * Math.cos(a) * 1.35 + Math.sin(frame / 10 + i) * idle;
          const y = CY + r * Math.sin(a) * 0.8 + Math.cos(frame / 12 + i) * idle;
          const word = CHIP_WORDS[i % CHIP_WORDS.length];
          const color = word === 'ИИ' ? COLORS.orange : i % 2 === 0 ? COLORS.violet : COLORS.cyan;
          const enter = pop(frame, i * 0.5, 12, 130);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - 70,
                top: y - 30,
                width: 140,
                height: 60,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 18,
                border: `2px solid ${color}`,
                background: `linear-gradient(135deg, ${color}44, rgba(20,20,40,0.85))`,
                boxShadow: `0 0 20px ${color}88`,
                fontSize: 36,
                fontWeight: 700,
                color: COLORS.text,
                opacity: Math.min(1, enter * 1.5) * (1 - Math.max(0, (q - 0.8) / 0.2)),
                scale: String((1 - 0.85 * q) * (0.6 + 0.4 * enter)),
                rotate: `${q * 260}deg`,
              }}
            >
              {word}
            </div>
          );
        })}

        {/* Из шара вырастает итоговая фраза */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 1920,
            top: CY - 150,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            translate: `0px ${Math.sin(frame / 20) * 6}px`,
          }}
        >
          {[LINE1, LINE2].map((line, li) => (
            <div key={li} style={{display: 'flex', gap: li === 0 ? 34 : 26}}>
              {line.map((w, wi) => {
                const idx = li * 3 + wi;
                const p = pop(frame, 54 + idx * 5, 11, 120);
                const isMain = w === 'Claude,';
                return (
                  <span
                    key={wi}
                    style={{
                      display: 'inline-block',
                      fontSize: li === 0 ? 150 : 104,
                      fontWeight: 800,
                      lineHeight: 1.1,
                      color: isMain ? COLORS.orange : COLORS.text,
                      textShadow: isMain
                        ? `0 0 40px ${COLORS.orange}, 0 0 14px ${COLORS.orange}88`
                        : `0 0 30px ${COLORS.violet}`,
                      opacity: Math.min(1, p * 1.6),
                      scale: String(0.1 + 0.9 * p),
                      translate: `0px ${(1 - p) * 130}px`,
                    }}
                  >
                    {w}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {/* Мелкая пометка */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 1920,
            top: 830 + (1 - noteIn) * 30 + Math.sin(frame / 16) * 3,
            textAlign: 'center',
            fontSize: 44,
            fontWeight: 500,
            color: COLORS.dim,
            opacity: Math.min(1, noteIn * 1.5),
          }}
        >
          Упрощённая схема
        </div>

        {/* Затухание в чёрный (последние 15 кадров) */}
        <AbsoluteFill style={{backgroundColor: '#000', opacity: fadeOut}} />
      </AbsoluteFill>
    </SceneShell>
  );
};
