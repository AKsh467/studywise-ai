import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ProgressHologram3DProps {
  completionRate?: number; // 0 to 100
  className?: string;
}

export const ProgressHologram3D: React.FC<ProgressHologram3DProps> = ({
  completionRate = 45,
  className = "w-full h-full"
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rateRef = useRef(completionRate);

  useEffect(() => {
    rateRef.current = completionRate;
  }, [completionRate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 6.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Tier 1: Outer Holographic Torus (Ultramarine with Prismatic Sheen)
    const arcLength = (rateRef.current / 100) * Math.PI * 2;
    const outerGeo = new THREE.TorusGeometry(2.2, 0.085, 16, 64, Math.max(0.1, arcLength));
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x3548D4,
      emissive: 0x24152F,
      emissiveIntensity: 0.7,
      roughness: 0.15,
      metalness: 0.75,
      clearcoat: 1.0
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    outerMesh.rotation.x = Math.PI / 2;
    masterGroup.add(outerMesh);

    // Outer Background Track Ring (Alabaster / Silver track)
    const trackGeo = new THREE.TorusGeometry(2.2, 0.03, 16, 64);
    const trackMat = new THREE.MeshBasicMaterial({
      color: 0xD9D5E8,
      transparent: true,
      opacity: 0.4
    });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.rotation.x = Math.PI / 2;
    masterGroup.add(trackMesh);

    // Tier 2: Middle Ring (Acid Lime Velocity Arc)
    const midGeo = new THREE.TorusGeometry(1.6, 0.065, 16, 64, Math.PI * 1.5);
    const midMat = new THREE.MeshPhysicalMaterial({
      color: 0xD6EF72,
      emissive: 0x8CA820,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.65,
      clearcoat: 1.0
    });
    const midMesh = new THREE.Mesh(midGeo, midMat);
    midMesh.rotation.x = Math.PI / 2;
    masterGroup.add(midMesh);

    // Tier 3: Inner Disc (Tangerine Milestone Core)
    const innerGeo = new THREE.TorusGeometry(1.0, 0.05, 16, 64, Math.PI * 1.2);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0xFF784F,
      emissive: 0xD4471B,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.rotation.x = Math.PI / 2;
    masterGroup.add(innerMesh);

    // Central Floating Monolith / Prism
    const centerGeo = new THREE.OctahedronGeometry(0.55, 0);
    const centerMat = new THREE.MeshPhysicalMaterial({
      color: 0x9DE2CB,
      emissive: 0x3548D4,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.3,
      clearcoat: 1.0,
      transmission: 0.3,
      transparent: true,
      opacity: 0.95
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    masterGroup.add(centerMesh);

    // Floating Stardust Particles
    const pGeo = new THREE.BufferGeometry();
    const pCount = 60;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 5;
      pPos[i + 1] = (Math.random() - 0.5) * 3;
      pPos[i + 2] = (Math.random() - 0.5) * 5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xD6EF72, size: 0.05, transparent: true, opacity: 0.8 });
    const pPoints = new THREE.Points(pGeo, pMat);
    masterGroup.add(pPoints);

    // Lights
    const ambLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 2.5);
    dirLight.position.set(2, 6, 4);
    scene.add(dirLight);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Dynamic Arc adjustment
      const currentTargetArc = (rateRef.current / 100) * Math.PI * 2;
      outerGeo.dispose();
      outerMesh.geometry = new THREE.TorusGeometry(2.2, 0.085, 16, 64, Math.max(0.1, currentTargetArc));

      // Asymmetric rotations
      outerMesh.rotation.z = t * 0.2;
      midMesh.rotation.z = -t * 0.35;
      innerMesh.rotation.z = t * 0.5;

      centerMesh.rotation.y = t * 0.8;
      centerMesh.rotation.x = t * 0.5;
      centerMesh.position.y = Math.sin(t * 2) * 0.12;

      masterGroup.rotation.y = Math.sin(t * 0.4) * 0.25;

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
      title="3D Telemetry Radar & Syllabus Arc"
    />
  );
};
