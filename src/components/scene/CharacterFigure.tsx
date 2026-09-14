import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { TeamId, AnimationState } from '../../store/gameStore';

interface CharacterFigureProps {
  team: TeamId;
  index: number;
  basePosition: [number, number, number];
  animationState: AnimationState;
  ropePosition: number;
  isGameOver?: boolean;
  isWinner?: boolean;
}

export const CharacterFigure: React.FC<CharacterFigureProps> = ({
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

  // Load shared 3D GLB model
  const { scene, animations } = useGLTF('/models/character.glb');

  // Clone scene with skeleton intact
  const clone = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene) as THREE.Group;

    // Team specific color palette (Electric Royal Blue vs Warm Golden Amber)
    const primaryColor = isTeam1 ? new THREE.Color('#2563EB') : new THREE.Color('#D97706');
    const accentColor = isTeam1 ? new THREE.Color('#93C5FD') : new THREE.Color('#FBBF24');
    const darkColor = new THREE.Color('#1E293B');

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
            newMat.metalness = 0.25;
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

  // Handle animation transitions based on game state
  useEffect(() => {
    let targetAnimName = 'Idle';

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
        // Reverse walk speed for backwards tug stepping
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

  // Direction: Team 1 faces +X (toward right/center, pulling left)
  // Team 2 faces -X (toward left/center, pulling right)
  const rotationY = isTeam1 ? Math.PI / 2 : -Math.PI / 2;
  // Natural anchor lean away from the rope
  const baseLean = isTeam1 ? -0.32 : 0.32;

  useFrame((state, delta) => {
    mixer.update(delta);

    if (!groupRef.current) return;

    // Direct kinematic bone positioning to hold the rope tightly!
    const armL = (clone.getObjectByName('UpperArm.L') || clone.getObjectByName('UpperArm_L')) as THREE.Bone | undefined;
    const armR = (clone.getObjectByName('UpperArm.R') || clone.getObjectByName('UpperArm_R')) as THREE.Bone | undefined;
    const lowerL = (clone.getObjectByName('LowerArm.L') || clone.getObjectByName('LowerArm_L')) as THREE.Bone | undefined;
    const lowerR = (clone.getObjectByName('LowerArm.R') || clone.getObjectByName('LowerArm_R')) as THREE.Bone | undefined;

    const time = state.clock.getElapsedTime();
    const phase = time * 3.2 + index * 0.8;

    let dynamicLean = baseLean + Math.sin(phase) * 0.03;
    let bobY = 0;
    let armPullOffset = 0;

    if (animationState === 'pull') {
      // Heave back powerfully in unified rhythm
      const pullCycle = Math.sin(time * 14);
      dynamicLean += (isTeam1 ? -0.25 : 0.25) + (isTeam1 ? -1 : 1) * Math.max(0, pullCycle) * 0.12;
      bobY = -0.05 + Math.abs(pullCycle) * 0.02;
      armPullOffset = 0.25; // Yank arms back toward torso
    } else if (animationState === 'strain') {
      // Pulled forward, stumbling and scrambling
      const jitter = (Math.random() - 0.5) * 0.05;
      dynamicLean += (isTeam1 ? 0.24 : -0.24) + jitter;
      bobY = Math.sin(time * 18) * 0.025;
      armPullOffset = -0.15; // Arms jerked forward
    }

    // Pose arms gripping the rope in front of chest
    if (armL && armR) {
      armL.rotation.x = 1.05 - armPullOffset;
      armL.rotation.y = -0.28;
      armL.rotation.z = -0.35;

      armR.rotation.x = 1.05 - armPullOffset;
      armR.rotation.y = 0.28;
      armR.rotation.z = 0.35;
    }
    if (lowerL && lowerR) {
      lowerL.rotation.x = 0.55;
      lowerR.rotation.x = 0.55;
    }

    // Horizontal shift with rope tug
    const displacement = ropePosition * 0.28;
    groupRef.current.position.x = basePosition[0] + displacement;
    groupRef.current.position.y = basePosition[1] + bobY;
    groupRef.current.position.z = basePosition[2];

    groupRef.current.rotation.z = dynamicLean;
  });

  return (
    <group ref={groupRef} position={basePosition}>
      {/* 3D Cloned Character Model */}
      <primitive
        object={clone}
        scale={0.42}
        rotation={[0, rotationY, 0]}
        position={[0, 0, 0]}
      />

      {/* Realistic Hand Rope Grip Rings / Braces (locks hands right onto the rope) */}
      <mesh position={[isTeam1 ? 0.14 : -0.14, 0.50, 0]} castShadow>
        <torusGeometry args={[0.072, 0.02, 8, 16]} />
        <meshStandardMaterial
          color={isTeam1 ? '#1D4ED8' : '#B45309'}
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* Soft Contact Shadow on Platform */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.36, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.24} transparent />
      </mesh>
    </group>
  );
};

useGLTF.preload('/models/character.glb');
