import { Float, Text, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

THREE.ColorManagement.enabled = true;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 12);

const floor1Material = new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0, roughness: 0 });
const floor2Material = new THREE.MeshStandardMaterial({ color: '#222222', metalness: 0, roughness: 0 });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: '#ff0000', metalness: 0, roughness: 1 });
const wallMaterial = new THREE.MeshStandardMaterial({ color: '#887777', metalness: 0, roughness: 0 });

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <>
      <group position={new THREE.Vector3(...position)}>
        <Float floatIntensity={0.25} rotationIntensity={0.25}>
          <Text
            font="./bebas-neue-v9-latin-regular.woff"
            scale={0.5}
            maxWidth={0.25}
            lineHeight={0.75}
            position={[0.75, 0.65, 0]}
            rotation-y={-0.25}
            textAlign="right"
          >
            Marble Race
            <meshBasicMaterial toneMapped={false} />
          </Text>
        </Float>
        <mesh
          receiveShadow
          geometry={boxGeometry}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          material={floor1Material}
        ></mesh>
      </group>
    </>
  );
}

export function BlockGlow({ position = [0, 0, 0], cross = false }) {
  const glow = useRef<RapierRigidBody>(null);
  const color = cross ? new THREE.Color(0, 20, 40) : new THREE.Color(20, 40, 0);

  const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1));
  useFrame((state) => {
    if (!glow.current) return;

    const time = state.clock.getElapsedTime();
    if (cross) {
      const rotation = new THREE.Quaternion();
      rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
      glow.current.setNextKinematicRotation(rotation);
    } else {
      const x = Math.sin(time + speed) * 1.5;
      glow.current.setNextKinematicTranslation({
        x: position[0] + x,
        y: position[1] + 0,
        z: position[2] + 0,
      });
    }
  });
  return (
    <>
      <group position={new THREE.Vector3(...position)}>
        <mesh
          receiveShadow
          geometry={boxGeometry}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          material={floor2Material}
        ></mesh>

        <RigidBody
          ref={glow}
          name="glow"
          type="kinematicPosition"
          position={[0, 0.3, 0]}
          restitution={0.2}
          friction={0}
        >
          <mesh
            position={[0, 0.3, 0]}
            scale={[0.05, 3.5, 0.05]}
            rotation-z={Math.PI * 0.5}
            rotation-y={Math.PI * 0.5}
            geometry={cylinderGeometry}
          >
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
          {cross && (
            <mesh
              position={[0, 0.3, 0]}
              scale={[0.05, 3.5, 0.05]}
              rotation-z={Math.PI * 0.5}
              geometry={cylinderGeometry}
            >
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          )}
        </RigidBody>
        {/*  */}
      </group>
    </>
  );
}

export function BlockEnd({ position = [0, 0, 0] }) {
  const hamburger = useGLTF('./hamburger.glb');
  hamburger.scene.children.forEach((mesh) => (mesh.castShadow = true));
  return (
    <>
      <group position={new THREE.Vector3(...position)}>
        <Text font="./bebas-neue-v9-latin-regular.woff" scale={2} position={[0, 2.52, 2]}>
          FINISH
          <meshBasicMaterial toneMapped={false} />
        </Text>
        <mesh
          receiveShadow
          geometry={boxGeometry}
          position={[0, 0, 0]}
          scale={[4, 0.2, 4]}
          material={floor1Material}
        ></mesh>
        <RigidBody type="kinematicPosition" colliders="hull" position={[0, 0.25, 0]} restitution={0.2} friction={0}>
          <primitive castShadow object={hamburger.scene} scale={0.2} />
        </RigidBody>
      </group>
    </>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef<RapierRigidBody>(null);
  const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1));
  // const obstacleBox = useRef();

  useFrame((state) => {
    if (!obstacle.current) return;
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    // obstacle.current.addForce([0, Math.sin(time) * 10, 0], false);
    obstacle.current.setNextKinematicRotation(rotation);

    // obstacleBox.current.position.y = Math.sin(time) * 0.2
  });

  return (
    <>
      <group position={new THREE.Vector3(...position)}>
        <mesh
          receiveShadow
          geometry={boxGeometry}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          material={floor2Material}
        />
        <RigidBody ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
          <mesh
            // ref={obstacleBox}
            castShadow
            receiveShadow
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[3.5, 0.3, 0.3]}
          />
        </RigidBody>
      </group>
    </>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = useRef<RapierRigidBody>(null);
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  // const obstacleBox = useRef();

  useFrame((state) => {
    if (!obstacle.current) return;
    const time = state.clock.getElapsedTime();

    // const rotation = new THREE.Quaternion();
    // rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    // obstacle.current.addForce([0, Math.sin(time) * 10, 0], false);
    const y = Math.sin(time + timeOffset) + 1.15;
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + 0,
      y: position[1] + y,
      z: position[2] + 0,
    });

    // obstacleBox.current.position.y = Math.sin(time) * 0.2
  });

  return (
    <>
      <group position={new THREE.Vector3(...position)}>
        <mesh
          receiveShadow
          geometry={boxGeometry}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          material={floor2Material}
        />
        <RigidBody ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
          <mesh
            // ref={obstacleBox}
            castShadow
            receiveShadow
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[3.5, 0.3, 0.3]}
          />
        </RigidBody>
      </group>
    </>
  );
}

export function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = useRef<RapierRigidBody>(null);
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!obstacle.current) return;

    const time = state.clock.getElapsedTime();

    // const rotation = new THREE.Quaternion();
    // rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    // obstacle.current.addForce([0, Math.sin(time) * 10, 0], false);
    const x = Math.sin(time + timeOffset) * 1.25;
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2] + 0,
    });

    // obstacleBox.current.position.y = Math.sin(time) * 0.2
  });

  return (
    <>
      <group position={new THREE.Vector3(...position)}>
        <mesh
          receiveShadow
          geometry={boxGeometry}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          material={floor2Material}
        />
        <RigidBody ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
          <mesh
            // ref={obstacleBox}
            castShadow
            receiveShadow
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[1.5, 1.5, 0.3]}
          />
        </RigidBody>
      </group>
    </>
  );
}

function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          castShadow
          position={[2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
        />

        <mesh
          receiveShadow
          position={[-2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
        />

        <mesh
          receiveShadow
          position={[0, 0.75, -(length * 4) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.5, 0.3]}
        />

        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
}

export function Level({ count = 5, types = [BlockSpinner, BlockLimbo, BlockAxe, BlockGlow], seed = 0 }) {
  const blocks = useMemo(() => {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      const block = types[Math.floor(Math.random() * types.length)];
      blocks.push(block);
    }
    return blocks;
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, idx) => {
        const evenNum = idx % 2 === 0 && Block === BlockGlow;
        return <Block key={idx} position={[0, 0, -(idx + 1) * 4]} cross={evenNum} />;
      })}
      <Bounds length={count + 2} />
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
    </>
  );
}
