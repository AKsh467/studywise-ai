import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AdaptiveWarp3DProps {
  className?: string;
  isAdapting?: boolean;
}

export const AdaptiveWarp3D: React.FC<AdaptiveWarp3DProps> = ({
  className = "w-full h-full",
  isAdapting = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isAdaptingRef = useRef(isAdapting);

  useEffect(() => {
    isAdaptingRef.current = isAdapting;
  }, [isAdapting]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Timeline Warp Rings along Z-axis in Ultramarine and Tangerine
    const ringCount = 12;
    const rings: THREE.Mesh[] = [];
    const ringGeo = new THREE.TorusGeometry(1.8, 0.035, 16, 48);

    for (let i = 0; i < ringCount; i++) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x3548D4 : 0xFF784F,
        transparent: true,
        opacity: (i + 1) / ringCount * 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = -i * 1.2;
      scene.add(ring);
      rings.push(ring);
    }

    // Floating Session Block Models being rescheduled (Tangerine -> Acid Lime / Mint)
    const blockCount = 6;
    const blocks: { mesh: THREE.Mesh; initialZ: number; speed: number; rotSpeed: number }[] = [];
    const blockGeo = new THREE.BoxGeometry(0.5, 0.3, 0.2);

    for (let i = 0; i < blockCount; i++) {
      const blockMat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0xFF784F : 0xD6EF72,
        emissive: i % 2 === 0 ? 0xD4471B : 0x8CA820,
        emissiveIntensity: 0.65,
        roughness: 0.2,
        clearcoat: 1.0
      });
      const mesh = new THREE.Mesh(blockGeo, blockMat);
      mesh.position.set(
        Math.cos(i * 1.1) * 1.1,
        Math.sin(i * 1.1) * 1.1,
        -i * 2.0
      );
      scene.add(mesh);
      blocks.push({
        mesh,
        initialZ: -i * 2.0,
        speed: 0.04 + i * 0.01,
        rotSpeed: 0.02 + i * 0.01
      });
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
    scene.add(ambientLight);

    const pLight = new THREE.PointLight(0xD6EF72, 3, 10);
    pLight.position.set(0, 0, 2);
    scene.add(pLight);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const speedMult = isAdaptingRef.current ? 3.5 : 1.0;

      // Pulse and tunnel movement for rings
      rings.forEach((ring, idx) => {
        ring.rotation.z = t * 0.2 * (idx % 2 === 0 ? 1 : -1) * speedMult;
        ring.position.z += 0.05 * speedMult;
        if (ring.position.z > 2) {
          ring.position.z = -ringCount * 1.2;
        }
      });

      // Fly-through session blocks
      blocks.forEach(block => {
        block.mesh.position.z += block.speed * speedMult;
        block.mesh.rotation.x += block.rotSpeed * speedMult;
        block.mesh.rotation.y += block.rotSpeed * 1.5 * speedMult;

        if (block.mesh.position.z > 4) {
          block.mesh.position.z = -12;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 320;
      const newHeight = container.clientHeight || 280;
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
      style={{ minHeight: '260px' }}
      title="Dynamic Adaptive Timeline Warp Tunnel"
    />
  );
};
