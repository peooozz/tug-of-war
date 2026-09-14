import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { TeamId, AnimationState } from '../../store/gameStore';

export type KidRole = 'left-anchor' | 'left-front' | 'right-front' | 'right-anchor';

interface KidFigureProps {
  team: TeamId;
  role: KidRole;
  basePosition: [number, number, number];
  animationState: AnimationState;
  ropePosition: number;
  isGameOver?: boolean;
  isWinner?: boolean;
}

export const KidFigure: React.FC<KidFigureProps> = ({
  team,
  role,
  basePosition,
  animationState,
  ropePosition,
  isGameOver = false,
  isWinner = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const kickLegRef = useRef<THREE.Group>(null);

  const isTeam1 = team === 'team1';

  // Skin tones matching the reference image:
  // Left Anchor: Fair skin tone
  // Left Front: Warm brown/tan skin tone
  // Right Front: Fair skin tone
  // Right Anchor: Warm deep brown skin tone
  const skinColor =
    role === 'left-anchor'
      ? '#FCD34D' // Fair warm peachy
      : role === 'left-front'
      ? '#A16207' // Rich brown
      : role === 'right-front'
      ? '#FCD34D' // Fair warm peachy
      : '#78350F'; // Deep rich brown

  // Team uniform colors (can be configured or matching image's red & white / blue & yellow)
  const teamShirtColor = isTeam1 ? '#2563EB' : '#EAB308'; // Team Blue vs Team Yellow/Gold
  const teamHeadbandColor = isTeam1 ? '#1D4ED8' : '#D97706';
  const whiteTrim = '#FFFFFF';
  const hairColor = '#18181B'; // Jet black hair

  // Direction: Team 1 faces +X (right, pulls left), Team 2 faces -X (left, pulls right)
  const facingSign = isTeam1 ? 1 : -1;

  // Base lean angles matching the image:
  // Left anchor leans low & deep back (~ -0.38)
  // Left front leans back (~ -0.30)
  // Right front leans back (+0.32)
  // Right anchor leans deep back (+0.36)
  const baseLeanAngle =
    role === 'left-anchor'
      ? -0.38
      : role === 'left-front'
      ? -0.30
      : role === 'right-front'
      ? 0.32
      : 0.36;

  useFrame((state) => {
    if (!groupRef.current || !bodyRef.current) return;

    const time = state.clock.getElapsedTime();
    const phase = time * 3.5 + (role.includes('anchor') ? 0.5 : 0);

    // Idle breathing & straining sway
    let lean = baseLeanAngle + Math.sin(phase) * 0.03;
    let bobY = Math.abs(Math.sin(phase)) * 0.02;

    if (animationState === 'pull') {
      // Powerful synchronized backward heave
      const pullBurst = Math.sin(time * 16);
      lean += (isTeam1 ? -0.25 : 0.25) + (isTeam1 ? -1 : 1) * Math.max(0, pullBurst) * 0.12;
      bobY = -0.05 + Math.abs(pullBurst) * 0.02;
    } else if (animationState === 'strain') {
      // Stumbling forward losing ground
      const jitter = (Math.random() - 0.5) * 0.04;
      lean += (isTeam1 ? 0.22 : -0.22) + jitter;
      bobY = Math.sin(time * 18) * 0.03;
    }

    if (isGameOver && isWinner) {
      // Victory celebration hop!
      bobY = Math.abs(Math.sin(time * 8)) * 0.15;
      lean = Math.sin(time * 6) * 0.1;
    }

    // Dynamic kick leg animation for Right Front Kid
    if (kickLegRef.current && role === 'right-front') {
      kickLegRef.current.rotation.x = Math.sin(time * 4) * 0.12 + 0.5;
    }

    // Horizontal shift driven by rope movement
    const displacement = ropePosition * 0.32;
    groupRef.current.position.x = basePosition[0] + displacement;
    groupRef.current.position.y = basePosition[1] + bobY;
    groupRef.current.position.z = basePosition[2];

    bodyRef.current.rotation.z = lean;

    if (headRef.current) {
      headRef.current.rotation.z = -lean * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={basePosition}>
      {/* Root Animated Body */}
      <group ref={bodyRef} position={[0, 0.45, 0]}>
        {/* Torso / Sport T-Shirt */}
        <mesh castShadow position={[0, 0.28, 0]}>
          <capsuleGeometry args={[0.22, 0.32, 8, 16]} />
          <meshStandardMaterial
            color={role === 'right-anchor' ? whiteTrim : teamShirtColor}
            roughness={0.4}
          />
        </mesh>

        {/* White Crew Neck Collar */}
        <mesh position={[0, 0.48, 0]}>
          <torusGeometry args={[0.13, 0.028, 8, 16]} />
          <meshStandardMaterial
            color={role === 'right-anchor' ? teamShirtColor : whiteTrim}
            roughness={0.3}
          />
        </mesh>

        {/* Athletic Shorts */}
        <mesh castShadow position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.24, 0.26, 0.24, 16]} />
          <meshStandardMaterial
            color={role.includes('front') ? whiteTrim : teamShirtColor}
            roughness={0.4}
          />
        </mesh>

        {/* Shorts White Side Piping Stripe */}
        <mesh position={[facingSign * 0.245, 0.04, 0]}>
          <boxGeometry args={[0.02, 0.24, 0.06]} />
          <meshStandardMaterial color={whiteTrim} />
        </mesh>

        {/* Head Group */}
        <group ref={headRef} position={[0, 0.72, 0]}>
          {/* Chubby Round Head */}
          <mesh castShadow>
            <sphereGeometry args={[0.27, 24, 24]} />
            <meshStandardMaterial color={skinColor} roughness={0.35} />
          </mesh>

          {/* Rosy Blushing Cheeks */}
          <mesh position={[facingSign * 0.23, -0.04, 0.14]} rotation={[0, 0.3 * facingSign, 0]}>
            <circleGeometry args={[0.055, 16]} />
            <meshBasicMaterial color="#FB7185" opacity={0.65} transparent />
          </mesh>
          <mesh position={[facingSign * 0.23, -0.04, -0.14]} rotation={[0, -0.3 * facingSign, 0]}>
            <circleGeometry args={[0.055, 16]} />
            <meshBasicMaterial color="#FB7185" opacity={0.65} transparent />
          </mesh>

          {/* Cartoon Eyes */}
          <group position={[facingSign * 0.24, 0.04, 0.1]}>
            <mesh>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial color="#0F172A" />
            </mesh>
            <mesh position={[facingSign * 0.015, 0.015, 0.025]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>
          <group position={[facingSign * 0.24, 0.04, -0.1]}>
            <mesh>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial color="#0F172A" />
            </mesh>
            <mesh position={[facingSign * 0.015, 0.015, -0.025]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>

          {/* Wide Open Cheering/Smiling Mouth */}
          <mesh ref={mouthRef} position={[facingSign * 0.25, -0.08, 0]} rotation={[0, 0, facingSign * 0.2]}>
            <sphereGeometry args={[0.065, 16, 16, 0, Math.PI]} />
            <meshStandardMaterial color="#881337" roughness={0.5} />
            {/* White Teeth */}
            <mesh position={[0, 0.03, 0]}>
              <boxGeometry args={[0.05, 0.018, 0.06]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            {/* Pink Tongue */}
            <mesh position={[0, -0.02, 0]}>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshBasicMaterial color="#FB7185" />
            </mesh>
          </mesh>

          {/* Athletic Striped Headband */}
          <group position={[0, 0.1, 0]}>
            <mesh>
              <torusGeometry args={[0.265, 0.04, 8, 24]} />
              <meshStandardMaterial color={teamHeadbandColor} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <torusGeometry args={[0.27, 0.012, 8, 24]} />
              <meshStandardMaterial color={whiteTrim} />
            </mesh>
          </group>

          {/* Distinct Hair Styles matching reference image */}
          {role === 'left-anchor' && (
            /* Girl with short dark hair and cute bow on headband */
            <group>
              <mesh position={[0, 0.12, 0]}>
                <sphereGeometry args={[0.28, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color={hairColor} roughness={0.4} />
              </mesh>
              {/* Headband Bow */}
              <group position={[0, 0.32, 0.08]} rotation={[0, 0, 0.3]}>
                <mesh position={[-0.05, 0, 0]} rotation={[0, 0, 0.5]}>
                  <coneGeometry args={[0.05, 0.09, 8]} />
                  <meshStandardMaterial color="#EF4444" />
                </mesh>
                <mesh position={[0.05, 0, 0]} rotation={[0, 0, -0.5]}>
                  <coneGeometry args={[0.05, 0.09, 8]} />
                  <meshStandardMaterial color="#EF4444" />
                </mesh>
                <mesh>
                  <sphereGeometry args={[0.03, 10, 10]} />
                  <meshStandardMaterial color={whiteTrim} />
                </mesh>
              </group>
            </group>
          )}

          {role === 'left-front' && (
            /* Boy with spiky/wavy chunky hair */
            <group position={[0, 0.14, 0]}>
              <mesh>
                <sphereGeometry args={[0.28, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color={hairColor} roughness={0.4} />
              </mesh>
              {/* Spiky hair tufts on top */}
              {[-0.08, 0, 0.08].map((xOff, i) => (
                <mesh key={i} position={[xOff, 0.22, 0.04 * (i - 1)]} rotation={[0.2, 0, xOff * 2]}>
                  <coneGeometry args={[0.07, 0.14, 6]} />
                  <meshStandardMaterial color={hairColor} roughness={0.4} />
                </mesh>
              ))}
            </group>
          )}

          {role === 'right-front' && (
            /* Boy with stylish combed back hair */
            <group position={[0, 0.14, 0]}>
              <mesh>
                <sphereGeometry args={[0.28, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color={hairColor} roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.18, 0]} rotation={[0.3, 0, 0]}>
                <cylinderGeometry args={[0.18, 0.22, 0.12, 12]} />
                <meshStandardMaterial color={hairColor} roughness={0.4} />
              </mesh>
            </group>
          )}

          {role === 'right-anchor' && (
            /* Girl with adorable dual high puffs/buns */
            <group position={[0, 0.14, 0]}>
              <mesh>
                <sphereGeometry args={[0.28, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color={hairColor} roughness={0.4} />
              </mesh>
              {/* Left Hair Bun */}
              <group position={[-0.12, 0.24, 0.08]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.1, 14, 14]} />
                  <meshStandardMaterial color={hairColor} roughness={0.5} />
                </mesh>
                <mesh position={[0, -0.06, 0]}>
                  <torusGeometry args={[0.06, 0.02, 6, 12]} />
                  <meshStandardMaterial color={whiteTrim} />
                </mesh>
              </group>
              {/* Right Hair Bun */}
              <group position={[0.12, 0.24, 0.08]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.1, 14, 14]} />
                  <meshStandardMaterial color={hairColor} roughness={0.5} />
                </mesh>
                <mesh position={[0, -0.06, 0]}>
                  <torusGeometry args={[0.06, 0.02, 6, 12]} />
                  <meshStandardMaterial color={whiteTrim} />
                </mesh>
              </group>
            </group>
          )}
        </group>

        {/* Arms gripping the rope tightly at waist level */}
        {/* Front Arm */}
        <mesh
          castShadow
          position={[facingSign * 0.24, 0.24, 0.16]}
          rotation={[0.3, 0, facingSign * -0.55]}
        >
          <capsuleGeometry args={[0.075, 0.32, 6, 12]} />
          <meshStandardMaterial color={teamShirtColor} roughness={0.4} />
          {/* White sleeve ring */}
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.08, 0.015, 6, 12]} />
            <meshStandardMaterial color={whiteTrim} />
          </mesh>
          {/* Chubby Hand gripping rope */}
          <mesh position={[0, -0.18, 0]}>
            <sphereGeometry args={[0.085, 10, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.4} />
          </mesh>
        </mesh>

        {/* Back Arm */}
        <mesh
          castShadow
          position={[facingSign * 0.24, 0.24, -0.16]}
          rotation={[-0.3, 0, facingSign * -0.55]}
        >
          <capsuleGeometry args={[0.075, 0.32, 6, 12]} />
          <meshStandardMaterial color={teamShirtColor} roughness={0.4} />
          {/* White sleeve ring */}
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.08, 0.015, 6, 12]} />
            <meshStandardMaterial color={whiteTrim} />
          </mesh>
          {/* Chubby Hand gripping rope */}
          <mesh position={[0, -0.18, 0]}>
            <sphereGeometry args={[0.085, 10, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.4} />
          </mesh>
        </mesh>
      </group>

      {/* Legs & Athletic Sneakers in Pulling Stance */}
      {/* Front Anchor Leg */}
      <group position={[facingSign * 0.16, 0.25, 0.12]} rotation={[0, 0, facingSign * -0.32]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.085, 0.32, 6, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.4} />
        </mesh>
        {/* White Crew Sock */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.12, 12]} />
          <meshStandardMaterial color={whiteTrim} />
        </mesh>
        {/* Detailed White Running Sneaker */}
        <group position={[facingSign * 0.04, -0.22, 0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.11, 0.13]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Sneaker Sole */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.23, 0.025, 0.14]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
          </mesh>
          {/* Red/Blue Sneaker Accent Stripe */}
          <mesh position={[0, 0.01, 0.068]}>
            <boxGeometry args={[0.12, 0.025, 0.005]} />
            <meshStandardMaterial color={teamShirtColor} />
          </mesh>
        </group>
      </group>

      {/* Back Braced Leg / Kicking Leg */}
      <group
        ref={kickLegRef}
        position={[-facingSign * 0.16, 0.25, -0.12]}
        rotation={[
          0,
          0,
          role === 'right-front' ? 0.75 : facingSign * 0.35, // Raised kicking leg for Right Front Boy
        ]}
      >
        <mesh castShadow>
          <capsuleGeometry args={[0.085, 0.32, 6, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.4} />
        </mesh>
        {/* White Crew Sock */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.12, 12]} />
          <meshStandardMaterial color={whiteTrim} />
        </mesh>
        {/* Detailed White Sneaker */}
        <group position={[-facingSign * 0.04, -0.22, -0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.11, 0.13]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.23, 0.025, 0.14]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.01, -0.068]}>
            <boxGeometry args={[0.12, 0.025, 0.005]} />
            <meshStandardMaterial color={teamShirtColor} />
          </mesh>
        </group>
      </group>

      {/* Soft Ground Contact Shadow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.22} transparent />
      </mesh>
    </group>
  );
};
