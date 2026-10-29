import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {SCENES, sec} from './theme';
import {Background} from './Background';
import {Scene1} from './Scene1';
import {Scene2} from './Scene2';
import {Scene3} from './Scene3';
import {Scene4} from './Scene4';
import {Scene5} from './Scene5';
import {Scene6} from './Scene6';

// Главная склейка: сцены перекрываются на 0,5 с.
export const InfoGraphic30: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Sequence name="Сцена 1: Вопрос" from={sec(SCENES.s1.from)} durationInFrames={sec(SCENES.s1.to) - sec(SCENES.s1.from)}>
        <Scene1 />
      </Sequence>
      <Sequence name="Сцена 2: Режу на кусочки" from={sec(SCENES.s2.from)} durationInFrames={sec(SCENES.s2.to) - sec(SCENES.s2.from)}>
        <Scene2 />
      </Sequence>
      <Sequence name="Сцена 3: Ищу связи" from={sec(SCENES.s3.from)} durationInFrames={sec(SCENES.s3.to) - sec(SCENES.s3.from)}>
        <Scene3 />
      </Sequence>
      <Sequence name="Сцена 4: Выбираю слово" from={sec(SCENES.s4.from)} durationInFrames={sec(SCENES.s4.to) - sec(SCENES.s4.from)}>
        <Scene4 />
      </Sequence>
      <Sequence name="Сцена 5: Слово за словом" from={sec(SCENES.s5.from)} durationInFrames={sec(SCENES.s5.to) - sec(SCENES.s5.from)}>
        <Scene5 />
      </Sequence>
      <Sequence name="Сцена 6: Финал" from={sec(SCENES.s6.from)} durationInFrames={sec(SCENES.s6.to) - sec(SCENES.s6.from)}>
        <Scene6 />
      </Sequence>
    </AbsoluteFill>
  );
};
