import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface RopeMeshProps {
  ropePosition: number; // -1 to 1
  isPulling: boolean;
}

export const RopeMesh: React.FC<RopeMeshProps> = ({ ropePosition, isPulling }) => {
  const ropeMeshRef = useRef<THREE.Mesh>(null);
  const knotGroupRef = useRef<THREE.Group>(null);
  const ribbonRef = useRef<THREE.Mesh>(null);

  const currentKnotX = useRef(0);
  const MAX_TRAVEL = 1.8;

  // CatmullRom spline curve points matching the reference image's continuous rope path:
  // Starts on the ground on the left, passes through Kid 1 and Kid 2 hands,
  // runs straight across center with knot, passes through Kid 3 and Kid 4 hands,
  // and curves down to the ground on the right!
  const curvePoints = useMemo(() => {
    return [
      new THREE.Vector3(-3.6, 0.05, 0.1),    // Left rope tail on floor
      new THREE.Vector3(-3.1, 0.18, 0.08),   // Rising from floor
      new THREE.Vector3(-2.4, 0.44, 0.05),   // Left Anchor Girl hands
      new THREE.Vector3(-1.2, 0.49, 0.02),   // Left Front Boy hands
      new THREE.Vector3(-0.6, 0.485, 0.01),
      new THREE.Vector3(0, 0.48, 0),         // Center knot marker
      new THREE.Vector3(0.6, 0.485, -0.01),
      new THREE.Vector3(1.2, 0.49, -0.02),   // Right Front Boy hands
      new THREE.Vector3(2.4, 0.44, -0.05),   // Right Anchor Girl hands
      new THREE.Vector3(3.1, 0.18, -0.08),   // Dropping to floor
      new THREE.Vector3(3.6, 0.05, -0.1),    // Right rope tail on floor
    ];
  }, []);

  useFrame((state, delta) => {
    const targetX = ropePosition * MAX_TRAVEL;
    currentKnotX.current = THREE.MathUtils.damp(currentKnotX.current, targetX, 8, delta);

    const knotX = currentKnotX.current;
    const time = state.clock.getElapsedTime();

    // High tension vibration when pulling
    const tensionJitter = isPulling
      ? Math.sin(time * 35) * 0.008
      : Math.sin(time * 3.5) * 0.015;

    const t1Shift = ropePosition * 0.32;
    const t2Shift = ropePosition * 0.32;

    // Update curve control points to follow kids and knot
    curvePoints[0].set(-3.6 + t1Shift, 0.05, 0.1);
    curvePoints[1].set(-3.1 + t1Shift, 0.18, 0.08);
    curvePoints[2].set(-2.4 + t1Shift, 0.44 - tensionJitter, 0.05);
    curvePoints[3].set(-1.2 + t1Shift, 0.49 - tensionJitter, 0.02);
    curvePoints[4].set(-0.6 + knotX * 0.5, 0.485 - tensionJitter, 0.01);
    curvePoints[5].set(knotX, 0.48 - tensionJitter, 0); // Center Knot
    curvePoints[6].set(0.6 + knotX * 0.5, 0.485 - tensionJitter, -0.01);
    curvePoints[7].set(1.2 + t2Shift, 0.49 - tensionJitter, -0.02);
    curvePoints[8].set(2.4 + t2Shift, 0.44 - tensionJitter, -0.05);
    curvePoints[9].set(3.1 + t2Shift, 0.18, -0.08);
    curvePoints[10].set(3.6 + t2Shift, 0.05, -0.1);

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    if (ropeMeshRef.current) {
      ropeMeshRef.current.geometry.dispose();
      ropeMeshRef.current.geometry = new THREE.TubeGeometry(curve, 72, 0.048, 8, false);
    }

    if (knotGroupRef.current) {
      knotGroupRef.current.position.set(knotX, 0.48 - tensionJitter, 0);
    }

    if (ribbonRef.current) {
      ribbonRef.current.rotation.z = Math.sin(time * 6) * 0.18 + ropePosition * 0.15;
    }
  });

  // Natural golden fibrous hemp rope texture
  const ropeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D49B5B', // Warm natural twisted rope
        roughness: 0.9,
        metalness: 0.05,
      }),
    []
  );

  return (
    <group>
      {/* 3D Continuous Rope */}
      <mesh ref={ropeMeshRef} castShadow receiveShadow material={ropeMaterial}>
        <tubeGeometry
          args={[new THREE.CatmullRomCurve3(curvePoints), 72, 0.048, 8, false]}
        />
      </mesh>

      {/* Center Golden Ring & Ribbon */}
      <group ref={knotGroupRef} position={[0, 0.48, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.082, 0.028, 8, 20]} />
          <meshStandardMaterial
            color="#F59E0B"
            metalness={0.85}
            roughness={0.2}
            emissive="#B45309"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Marker Ribbon */}
        <mesh ref={ribbonRef} position={[0, -0.2, 0]} castShadow>
          <planeGeometry args={[0.13, 0.32]} />
          <meshStandardMaterial
            color="#EF4444"
            side={THREE.DoubleSide}
            roughness={0.4}
          />
        </mesh>

        {/* Pointer Pin */}
        <mesh position={[0, 0.26, 0]}>
          <coneGeometry args={[0.07, 0.16, 8]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#FBBF24"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
};
