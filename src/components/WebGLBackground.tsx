import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from './theme-provider';

// 테마별 색상 팔레트 정의 (다크모드에서 흰색으로 타지 않도록 채도 있는 톤 구성)
interface ColorPalette {
  primary: THREE.Color;
  secondary: THREE.Color;
  accent: THREE.Color;
  blending: THREE.Blending;
  opacity: number;
  particleSize: number;
}

const DARK_PALETTE: ColorPalette = {
  primary: new THREE.Color('#0284c7'),   // Deep Sky Blue
  secondary: new THREE.Color('#6366f1'), // Rich Indigo
  accent: new THREE.Color('#9333ea'),    // Deep Violet
  blending: THREE.AdditiveBlending,
  opacity: 0.6,
  particleSize: 0.024,
};

const LIGHT_PALETTE: ColorPalette = {
  primary: new THREE.Color('#1e40af'),   // Deep Ink Blue
  secondary: new THREE.Color('#3730a3'), // Deep Indigo
  accent: new THREE.Color('#0369a1'),    // Deep Cyan
  blending: THREE.NormalBlending,
  opacity: 0.4,
  particleSize: 0.022,
};

// 원형 소프트 글로우 텍스처 (사각형 점 아티팩트 제거)
function createCircleTexture(): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface LatentSpaceProps {
  isDark: boolean;
}

function LatentSpaceManifold({ isDark }: LatentSpaceProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // 모바일 여부에 따른 파티클 수 조정
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const gridResolution = isMobile ? 26 : 38; // 격자 크기 (모바일 약 676개, 데스크탑 약 1444개)
  const clusterCount = isMobile ? 120 : 260; // 부유 클러스터 노드 수
  const totalCount = gridResolution * gridResolution + clusterCount;

  // 원형 텍스처 생성 (메모이제이션)
  const circleTexture = useMemo(() => createCircleTexture(), []);

  // 기본 위치 및 테마 색상 초기화
  const { initialPositions, colors, uvs, isClusterNode } = useMemo(() => {
    const pos = new Float32Array(totalCount * 3);
    const col = new Float32Array(totalCount * 3);
    const uv = new Float32Array(totalCount * 2);
    const clusterFlags = new Uint8Array(totalCount);
    const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

    let idx = 0;

    // 1. 위상 매니폴드 곡면 격자 (카메라와 충분한 안전거리를 둔 깊이 배치)
    const span = 8.0;
    for (let i = 0; i < gridResolution; i++) {
      for (let j = 0; j < gridResolution; j++) {
        const u = (i / (gridResolution - 1) - 0.5) * span;
        const v = (j / (gridResolution - 1) - 0.5) * span;

        pos[idx * 3] = u;
        pos[idx * 3 + 1] = 0;
        pos[idx * 3 + 2] = v - 1.5; // Z축을 화면 뒤쪽으로 밀어 카메라 클리핑 방지

        const uVal = i / (gridResolution - 1);
        const vVal = j / (gridResolution - 1);
        uv[idx * 2] = uVal;
        uv[idx * 2 + 1] = vVal;
        clusterFlags[idx] = 0;

        // 초기 색상 즉시 주입
        const factor = (Math.sin(uVal * Math.PI * 2) + Math.cos(vVal * Math.PI * 2) + 2) / 4;
        const tempColor = new THREE.Color().copy(palette.primary).lerp(palette.secondary, factor);
        col[idx * 3] = tempColor.r;
        col[idx * 3 + 1] = tempColor.g;
        col[idx * 3 + 2] = tempColor.b;

        idx++;
      }
    }

    // 2. AI 임베딩 클러스터 노드들 (카메라 앞을 침범하지 않도록 깊이 제어)
    const clusterCenters = [
      { x: -2.0, y: 0.4, z: -2.0 },
      { x: 2.0, y: -0.3, z: -1.5 },
      { x: 0.0, y: 0.6, z: -2.5 },
    ];

    for (let c = 0; c < clusterCount; c++) {
      const center = clusterCenters[c % clusterCenters.length];
      const radius = 1.0 + Math.random() * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[idx * 3] = center.x + radius * Math.sin(phi) * Math.cos(theta);
      pos[idx * 3 + 1] = center.y + (radius * 0.6) * Math.sin(phi) * Math.sin(theta);
      pos[idx * 3 + 2] = center.z + radius * Math.cos(phi);

      const uVal = Math.random();
      uv[idx * 2] = uVal;
      uv[idx * 2 + 1] = Math.random();
      clusterFlags[idx] = 1;

      // 초기 클러스터 색상 즉시 주입
      const tempColor = new THREE.Color().copy(palette.accent).lerp(palette.primary, Math.sin(uVal * Math.PI));
      col[idx * 3] = tempColor.r;
      col[idx * 3 + 1] = tempColor.g;
      col[idx * 3 + 2] = tempColor.b;

      idx++;
    }

    return { initialPositions: pos, colors: col, uvs: uv, isClusterNode: clusterFlags };
  }, [gridResolution, clusterCount, totalCount, isDark]);

  // 테마 전환 시 색상 버퍼 갱신
  useEffect(() => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const colorAttr = geometry.getAttribute('color') as THREE.BufferAttribute;
    if (!colorAttr) return;

    const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

    for (let i = 0; i < totalCount; i++) {
      const u = uvs[i * 2];
      const v = uvs[i * 2 + 1];
      const isCluster = isClusterNode[i] === 1;

      const tempColor = new THREE.Color();
      if (isCluster) {
        tempColor.copy(palette.accent).lerp(palette.primary, Math.sin(u * Math.PI));
      } else {
        const factor = (Math.sin(u * Math.PI * 2) + Math.cos(v * Math.PI * 2) + 2) / 4;
        tempColor.copy(palette.primary).lerp(palette.secondary, factor);
      }

      colorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
    }
    colorAttr.needsUpdate = true;
  }, [isDark, totalCount, uvs, isClusterNode]);

  // 잔잔하고 안정적인 프레임 애니메이션 (아티팩트 및 튐 방지)
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    if (!posAttr) return;

    const time = state.clock.getElapsedTime();
    const gridTotal = gridResolution * gridResolution;

    // 1. 매니폴드 곡면의 완만하고 부드러운 파동
    for (let i = 0; i < gridTotal; i++) {
      const u = initialPositions[i * 3];
      const w = initialPositions[i * 3 + 2];

      const wave =
        Math.sin(u * 0.6 + time * 0.25) * Math.cos(w * 0.6 + time * 0.2) * 0.5 +
        Math.cos(Math.hypot(u, w) * 0.6 - time * 0.25) * 0.3;

      posAttr.setY(i, wave);
    }

    // 2. 부유 클러스터 데이터 포인트의 미세 호흡
    for (let i = gridTotal; i < totalCount; i++) {
      const baseY = initialPositions[i * 3 + 1];
      const phase = uvs[i * 2] * 6.28;
      posAttr.setY(i, baseY + Math.sin(time * 0.35 + phase) * 0.15);
    }

    posAttr.needsUpdate = true;

    // 3. 마우스 시선 패럴랙스 (튀지 않도록 가동 범위를 완만하게 제어)
    const targetRotX = 0.45 + state.pointer.y * 0.08;
    const targetRotY = time * 0.015 + state.pointer.x * 0.1;

    pointsRef.current.rotation.x = THREE.MathUtils.damp(
      pointsRef.current.rotation.x,
      targetRotX,
      2.0,
      delta
    );
    pointsRef.current.rotation.y = THREE.MathUtils.damp(
      pointsRef.current.rotation.y,
      targetRotY,
      2.0,
      delta
    );
  });

  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  return (
    <points ref={pointsRef} position={[0, -0.6, -1.0]}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={initialPositions}
          itemSize={3}
          args={[initialPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        key={isDark ? 'dark-mat' : 'light-mat'}
        attach="material"
        size={palette.particleSize}
        vertexColors
        map={circleTexture || undefined}
        sizeAttenuation
        transparent
        opacity={palette.opacity}
        blending={palette.blending}
        depthWrite={false}
      />
    </points>
  );
}

const WebGLBackground: React.FC = () => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  // 테마 변경 및 DOM class ('dark') 직접 감시
  useEffect(() => {
    const updateTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    };

    updateTheme();

    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [theme]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 4.5, 9.0], fov: 45, near: 0.5, far: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <LatentSpaceManifold isDark={isDark} />
      </Canvas>
    </div>
  );
};

export default WebGLBackground;

 