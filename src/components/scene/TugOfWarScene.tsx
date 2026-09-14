import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from '../../store/gameStore';
import { CharacterModel } from './CharacterModel';
import { RopeModel } from './RopeModel';
import gsap from 'gsap';

// Sunlit Clean Ground Platform for Tug of War
const ArenaFloor: React.FC = () => {
  return (
    <group position={[0, -0.05, 0]}>
      {/* Platform Base */}
      <mesh receiveShadow position={[0, -0.22, 0]}>
        <boxGeometry args={[11.5, 0.44, 4.4]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Clean White Arena Floor */}
      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11.0, 4.2]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>

      {/* Center Hazard Mud Zone */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.3, 4.1]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Center White Dividing Line */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 4.1]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Team 1 Win Threshold Line (Royal Blue) */}
      <mesh position={[-2.2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, 4.1]} />
        <meshBasicMaterial color="#2563EB" />
      </mesh>

      {/* Team 2 Win Threshold Line (Warm Gold) */}
      <mesh position={[2.2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, 4.1]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>

      {/* Boundary Cones marking the 3v3 field */}
      {[-3.6, -2.2, 0, 2.2, 3.6].map((xPos) => (
        <group key={xPos}>
          <mesh position={[xPos, 0.12, 1.8]} castShadow>
            <coneGeometry args={[0.09, 0.24, 12]} />
            <meshStandardMaterial
              color={xPos === 0 ? '#94A3B8' : xPos < 0 ? '#2563EB' : '#F59E0B'}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[xPos, 0.12, -1.8]} castShadow>
            <coneGeometry args={[0.09, 0.24, 12]} />
            <meshStandardMaterial
              color={xPos === 0 ? '#94A3B8' : xPos < 0 ? '#2563EB' : '#F59E0B'}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Scene Content with R3F hooks
const SceneContent: React.FC = () => {
  const ropePos = useGameStore((s) => s.ropePosition);
  const targetRopePos = useGameStore((s) => s.targetRopePosition);
  const setRopePosition = useGameStore((s) => s.setRopePosition);
  const team1Anim = useGameStore((s) => s.team1Animation);
  const team2Anim = useGameStore((s) => s.team2Animation);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const winner = useGameStore((s) => s.winner);

  const ropePosTween = useRef({ value: ropePos });

  useEffect(() => {
    gsap.to(ropePosTween.current, {
      value: targetRopePos,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => {
        setRopePosition(ropePosTween.current.value);
      },
    });
  }, [targetRopePos, setRopePosition]);

  const isPulling = team1Anim === 'pull' || team2Anim === 'pull';
  const isGameOver = gamePhase === 'gameover';

  // 3 Squad Members per team with spacious athletic stance
  const team1Positions: [number, number, number][] = [
    [-1.35, 0, 0],   // Lead puller (agile, closest to center)
    [-2.35, 0, 0],   // Middle powerhouse (deep crouch)
    [-3.35, 0, 0],   // Anchor (heaviest lean, back pivot)
  ];

  const team2Positions: [number, number, number][] = [
    [1.35, 0, 0],    // Lead puller (aggressive, forward tilt)
    [2.35, 0, 0],    // Middle powerhouse (springy)
    [3.35, 0, 0],    // Anchor (back pivot)
  ];

  return (
    <>
      {/* Sunlit Stadium Background & Atmospheric Fog */}
      <color attach="background" args={['#F1F5F9']} />
      <fog attach="fog" args={['#F1F5F9', 11, 22]} />

      {/* Studio Lighting */}
      <ambientLight intensity={1.35} />
      <directionalLight
        position={[4, 9, 7]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
      />
      {/* Soft Blue & Amber Rim Highlights */}
      <pointLight position={[-5, 3, 2]} color="#93C5FD" intensity={1.8} distance={10} />
      <pointLight position={[5, 3, 2]} color="#FDE047" intensity={1.8} distance={10} />

      {/* Arena Platform Floor */}
      <ArenaFloor />

      {/* Real 3D Character Models: 3 vs 3 (6 total) */}
      <Suspense fallback={null}>
        {/* Team 1 (Blue) - 3 Characters */}
        {team1Positions.map((pos, idx) => (
          <CharacterModel
            key={`team1-player-${idx}`}
            team="team1"
            index={idx}
            basePosition={pos}
            animationState={team1Anim}
            ropePosition={ropePos}
            isGameOver={isGameOver}
            isWinner={winner === 'team1'}
          />
        ))}

        {/* Team 2 (Yellow) - 3 Characters */}
        {team2Positions.map((pos, idx) => (
          <CharacterModel
            key={`team2-player-${idx}`}
            team="team2"
            index={idx}
            basePosition={pos}
            animationState={team2Anim}
            ropePosition={ropePos}
            isGameOver={isGameOver}
            isWinner={winner === 'team2'}
          />
        ))}

        {/* Real 3D Rope Model spanning through all 6 players */}
        <RopeModel ropePosition={ropePos} isPulling={isPulling} />
      </Suspense>
    </>
  );
};

export const TugOfWarScene: React.FC = () => {
  return (
    <div className="w-full h-full relative select-none rounded-3xl overflow-hidden glass-white shadow-xl shadow-slate-200/50">
      <Canvas
        shadows
        camera={{ position: [0, 1.15, 7.3], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};
