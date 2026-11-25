import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DCoreProps {
  className?: string;
}

export const Hero3DCore: React.FC<Hero3DCoreProps> = ({ className = "w-full h-full" }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for mouse parallax
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Central Core Sphere: Crystalline Icosahedron (Ultramarine & Electric Orchid Sheen)
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x3548D4,
      emissive: 0x24152F,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.4,
      opacity: 0.95,
      transparent: true,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Inner wireframe lattice (Acid Lime Glow)
    const wireGeo = new THREE.IcosahedronGeometry(1.64, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xD6EF72,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(wireMesh);

    // 2. Concentric Gyro Rings (Holographic Silver, Ultramarine, and Tangerine)
    const ringGeo1 = new THREE.TorusGeometry(2.35, 0.035, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xD9D5E8,
      emissive: 0xA66CFF,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.85,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    masterGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(2.75, 0.025, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x9DE2CB,
      emissive: 0x3548D4,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.8,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    masterGroup.add(ringMesh2);

    const ringGeo3 = new THREE.TorusGeometry(3.15, 0.02, 16, 100);
    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0xFF784F,
      emissive: 0xD4471B,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9,
    });
    const ringMesh3 = new THREE.Mesh(ringGeo3, ringMat3);
    ringMesh3.rotation.z = Math.PI / 6;
    masterGroup.add(ringMesh3);

    // 3. Floating Orbital Celestial Prisms
    const satellitesGroup = new THREE.Group();
    const satGeo = new THREE.OctahedronGeometry(0.18, 0);
    const satColors = [0xD6EF72, 0xA66CFF, 0xFF784F, 0x9DE2CB, 0xD9D5E8];

    const satellites: { mesh: THREE.Mesh; angle: number; speed: number; radius: number; yOffset: number }[] = [];

    for (let i = 0; i < 5; i++) {
      const satMat = new THREE.MeshStandardMaterial({
        color: satColors[i],
        emissive: satColors[i],
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.7,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satellitesGroup.add(satMesh);
      satellites.push({
        mesh: satMesh,
        angle: (i * (Math.PI * 2)) / 5,
        speed: 0.012 + i * 0.003,
        radius: 2.1 + (i % 3) * 0.4,
        yOffset: ((i - 2) * 0.45),
      });
    }
    masterGroup.add(satellitesGroup);

    // 4. Starlight / Dust Particles (Acid Lime and Holographic Silver)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 10;
      particlePos[i + 1] = (Math.random() - 0.5) * 10;
      particlePos[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xD6EF72,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x3548D4, 3, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFF784F, 2.5, 20);
    pointLight2.position.set(-5, -3, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xD6EF72, 2.2, 15);
    pointLight3.position.set(0, 4, -4);
    scene.add(pointLight3);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.4;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Parallax smooth interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      masterGroup.rotation.y = mouseX + elapsedTime * 0.15;
      masterGroup.rotation.x = -mouseY + Math.sin(elapsedTime * 0.3) * 0.08;

      // Internal lattice pulse & rotation
      coreMesh.rotation.y = elapsedTime * 0.25;
      coreMesh.rotation.z = elapsedTime * 0.15;

      wireMesh.rotation.y = -elapsedTime * 0.35;
      wireMesh.rotation.x = elapsedTime * 0.2;
      const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
      wireMesh.scale.set(pulse, pulse, pulse);

      // Rings spin with distinct phase velocities
      ringMesh1.rotation.z = elapsedTime * 0.4;
      ringMesh1.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.5) * 0.15;

      ringMesh2.rotation.z = -elapsedTime * 0.3;
      ringMesh2.rotation.y = Math.PI / 4 + Math.cos(elapsedTime * 0.6) * 0.15;

      ringMesh3.rotation.x = elapsedTime * 0.35;
      ringMesh3.rotation.z = Math.PI / 6 + Math.sin(elapsedTime * 0.4) * 0.2;

      // Orbiting prisms
      satellites.forEach(sat => {
        sat.angle += sat.speed;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        sat.mesh.position.y = sat.yOffset + Math.sin(elapsedTime * 2 + sat.angle) * 0.25;
        sat.mesh.rotation.x += 0.03;
        sat.mesh.rotation.y += 0.04;
      });

      // Background particles drift
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 360;
      const newHeight = container.clientHeight || 360;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
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
      className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing ${className}`}
      style={{ minHeight: '340px' }}
      title="Interactive 3D Prismatic Core — Hover to articulate"
    />
  );
};
