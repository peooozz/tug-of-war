import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { TeamId, AnimationState } from '../../store/gameStore';

interface CharacterModelProps {
  team: TeamId;
  index: number;
  basePosition: [number, number, number];
  animationState: AnimationState;
  ropePosition: number;
  isGameOver?: boolean;
  isWinner?: boolean;
}

export const CharacterModel: React.FC<CharacterModelProps> = ({
  team,
  index,
  basePosition,
  animationState,
  ropePosition,
  isGameOver = false,
  isWinner = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const isTeam1 = team === 'team1';

  // Load the real 3D GLB model
  const { scene, animations } = useGLTF('/models/character.glb');

  // Clone scene with full skeleton hierarchy intact
  const clone = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene) as THREE.Group;

    // Team specific color palette (Electric Royal Blue vs Warm Golden Amber)
    const primaryColor = isTeam1 ? new THREE.Color('#2563EB') : new THREE.Color('#D97706');
    const accentColor = isTeam1 ? new THREE.Color('#93C5FD') : new THREE.Color('#FBBF24');
    const darkColor = new THREE.Color('#0F172A');

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const origMat = mesh.material as THREE.MeshStandardMaterial;
          const matName = origMat.name || '';

          const newMat = origMat.clone();
          if (matName.includes('Main')) {
            newMat.color = primaryColor;
            newMat.roughness = 0.28;
            newMat.metalness = 0.22;
          } else if (matName.includes('Grey')) {
            newMat.color = accentColor;
            newMat.roughness = 0.35;
          } else {
            newMat.color = darkColor;
            newMat.roughness = 0.5;
          }
          mesh.material = newMat;
        }
      }
    });

    return cloned;
  }, [scene, isTeam1]);

  const mixer = useMemo(() => new THREE.AnimationMixer(clone), [clone]);

  const actions = useMemo(() => {
    const map: Record<string, THREE.AnimationAction> = {};
    animations.forEach((clip) => {
      map[clip.name] = mixer.clipAction(clip, clone);
    });
    return map;
  }, [animations, mixer, clone]);

  // Handle animation state transitions
  useEffect(() => {
    let targetAnimName = 'Standing';

    if (isGameOver) {
      targetAnimName = isWinner ? (index % 2 === 0 ? 'Dance' : 'ThumbsUp') : 'Death';
    } else if (animationState === 'pull') {
      targetAnimName = 'Walking';
    } else if (animationState === 'strain') {
      targetAnimName = 'No';
    } else {
      targetAnimName = 'Standing';
    }

    const currentAction = actions[targetAnimName];
    if (currentAction) {
      if (animationState === 'pull') {
        // Reverse walk speed for authentic backwards tug-of-war pulling
        currentAction.timeScale = -1.4;
      } else {
        currentAction.timeScale = 1.0;
      }
      currentAction.reset().fadeIn(0.15).play();
    }

    return () => {
      if (currentAction) {
        currentAction.fadeOut(0.15);
      }
    };
  }, [animationState, isGameOver, isWinner, actions, index]);

  // Team 1 faces +X (toward right/center, pulling left)
  // Team 2 faces -X (toward left/center, pulling right)
  const rotationY = isTeam1 ? Math.PI / 2 : -Math.PI / 2;

  useFrame((state, delta) => {
    mixer.update(delta);

    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    let leanZ = 0;
    let bobY = 0;
    let struggleX = 0;

    if (isTeam1) {
      // ═══════════════════════════════════════════════════════════════════════
      // TEAM 1 (BLUE / LEFT): POWER-ANCHOR SQUAD
      // Cadence: Deliberate, heavy, synchronized deep power heaves
      // ═══════════════════════════════════════════════════════════════════════
      const cadence = time * 2.8 + index * 0.28;
      const anchorBonus = index * 0.045; // Anchor in back leans furthest back

      if (animationState === 'pull') {
        // Deep synchronized power stroke
        const heaveCycle = Math.sin(time * 9.5);
        const heavePower = Math.max(0, heaveCycle);
        leanZ = 0.44 + anchorBonus + heavePower * 0.26;
        bobY = -0.045 - index * 0.01 - heavePower * 0.025; // Sinks into deep crouch
        struggleX = -heavePower * 0.035; // Surging back
      } else if (animationState === 'strain') {
        // Digging heels stubbornly against being dragged
        leanZ = 0.18 + anchorBonus * 0.5 + Math.sin(time * 14) * 0.05;
        bobY = -0.04 + Math.sin(time * 20) * 0.015;
        struggleX = Math.sin(time * 20) * 0.02; // Shuddering resistance
      } else if (isGameOver) {
        if (isWinner) {
          leanZ = Math.sin(time * 5 + index) * 0.07;
          bobY = Math.abs(Math.sin(time * 7 + index)) * 0.06;
        } else {
          leanZ = -0.16;
          bobY = -0.07;
        }
      } else {
        // Idle tension: steady, rhythmic power breathing
        leanZ = 0.38 + anchorBonus + Math.sin(cadence) * 0.035;
        bobY = Math.sin(cadence) * 0.012;
      }
    } else {
      // ═══════════════════════════════════════════════════════════════════════
      // TEAM 2 (YELLOW / RIGHT): AGGRESSIVE BURST SQUAD
      // Cadence: Snappy, agile, rapid double-pulse bursts & quick scramble
      // ═══════════════════════════════════════════════════════════════════════
      const cadence = time * 3.8 + index * 0.42;
      const frontBonus = (2 - index) * 0.035; // Lead puller takes an aggressive low tilt

      if (animationState === 'pull') {
        // Snappy double-pulse burst heave
        const burst = Math.sin(time * 13) * 0.7 + Math.sin(time * 26) * 0.3;
        const burstPower = Math.max(0, burst);
        leanZ = -0.40 - frontBonus - burstPower * 0.28;
        bobY = -0.04 - burstPower * 0.03;
        struggleX = burstPower * 0.04;
      } else if (animationState === 'strain') {
        // Desperate forward scramble toward center
        const scramble = Math.sin(time * 28);
        leanZ = -0.07 + Math.sin(time * 18) * 0.06; // Pitching forward
        bobY = Math.abs(scramble) * 0.032; // Frantic foot hop
        struggleX = -Math.sin(time * 28) * 0.035;
      } else if (isGameOver) {
        if (isWinner) {
          leanZ = -Math.sin(time * 6 + index) * 0.08;
          bobY = Math.abs(Math.sin(time * 9 + index)) * 0.07;
        } else {
          leanZ = 0.16;
          bobY = -0.07;
        }
      } else {
        // Idle tension: energetic, asymmetrical springy rhythm
        const idlePulse = Math.sin(cadence) * 0.038 + Math.sin(cadence * 2) * 0.015;
        leanZ = -0.36 - frontBonus + idlePulse;
        bobY = Math.sin(cadence) * 0.015;
      }
    }

    // Horizontal position displacement with rope movement
    const displacement = ropePosition * 0.35;
    groupRef.current.position.x = basePosition[0] + displacement + struggleX;
    groupRef.current.position.y = basePosition[1] + bobY;
    groupRef.current.position.z = basePosition[2];

    // Dynamic athletic lean
    groupRef.current.rotation.z = leanZ;
  });

  return (
    <group ref={groupRef} position={basePosition}>
      {/* Real 3D Model Cloned Instance */}
      <primitive
        object={clone}
        scale={0.42}
        rotation={[0, rotationY, 0]}
        position={[0, 0, 0]}
      />

      {/* Ground Contact Shadow */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.24} transparent />
      </mesh>
    </group>
  );
};

useGLTF.preload('/models/character.glb');
