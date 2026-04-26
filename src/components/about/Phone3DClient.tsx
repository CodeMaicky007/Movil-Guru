"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, RoundedBox, Text } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

type Props = {
  progress?: number;
  staticPose?: "hero" | "vision";
};

// ─── Dimensions ───────────────────────────────────────────────────────────────
const CHASSIS_W = 1.5;
const CHASSIS_H = 3.1;
const CHASSIS_D = 0.2;
const SCREEN_W = 1.34;
const SCREEN_H = 2.84;

// Z-layer policy — large gaps (0.01+) to avoid z-fighting on distant camera
const Z_SCREEN = CHASSIS_D / 2 + 0.001;
const Z_UI_1 = 0.02; // text, shapes, relative to screen group
const Z_UI_2 = 0.04;
const Z_UI_3 = 0.06;

const FRAME_COLOR = "#1a1a1d";

// ─── Screen UI (brand) ────────────────────────────────────────────────────────
function PhoneScreen() {
  return (
    <group position={[0, 0, Z_SCREEN]}>
      {/* Screen base — matte near-black, no emissive bleed */}
      <mesh renderOrder={1}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshStandardMaterial
          color="#050507"
          roughness={0.35}
          metalness={0}
        />
      </mesh>

      {/* Dynamic island */}
      <mesh position={[0, SCREEN_H / 2 - 0.17, Z_UI_1]} renderOrder={2}>
        <planeGeometry args={[0.55, 0.18]} />
        <meshStandardMaterial color="#000" roughness={0.3} />
      </mesh>

      {/* ── MOVIL GURU. logotype ───────────────────────────── */}
      <Text
        position={[0, 0.78, Z_UI_2]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.04}
        fontWeight={900}
        material-toneMapped={false}
      >
        MOVIL
      </Text>
      <Text
        position={[0, 0.55, Z_UI_2]}
        fontSize={0.22}
        color="#CCFF00"
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.04}
        fontWeight={900}
        material-toneMapped={false}
      >
        GURU.
      </Text>
      <Text
        position={[0, 0.38, Z_UI_2]}
        fontSize={0.045}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.24}
        fillOpacity={0.55}
        material-toneMapped={false}
      >
        REPARACIÓN MÓVIL · DESDE 2021
      </Text>

      {/* ── Metric widget: 10k+ / 5 años ───────────────────── */}
      <group position={[0, 0.04, Z_UI_1]}>
        <mesh renderOrder={3}>
          <planeGeometry args={[SCREEN_W - 0.18, 0.5]} />
          <meshStandardMaterial
            color="#0038FF"
            roughness={0.4}
            metalness={0}
          />
        </mesh>
        <Text
          position={[-0.3, 0.06, Z_UI_2]}
          fontSize={0.17}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={-0.03}
          material-toneMapped={false}
        >
          10k+
        </Text>
        <Text
          position={[-0.3, -0.13, Z_UI_2]}
          fontSize={0.035}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
          fillOpacity={0.85}
          material-toneMapped={false}
        >
          REPARACIONES
        </Text>
        <mesh position={[0, 0, Z_UI_2]}>
          <planeGeometry args={[0.005, 0.35]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>
        <Text
          position={[0.3, 0.06, Z_UI_2]}
          fontSize={0.17}
          color="#CCFF00"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={-0.03}
          material-toneMapped={false}
        >
          5
        </Text>
        <Text
          position={[0.3, -0.13, Z_UI_2]}
          fontSize={0.035}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
          fillOpacity={0.85}
          material-toneMapped={false}
        >
          AÑOS
        </Text>
      </group>

      {/* ── Service chips ──────────────────────────────────── */}
      <group position={[0, -0.45, Z_UI_1]}>
        {["PANTALLAS", "BATERÍAS", "MICROSOLD."].map((label, i) => {
          const x = -0.44 + i * 0.44;
          const isAccent = i === 1;
          return (
            <group key={label} position={[x, 0, 0]}>
              <mesh renderOrder={3}>
                <planeGeometry args={[0.4, 0.16]} />
                <meshStandardMaterial
                  color={isAccent ? "#CCFF00" : "#111118"}
                  roughness={0.4}
                  metalness={0}
                />
              </mesh>
              <Text
                position={[0, 0, Z_UI_2]}
                fontSize={0.042}
                color={isAccent ? "#0A0A0A" : "#ffffff"}
                anchorX="center"
                anchorY="middle"
                fontWeight={700}
                letterSpacing={0.1}
                material-toneMapped={false}
              >
                {label}
              </Text>
            </group>
          );
        })}
      </group>

      {/* ── CTA button ─────────────────────────────────────── */}
      <group position={[0, -0.78, Z_UI_1]}>
        <mesh renderOrder={3}>
          <planeGeometry args={[SCREEN_W - 0.18, 0.24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <Text
          position={[0, 0, Z_UI_2]}
          fontSize={0.062}
          color="#0A0A0A"
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
          letterSpacing={0.18}
          material-toneMapped={false}
        >
          RESERVAR DIAGNÓSTICO
        </Text>
      </group>

      <Text
        position={[0, -1.05, Z_UI_1]}
        fontSize={0.038}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.18}
        fillOpacity={0.5}
        material-toneMapped={false}
      >
        GARANTÍA DE POR VIDA · 47 MIN DE MEDIA
      </Text>

      {/* ── Dock ───────────────────────────────────────────── */}
      <group position={[0, -SCREEN_H / 2 + 0.36, Z_UI_1]}>
        <mesh renderOrder={3}>
          <planeGeometry args={[SCREEN_W - 0.2, 0.4]} />
          <meshStandardMaterial
            color="#12121a"
            roughness={0.4}
            transparent
            opacity={0.85}
          />
        </mesh>
        {[
          { color: "#0038FF", glyph: "M" },
          { color: "#CCFF00", glyph: "" },
          { color: "#ffffff", glyph: "" },
          { color: "#FF3D00", glyph: "" },
        ].map((app, i) => (
          <group key={i} position={[-0.42 + i * 0.28, 0, Z_UI_2]}>
            <mesh renderOrder={4}>
              <planeGeometry args={[0.23, 0.23]} />
              <meshStandardMaterial
                color={app.color}
                roughness={0.4}
                metalness={0}
              />
            </mesh>
            {app.glyph && (
              <Text
                position={[0, 0, Z_UI_3]}
                fontSize={0.14}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                fontWeight={900}
                material-toneMapped={false}
              >
                {app.glyph}
              </Text>
            )}
          </group>
        ))}
      </group>

      {/* Home indicator */}
      <mesh position={[0, -SCREEN_H / 2 + 0.09, Z_UI_1]}>
        <planeGeometry args={[0.38, 0.02]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

// ─── Chassis ──────────────────────────────────────────────────────────────────
function PhoneBody() {
  return (
    <group>
      {/* Back glass */}
      <RoundedBox
        args={[CHASSIS_W - 0.02, CHASSIS_H - 0.02, CHASSIS_D * 0.82]}
        radius={0.16}
        smoothness={5}
        position={[0, 0, -0.012]}
      >
        <meshPhysicalMaterial
          color="#0a0a0c"
          metalness={0.35}
          roughness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.18}
        />
      </RoundedBox>

      {/* Titanium frame */}
      <RoundedBox
        args={[CHASSIS_W, CHASSIS_H, CHASSIS_D]}
        radius={0.18}
        smoothness={5}
      >
        <meshPhysicalMaterial
          color={FRAME_COLOR}
          metalness={0.9}
          roughness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* Side buttons */}
      <mesh position={[-CHASSIS_W / 2 - 0.005, 0.55, 0]}>
        <boxGeometry args={[0.02, 0.16, 0.07]} />
        <meshStandardMaterial color={FRAME_COLOR} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[-CHASSIS_W / 2 - 0.005, 0.3, 0]}>
        <boxGeometry args={[0.02, 0.16, 0.07]} />
        <meshStandardMaterial color={FRAME_COLOR} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[-CHASSIS_W / 2 - 0.005, 0.85, 0]}>
        <boxGeometry args={[0.02, 0.1, 0.06]} />
        <meshStandardMaterial color="#CCFF00" roughness={0.4} />
      </mesh>
      <mesh position={[CHASSIS_W / 2 + 0.005, 0.35, 0]}>
        <boxGeometry args={[0.02, 0.26, 0.07]} />
        <meshStandardMaterial color={FRAME_COLOR} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Bottom speaker + USB-C */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`sp-l-${i}`} position={[-0.48 + i * 0.032, -CHASSIS_H / 2 - 0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.03, 12]} />
          <meshStandardMaterial color="#050505" roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, -CHASSIS_H / 2 - 0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.14, 0.04, 0.06]} />
        <meshStandardMaterial color="#050505" roughness={0.6} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`sp-r-${i}`} position={[0.3 + i * 0.032, -CHASSIS_H / 2 - 0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.03, 12]} />
          <meshStandardMaterial color="#050505" roughness={0.7} />
        </mesh>
      ))}

      {/* MG. on back */}
      <Text
        position={[0, 0, -CHASSIS_D / 2 - 0.012]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.11}
        color="#24242a"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        letterSpacing={-0.02}
        material-toneMapped={false}
      >
        MG.
      </Text>
    </group>
  );
}

function PhoneGroup({ progress = 0, staticPose }: Props) {
  const group = useRef<Group>(null);

  useFrame(() => {
    if (!group.current) return;

    if (staticPose === "hero") {
      group.current.rotation.y = -0.35;
      group.current.rotation.x = 0.05;
      group.current.position.x = 0.4;
      return;
    }
    if (staticPose === "vision") {
      group.current.rotation.y = 0.3;
      group.current.rotation.x = -0.1;
      return;
    }

    const p = progress;
    const rY =
      p < 0.33
        ? (p / 0.33) * (Math.PI / 2)
        : p < 0.66
        ? Math.PI / 2 + ((p - 0.33) / 0.33) * (Math.PI / 2)
        : Math.PI;
    const x = p < 0.33 ? 1.0 - (p / 0.33) * 1.0 : 0;
    const y = p < 0.66 ? 0 : -((p - 0.66) / 0.34) * 0.1;

    group.current.rotation.y = rY;
    group.current.position.x = x;
    group.current.position.y = y;
  });

  return (
    <group ref={group}>
      <PhoneBody />
      <PhoneScreen />
    </group>
  );
}

function CameraRig({ progress = 0 }: { progress?: number }) {
  useFrame(({ camera }) => {
    const p = progress;
    // Stay farther back so phone doesn't dominate the viewport
    const z = p < 0.66 ? 7.5 : 7.5 + ((p - 0.66) / 0.34) * 2.0;
    const y = p < 0.33 ? 0 : p < 0.66 ? -((p - 0.33) / 0.33) * 0.25 : -0.25;
    camera.position.set(0, y, z);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Phone3DClient({ progress, staticPose }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7.5], fov: 28 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      frameloop="always"
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.9} />
      <directionalLight position={[-3, -2, 2]} intensity={0.25} color="#0038FF" />
      <PhoneGroup progress={progress} staticPose={staticPose} />
      {!staticPose && <CameraRig progress={progress} />}
      <Environment preset="city" />
    </Canvas>
  );
}
