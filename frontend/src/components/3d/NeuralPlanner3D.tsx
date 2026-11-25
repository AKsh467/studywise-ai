import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NeuralPlanner3DProps {
  isGenerating?: boolean;
  className?: string;
}

export const NeuralPlanner3D: React.FC<NeuralPlanner3DProps> = ({
  isGenerating = false,
  className = "w-full h-full"
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isGeneratingRef = useRef(isGenerating);

  useEffect(() => {
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Central Core Decision Node (Octahedron crystal with Ultramarine & Acid Lime)
    const centralGeo = new THREE.OctahedronGeometry(1.2, 0);
    const centralMat = new THREE.MeshPhysicalMaterial({
      color: 0x3548D4,
      emissive: 0x24152F,
      emissiveIntensity: 0.8,
      roughness: 0.12,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false
    });
    const centralMesh = new THREE.Mesh(centralGeo, centralMat);
    masterGroup.add(centralMesh);

    // Inner wireframe in luminous Acid Lime
    const innerWire = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.28, 1),
      new THREE.MeshBasicMaterial({ color: 0xD6EF72, wireframe: true, transparent: true, opacity: 0.65 })
    );
    masterGroup.add(innerWire);

    // 2. Peripheral Neural Nodes: Prismatic Atelier Palette
    const nodeCount = 14;
    const nodeMeshes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);

    const colors = [0x3548D4, 0xA66CFF, 0xD6EF72, 0xFF784F, 0x9DE2CB, 0xD9D5E8];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 2.6 + (i % 3) * 0.4;

      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      nodePositions.push(pos);

      const nodeMat = new THREE.MeshPhysicalMaterial({
        color: colors[i % colors.length],
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.85,
        roughness: 0.15,
        clearcoat: 1.0
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      masterGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    }

    // 3. Synaptic Filaments / Connections (Lines between nodes and center)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xD9D5E8,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const linesGroup = new THREE.Group();
    nodePositions.forEach(pos => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pos]);
      const line = new THREE.Line(lineGeo, lineMat);
      linesGroup.add(line);
    });
    masterGroup.add(linesGroup);

    // Inter-node secondary filaments
    const interLineMat = new THREE.LineBasicMaterial({
      color: 0xD6EF72,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const interLinesGroup = new THREE.Group();
    for (let i = 0; i < nodePositions.length; i++) {
      const nextIdx = (i + 3) % nodePositions.length;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[nextIdx]]);
      interLinesGroup.add(new THREE.Line(lineGeo, interLineMat));
    }
    masterGroup.add(interLinesGroup);

    // 4. Energy Pulses along Filaments
    const pulseCount = 8;
    const pulseGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xD6EF72, transparent: true, opacity: 0.9 });
    const pulses: { mesh: THREE.Mesh; targetIdx: number; progress: number; speed: number }[] = [];

    for (let i = 0; i < pulseCount; i++) {
      const p = new THREE.Mesh(pulseGeo, pulseMat);
      masterGroup.add(p);
      pulses.push({
        mesh: p,
        targetIdx: i % nodePositions.length,
        progress: Math.random(),
        speed: 0.015 + Math.random() * 0.02
      });
    }

    // 5. Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0x3548D4, 3, 15);
    light1.position.set(4, 4, 4);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xD6EF72, 2.5, 15);
    light2.position.set(-4, -4, 4);
    scene.add(light2);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const speedMult = isGeneratingRef.current ? 3.0 : 1.0;

      masterGroup.rotation.y = elapsedTime * 0.2 * speedMult;
      masterGroup.rotation.x = Math.sin(elapsedTime * 0.25) * 0.2;

      centralMesh.rotation.y = elapsedTime * 0.5 * speedMult;
      centralMesh.rotation.z = elapsedTime * 0.3 * speedMult;
      innerWire.rotation.y = -elapsedTime * 0.8 * speedMult;

      if (isGeneratingRef.current) {
        const pulse = 1 + Math.sin(elapsedTime * 12) * 0.15;
        centralMesh.scale.set(pulse, pulse, pulse);
        lineMat.opacity = 0.8;
      } else {
        centralMesh.scale.set(1, 1, 1);
        lineMat.opacity = 0.45;
      }

      // Animate energy pulses along filaments
      pulses.forEach(pulse => {
        pulse.progress += pulse.speed * speedMult;
        if (pulse.progress > 1) {
          pulse.progress = 0;
          pulse.targetIdx = Math.floor(Math.random() * nodePositions.length);
        }
        const targetPos = nodePositions[pulse.targetIdx];
        pulse.mesh.position.lerpVectors(new THREE.Vector3(0, 0, 0), targetPos, pulse.progress);
      });

      // Individual node oscillation
      nodeMeshes.forEach((mesh, idx) => {
        const basePos = nodePositions[idx];
        const offset = Math.sin(elapsedTime * 2 + idx) * 0.15 * speedMult;
        mesh.position.set(
          basePos.x + (basePos.x / 3) * offset,
          basePos.y + (basePos.y / 3) * offset,
          basePos.z + (basePos.z / 3) * offset
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 360;
      const newHeight = container.clientHeight || 340;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ minHeight: '320px' }}
      title="Autonomous Neural Synthesis Engine"
    />
  );
};
