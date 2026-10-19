import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Web Audio API: Authentic Airline Two-Tone Chime ("Ding-Dong")
───────────────────────────────────────────────────────────── */
function playCabinChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // High note (Ding)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.22, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 1.2);

    // Low note (Dong)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(440.00, ctx.currentTime + 0.45); // A4
    gain2.gain.setValueAtTime(0.001, ctx.currentTime);
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.45);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.45);
    osc2.stop(ctx.currentTime + 1.8);
  } catch (err) {
    console.warn("Audio chime error:", err);
  }
}

/* ─────────────────────────────────────────────────────────────
   Seat Model Component (Facing Forward towards the viewer in aisle)
───────────────────────────────────────────────────────────── */
function Seat3D({
  row,
  col,
  position,
  isVip,
  selected,
  hovered,
  onHover,
  onUnhover,
  onClick
}) {
  const seatName = `${row}${col}`;

  // Indigo Airline colors: Deep navy blue with sleek trims
  const seatColor = isVip
    ? (selected ? '#0052cc' : hovered ? '#00d4ff' : '#0a2a6e')
    : (hovered ? '#3b82f6' : '#0f265c');

  const headrestCoverColor = isVip ? '#ffe97a' : '#f1f5f9';

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(seatName, isVip);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(seatName);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        onUnhover();
      }}
    >
      {/* Floor glow for VIP seat (zero z-fighting) */}
      {isVip && (
        <mesh position={[0, 0.015, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.58, 32]} />
          <meshBasicMaterial
            color="#ffe97a"
            transparent
            opacity={selected ? 0.95 : 0.65}
            side={THREE.DoubleSide}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Seat Leg / Base Pedestal */}
      <mesh position={[0, 0.2, 0.08]}>
        <cylinderGeometry args={[0.03, 0.04, 0.4, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.02, 0.08]}>
        <boxGeometry args={[0.35, 0.04, 0.35]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Seat Bottom Cushion — facing towards +Z (directly towards viewer) */}
      <mesh position={[0, 0.42, 0.14]}>
        <boxGeometry args={[0.42, 0.12, 0.44]} />
        <meshStandardMaterial
          color={seatColor}
          roughness={isVip ? 0.3 : 0.6}
          metalness={isVip ? 0.2 : 0.1}
        />
      </mesh>

      {/* Seatbelt Buckle on Cushion */}
      <mesh position={[0, 0.49, 0.16]}>
        <boxGeometry args={[0.08, 0.03, 0.04]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Backrest — situated behind the cushion (-Z) and tilted slightly back */}
      <group position={[0, 0.5, -0.1]} rotation={[0.08, 0, 0]}>
        {/* Main backrest structure */}
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.4, 0.58, 0.1]} />
          <meshStandardMaterial
            color={seatColor}
            roughness={isVip ? 0.3 : 0.6}
            metalness={isVip ? 0.2 : 0.1}
          />
        </mesh>

        {/* Antimacassar (Headrest Protective Cloth) — on front face (+Z), facing user */}
        <mesh position={[0, 0.52, 0.052]}>
          <boxGeometry args={[0.32, 0.18, 0.01]} />
          <meshStandardMaterial color={headrestCoverColor} roughness={0.9} />
        </mesh>
      </group>

      {/* Armrests on left and right */}
      <mesh position={[-0.23, 0.52, 0.12]}>
        <boxGeometry args={[0.04, 0.06, 0.36]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.23, 0.52, 0.12]}>
        <boxGeometry args={[0.04, 0.06, 0.36]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Seat Number Tag — on the front face of seat base, facing user (+Z) */}
      <Billboard position={[0, 0.36, 0.38]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.15, 0.06, 0.01]} />
          <meshStandardMaterial color="#0b1736" />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.042}
          color={isVip ? "#ffe97a" : "#94a3b8"}
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
        >
          {seatName}
        </Text>
      </Billboard>

      {/* VIP Floating Hologram Indicator — using Billboard so it is NEVER mirrored or backwards */}
      {isVip && (
        <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
          <group position={[0, 1.35, 0]}>
            <Billboard follow={true}>
              {/* Golden Star/Diamond Pin */}
              <mesh rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.1, 0.1, 0.02]} />
                <meshStandardMaterial
                  color="#ffe97a"
                  emissive="#ffe97a"
                  emissiveIntensity={0.9}
                  metalness={0.8}
                />
              </mesh>
              <Text
                position={[0, 0.18, 0]}
                fontSize={0.078}
                color="#ffe97a"
                anchorX="center"
                anchorY="bottom"
                outlineWidth={0.007}
                outlineColor="#001845"
                fontWeight={800}
              >
                ★ TRISHA ★
              </Text>
              <Text
                position={[0, -0.16, 0]}
                fontSize={0.048}
                color="#00d4ff"
                anchorX="center"
                anchorY="top"
                outlineWidth={0.005}
                outlineColor="#001845"
                fontWeight={700}
              >
                Crew Seat 1A
              </Text>
            </Billboard>
          </group>
        </Float>
      )}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   Aircraft Cabin Structure (Enclosed, Immersive Interior)
───────────────────────────────────────────────────────────── */
function AircraftCabinInterior({ cabinLength = 8.5 }) {
  const halfLen = cabinLength / 2;

  return (
    <group>
      {/* 1. Floor with dark blue aviation carpet */}
      <mesh position={[0, -0.015, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.03, cabinLength]} />
        <meshStandardMaterial color="#0c1836" roughness={0.85} />
      </mesh>

      {/* Center Aisle Runner with Glowing LED Guidance Strips */}
      <mesh position={[0, 0.006, 0]}>
        <boxGeometry args={[0.7, 0.005, cabinLength]} />
        <meshStandardMaterial color="#13244e" roughness={0.7} />
      </mesh>

      {/* Left & Right Floor Path LED emergency strips */}
      <mesh position={[-0.37, 0.01, 0]}>
        <boxGeometry args={[0.025, 0.004, cabinLength]} />
        <meshBasicMaterial color="#00e1ff" />
      </mesh>
      <mesh position={[0.37, 0.01, 0]}>
        <boxGeometry args={[0.025, 0.004, cabinLength]} />
        <meshBasicMaterial color="#00e1ff" />
      </mesh>

      {/* 2. Cabin Curved Walls (Left & Right) */}
      <mesh position={[-1.6, 1.25, 0]}>
        <boxGeometry args={[0.08, 2.5, cabinLength]} />
        <meshStandardMaterial color="#e8edf4" roughness={0.4} />
      </mesh>
      <mesh position={[1.6, 1.25, 0]}>
        <boxGeometry args={[0.08, 2.5, cabinLength]} />
        <meshStandardMaterial color="#e8edf4" roughness={0.4} />
      </mesh>

      {/* 3. Cabin Ceiling with Recessed Ambient Mood Lighting */}
      <mesh position={[0, 2.45, 0]}>
        <boxGeometry args={[3.1, 0.08, cabinLength]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>
      {/* IndiGo Signature Blue Sky Ceiling Mood Strip */}
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[1.1, 0.01, cabinLength]} />
        <meshBasicMaterial color="#0077ff" />
      </mesh>

      {/* 4. Overhead Luggage Bins */}
      <mesh position={[-1.15, 2.05, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.65, 0.42, cabinLength]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[1.15, 2.05, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.65, 0.42, cabinLength]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* 5. Front Bulkhead & Cockpit Door */}
      <group position={[0, 1.2, -halfLen]}>
        <mesh>
          <boxGeometry args={[3.2, 2.4, 0.1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Cockpit Door */}
        <mesh position={[0, -0.2, 0.06]}>
          <boxGeometry args={[0.85, 1.9, 0.04]} />
          <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Cockpit Door Handle */}
        <mesh position={[0.32, -0.2, 0.09]}>
          <boxGeometry args={[0.03, 0.16, 0.03]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Illuminated Exit Sign */}
        <mesh position={[0, 0.95, 0.07]}>
          <boxGeometry args={[0.5, 0.15, 0.02]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
        <Text
          position={[0, 0.95, 0.09]}
          fontSize={0.08}
          color="#064e3b"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          EXIT ➔
        </Text>

        {/* Welcome Crest */}
        <Text
          position={[0, 0.65, 0.07]}
          fontSize={0.065}
          color="#ffe97a"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
          letterSpacing={0.1}
        >
          ✦ 6E WELCOME ABOARD ✦
        </Text>
      </group>

      {/* 6. Rear Cabin Wall */}
      <group position={[0, 1.2, halfLen]}>
        <mesh>
          <boxGeometry args={[3.2, 2.4, 0.1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
      </group>

      {/* 7. Windows along both walls with outside starry night glow */}
      {Array.from({ length: 7 }).map((_, i) => {
        const zPos = -2.8 + i * 0.95;
        return (
          <React.Fragment key={i}>
            {/* Left Window */}
            <group position={[-1.56, 1.35, zPos]} rotation={[0, -Math.PI / 2, 0]}>
              <mesh>
                <boxGeometry args={[0.36, 0.52, 0.04]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[0.28, 0.44]} />
                <meshBasicMaterial color="#081b40" />
              </mesh>
              <mesh position={[0, -0.15, 0.001]}>
                <planeGeometry args={[0.18, 0.04]} />
                <meshBasicMaterial color="#ffe97a" transparent opacity={0.6} />
              </mesh>
            </group>

            {/* Right Window */}
            <group position={[1.56, 1.35, zPos]} rotation={[0, Math.PI / 2, 0]}>
              <mesh>
                <boxGeometry args={[0.36, 0.52, 0.04]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[0.28, 0.44]} />
                <meshBasicMaterial color="#081b40" />
              </mesh>
              <mesh position={[0, -0.15, 0.001]}>
                <planeGeometry args={[0.18, 0.04]} />
                <meshBasicMaterial color="#ffe97a" transparent opacity={0.6} />
              </mesh>
            </group>
          </React.Fragment>
        );
      })}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   Camera Controller: First-Person Walkthrough
───────────────────────────────────────────────────────────── */
function CameraRig({
  targetZ,
  isLookingAtSeat1A
}) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 1.35, 2.6));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.25, -1.0));

  useFrame((state, delta) => {
    const eyeHeight = 1.35 + Math.sin(state.clock.elapsedTime * 6) * 0.012; // Walking head-bob

    // When looking at Seat 1A:
    // Stand in aisle right in front of Row 1 so viewer looks directly into Seat 1A!
    const targetCameraPos = isLookingAtSeat1A
      ? new THREE.Vector3(0.0, eyeHeight, -1.2) // In aisle in front of Row 1
      : new THREE.Vector3(0, eyeHeight, targetZ);

    // Where to look:
    // Point directly into the cushion and front of Seat 1A:
    const targetLook = isLookingAtSeat1A
      ? new THREE.Vector3(-1.15, 0.75, -2.1) // Looking right into the open Seat 1A
      : new THREE.Vector3(0, 1.25, targetZ - 4.0); // Looking forward down the aisle towards front

    currentPos.current.lerp(targetCameraPos, delta * 3.5);
    currentLookAt.current.lerp(targetLook, delta * 4);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

/* ─────────────────────────────────────────────────────────────
   Main 3D Aircraft Cabin Component (Focused Aisle Walk & Seat Selection)
───────────────────────────────────────────────────────────── */
export default function AircraftCabin3D({
  name = "Trisha Saha",
  onSeatConfirmed,
  onStartAudio
}) {
  const [walkProgressZ, setWalkProgressZ] = useState(2.5); // Z position along the aisle (from 2.5 down to -1.8)
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [isLookingAt1A, setIsLookingAt1A] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [seatbeltFastened, setSeatbeltFastened] = useState(false);

  // 5 Rows of 3-3 seats (Rows 1 to 5)
  // Left: A (window), B (middle), C (aisle)
  // Right: D (aisle), E (middle), F (window)
  const seatsData = useMemo(() => {
    const rows = [1, 2, 3, 4, 5];
    const seats = [];

    const colX = {
      A: -1.15,
      B: -0.84,
      C: -0.53,
      D: 0.53,
      E: 0.84,
      F: 1.15,
    };

    rows.forEach((row, rowIndex) => {
      // Row 1 at -2.1, Row 5 at 1.9
      const zPos = -2.1 + rowIndex * 1.0;

      ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
        seats.push({
          row,
          col,
          seatName: `${row}${col}`,
          position: [colX[col], 0, zPos],
          isVip: row === 1 && col === 'A',
        });
      });
    });

    return seats;
  }, []);

  // Handle seat clicks
  const handleSeatClick = (seatName, isVip) => {
    setSelectedSeat(seatName);
    playCabinChime();

    if (isVip) {
      setIsLookingAt1A(true);
      setShowSeatModal(true);
    } else {
      setShowSeatModal(true);
    }
  };

  // Walk navigation controls
  const handleWalkForward = () => {
    setWalkProgressZ(prev => Math.max(-1.8, prev - 0.9));
    setIsLookingAt1A(false);
  };

  const handleWalkBackward = () => {
    setWalkProgressZ(prev => Math.min(2.8, prev + 0.9));
    setIsLookingAt1A(false);
  };

  const handleFocusSeat1A = () => {
    setWalkProgressZ(-1.2);
    setIsLookingAt1A(true);
    setSelectedSeat('1A');
    setShowSeatModal(true);
    playCabinChime();
  };

  // Keyboard navigation for walkthrough
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        handleWalkForward();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        handleWalkBackward();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When seatbelt is confirmed -> takeoff transition
  const handleConfirmSeat = () => {
    setSeatbeltFastened(true);
    playCabinChime();

    // Trigger tune immediately during this active user click event
    if (onStartAudio) {
      onStartAudio();
    }

    setTimeout(() => {
      if (onSeatConfirmed) {
        onSeatConfirmed();
      }
    }, 1800);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(ellipse at center, #0a1738 0%, #030818 100%)',
      overflow: 'hidden',
      fontFamily: "'Outfit', sans-serif",
      userSelect: 'none',
    }}>
      {/* ── 3D CANVAS (Aisle Walkthrough) ── */}
      <Canvas
        camera={{ position: [0, 1.35, 2.6], fov: 60, near: 0.02, far: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Cabin Ambient & Directional Lighting */}
        <ambientLight intensity={1.1} color="#dbeafe" />
        <directionalLight position={[0, 4, 1]} intensity={1.4} color="#ffffff" />
        <pointLight position={[0, 2.3, -2.1]} intensity={2.2} color="#00d4ff" distance={4} />
        <pointLight position={[0, 2.3, 1]} intensity={1.8} color="#ffe97a" distance={4} />
        <pointLight position={[-1.15, 1.8, -2.1]} intensity={3.5} color="#ffe97a" distance={3} />

        {/* Airplane Cabin Interior Structure */}
        <AircraftCabinInterior cabinLength={8.5} />

        {/* Passenger Seats Facing Forward */}
        {seatsData.map(seat => (
          <Seat3D
            key={seat.seatName}
            row={seat.row}
            col={seat.col}
            position={seat.position}
            isVip={seat.isVip}
            selected={selectedSeat === seat.seatName}
            hovered={hoveredSeat === seat.seatName}
            onHover={setHoveredSeat}
            onUnhover={() => setHoveredSeat(null)}
            onClick={handleSeatClick}
          />
        ))}

        {/* First-Person Camera Rig */}
        <CameraRig
          targetZ={walkProgressZ}
          isLookingAtSeat1A={isLookingAt1A}
        />
      </Canvas>

      {/* ── TOP HEADER HUD ── */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50,
        pointerEvents: 'none',
      }}>
        {/* Flight Branding Pill */}
        <div style={{
          background: 'rgba(10, 25, 60, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 212, 255, 0.4)',
          borderRadius: 40,
          padding: '8px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          pointerEvents: 'auto',
        }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#00ff88',
            boxShadow: '0 0 10px #00ff88',
            animation: 'pulse 1s infinite alternate',
          }} />
          <div>
            <div style={{ fontSize: '0.68rem', color: '#00d4ff', letterSpacing: 2, fontWeight: 700 }}>
              6E • BOARDING GATE 3D
            </div>
            <div style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: 800 }}>
              Flight A320 • Cabin Walk
            </div>
          </div>
        </div>

        {/* Quick shortcut to Seat 1A */}
        <button
          onClick={handleFocusSeat1A}
          style={{
            background: 'linear-gradient(135deg, #ffe97a, #f59e0b)',
            color: '#0f172a',
            border: 'none',
            padding: '8px 18px',
            borderRadius: 30,
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(255, 233, 122, 0.35)',
            pointerEvents: 'auto',
          }}
        >
          ⭐ Seat 1A
        </button>
      </div>

      {/* ── BOTTOM CONTROLS & AISLE NAVIGATION ── */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        zIndex: 40,
        pointerEvents: 'none',
      }}>
        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          gap: 10,
          background: 'rgba(10, 25, 60, 0.85)',
          backdropFilter: 'blur(16px)',
          padding: '8px 16px',
          borderRadius: 50,
          border: '1px solid rgba(0, 212, 255, 0.3)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          pointerEvents: 'auto',
        }}>
          <button
            onClick={handleWalkForward}
            disabled={walkProgressZ <= -1.7}
            style={{
              background: 'linear-gradient(135deg, #0052cc, #0088ff)',
              color: 'white',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 30,
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: walkProgressZ <= -1.7 ? 'not-allowed' : 'pointer',
              opacity: walkProgressZ <= -1.7 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ▲ Walk Forward (W)
          </button>

          <button
            onClick={handleWalkBackward}
            disabled={walkProgressZ >= 2.7}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '10px 18px',
              borderRadius: 30,
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: walkProgressZ >= 2.7 ? 'not-allowed' : 'pointer',
              opacity: walkProgressZ >= 2.7 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ▼ Step Back (S)
          </button>

          <button
            onClick={handleFocusSeat1A}
            style={{
              background: 'linear-gradient(135deg, #ffe97a, #f59e0b)',
              color: '#0f172a',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 30,
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 20px rgba(255, 233, 122, 0.4)',
            }}
          >
            ⭐ Find Seat 1A
          </button>
        </div>

        <div style={{
          fontSize: '0.78rem',
          color: 'rgba(180, 220, 255, 0.8)',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
        }}>
          Tip: Walk down the aisle to Row 1 or tap any seat to inspect
        </div>
      </div>

      {/* ── SEAT DETAILS MODAL ── */}
      <AnimatePresence>
        {showSeatModal && selectedSeat && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'absolute',
              bottom: 95,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 60,
              width: '90%',
              maxWidth: 420,
              background: selectedSeat === '1A'
                ? 'linear-gradient(145deg, rgba(13, 37, 95, 0.95), rgba(7, 20, 55, 0.95))'
                : 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(20px)',
              border: selectedSeat === '1A'
                ? '2px solid rgba(255, 233, 122, 0.8)'
                : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 24,
              padding: '22px 24px',
              color: 'white',
              boxShadow: selectedSeat === '1A'
                ? '0 16px 50px rgba(0, 102, 255, 0.5), 0 0 30px rgba(255, 233, 122, 0.3)'
                : '0 12px 40px rgba(0,0,0,0.6)',
              textAlign: 'center',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowSeatModal(false)}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                width: 28,
                height: 28,
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              ✕
            </button>

            {selectedSeat === '1A' ? (
              <div>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #ffe97a, #f59e0b)',
                  color: '#0f172a',
                  padding: '4px 14px',
                  borderRadius: 20,
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  marginBottom: 10,
                }}>
                  ✦ RESERVED CREW SEAT ✦
                </div>

                <h3 style={{ margin: '0 0 4px', fontSize: '1.45rem', fontWeight: 900, color: '#ffffff' }}>
                  Seat 1A — {name} ✈️
                </h3>

                <p style={{
                  margin: '0 0 16px',
                  fontSize: '0.85rem',
                  color: 'rgba(200, 230, 255, 0.9)',
                  lineHeight: 1.5,
                }}>
                  Special First-Row Cabin Station reserved in honor of your dedication, elegance, and perseverance in the skies.
                </p>

                {seatbeltFastened ? (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    style={{
                      background: 'rgba(0, 255, 136, 0.15)',
                      border: '1px solid #00ff88',
                      borderRadius: 16,
                      padding: '12px',
                      color: '#00ff88',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                    }}
                  >
                    🔔 Seatbelt Fastened! Cleared for Takeoff...
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleConfirmSeat}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #0066cc 0%, #00d4ff 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 50,
                      padding: '14px 24px',
                      fontSize: '1.02rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 8px 30px rgba(0, 168, 255, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    💺 Fasten Seatbelt & Take Off 🛫
                  </motion.button>
                )}
              </div>
            ) : (
              <div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  marginBottom: 8,
                }}>
                  PASSENGER SEAT
                </div>

                <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800 }}>
                  Seat {selectedSeat}
                </h3>

                <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#94a3b8' }}>
                  This seat is occupied by passengers on board today. Head up to Row 1 to find Trisha's special station!
                </p>

                <button
                  onClick={handleFocusSeat1A}
                  style={{
                    background: 'linear-gradient(135deg, #ffe97a, #f59e0b)',
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: 30,
                    padding: '10px 20px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ⭐ Go to Seat 1A (Front Row)
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
