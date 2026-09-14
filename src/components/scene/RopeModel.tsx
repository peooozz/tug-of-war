import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

interface RopeModelProps {
  ropePosition: number; // -1 to 1
  isPulling: boolean;
}

export const RopeModel: React.FC<RopeModelProps> = ({ ropePosition, isPulling }) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentX = useRef(0);
  const MAX_TRAVEL = 1.8;

  // Load the real 3D rope GLB asset
  const { scene } = useGLTF('/models/rope.glb');

  // Clone scene so it can be cleanly mounted
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetX = ropePosition * MAX_TRAVEL;
    currentX.current = THREE.MathUtils.damp(currentX.current, targetX, 7.5, delta);

    const time = state.clock.getElapsedTime();
    const tensionJitter = isPulling ? Math.sin(time * 35) * 0.006 : Math.sin(time * 3) * 0.003;

    groupRef.current.position.x = currentX.current;
    groupRef.current.position.y = tensionJitter;

    // Flutter the marker ribbon
    const ribbon = groupRef.current.getObjectByName('CenterMarkerRibbon');
    if (ribbon) {
      ribbon.rotation.z = Math.sin(time * 6) * 0.18 + ropePosition * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
};

useGLTF.preload('/models/rope.glb');
