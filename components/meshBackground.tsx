'use client';
import { FC } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

const MeshBackground: FC = () => {
  return (
    <ShaderGradientCanvas
        style={{
          width: '100%',
          height: '100%',
        }}
        lazyLoad={undefined}
        
        fov={undefined}
        pixelDensity={1}
        pointerEvents="none"
    >
      <ShaderGradient
        animate="on"
        type="waterPlane"
        wireframe={false}
        shader="positionMix"
        uTime={12.7}
        uSpeed={0.16}
        uStrength={1.8}
        uDensity={1.7}
        uFrequency={0.2}
        uAmplitude={0.1}
        positionX={0.2}
        positionY={0}
        positionZ={-0.3}
        rotationX={2}
        rotationY={21}
        rotationZ={0}
        color1="#040927"
        color2="#c22938"
        color3="#e16f23"
        reflection={0.22}

        // View (camera) props
        cAzimuthAngle={199}
        cPolarAngle={90}
        cDistance={2.5}
        cameraZoom={7}

        // Effect props
        lightType="3d"
        brightness={0}
        envPreset="lobby"
        grain="on"

        // Tool props
        toggleAxis={false}
        zoomOut={false}
        hoverState=""

        // Optional - if using transition features
        enableTransition={false}
      />
    </ShaderGradientCanvas>
  );
};

export default MeshBackground;