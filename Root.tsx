import React from 'react';
import {Composition} from 'remotion';
import {InfoGraphic30} from './InfoGraphic30';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="InfoGraphic30"
      component={InfoGraphic30}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={900}
    />
  );
};
