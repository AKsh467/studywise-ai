import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SubjectTotem3DProps {
  color?: string;
  className?: string;
}

export const SubjectTotem3D: React.FC<SubjectTotem3DProps> = ({
  color = "#3548D4",
  className = "w-full h-full"
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef(color);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Dynamic Material for Crystal with Opalescent Transmission
    const initialHex = parseInt(colorRef.current.replace('#', '0x'), 16) || 0x3548D4;
    const crystalGeo = new THREE.DodecahedronGeometry(1.4, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: initialHex,
      emissive: initialHex,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transmission: 0.35,
      opacity: 0.95,
      transparent: true
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    masterGroup.add(crystalMesh);

    // Wireframe Cage in Acid Lime & Silver
    const cageGeo = new THREE.DodecahedronGeometry(1.62, 0);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xD6EF72,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    masterGroup.add(cageMesh);

    // Rotating Orbit Ring (Holographic Silver / Ultramarine)
    const ringGeo = new THREE.TorusGeometry(2.15, 0.035, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xD9D5E8,
      emissive: 0x3548D4,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.85
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.5;
    masterGroup.add(ringMesh);

    // Floating satellite micro-nodes
    const microNodes: THREE.Mesh[] = [];
    const microGeo = new THREE.TetrahedronGeometry(0.14, 0);
    const microColors = [0xD6EF72, 0xFF784F, 0xA66CFF, 0x9DE2CB];
    for (let i = 0; i < 4; i++) {
      const microMat = new THREE.MeshPhysicalMaterial({
        color: microColors[i],
        emissive: microColors[i],
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const node = new THREE.Mesh(microGeo, microMat);
      masterGroup.add(node);
      microNodes.push(node);
    }

    // Lighting (Warm Editorial Highlights)
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xD6EF72, 2.0, 10);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Dynamic color responsiveness
      const currentHex = parseInt(colorRef.current.replace('#', '0x'), 16) || 0x3548D4;
      if (crystalMat.color.getHex() !== currentHex) {
        crystalMat.color.setHex(currentHex);
        crystalMat.emissive.setHex(currentHex);
      }

      crystalMesh.rotation.x = t * 0.35;
      crystalMesh.rotation.y = t * 0.45;

      cageMesh.rotation.x = -t * 0.25;
      cageMesh.rotation.y = -t * 0.35;

      ringMesh.rotation.z = t * 0.6;

      // Orbit micro-nodes
      microNodes.forEach((node, i) => {
        const angle = t * 0.8 + (i * Math.PI) / 2;
        node.position.x = Math.cos(angle) * 2.2;
        node.position.y = Math.sin(t * 1.2 + i) * 0.5;
        node.position.z = Math.sin(angle) * 2.2;
        node.rotation.x += 0.05;
        node.rotation.y += 0.05;
      });

      masterGroup.position.y = Math.sin(t * 1.5) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 300;
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
      title="Dynamic Subject Specimen Totem"
    />
  );
};
