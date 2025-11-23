'use client';
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DataParticles() {
    const count = 2000;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const light = useRef<THREE.PointLight>(null);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // Target position (Sphere)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const radius = 10 + Math.random() * 5; // Radius of the sphere

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            // Random scatter start position
            const scatterX = (Math.random() - 0.5) * 200;
            const scatterY = (Math.random() - 0.5) * 200;
            const scatterZ = (Math.random() - 0.5) * 200;

            temp.push({
                x, y, z,
                scatterX, scatterY, scatterZ,
                speed: 0.02 + Math.random() * 0.03 // Speed of convergence
            });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!mesh.current) return;

        const time = state.clock.getElapsedTime();

        // Mouse influence
        const mouseX = (state.mouse.x * 20);
        const mouseY = (state.mouse.y * 20);

        particles.forEach((particle, i) => {
            // Calculate convergence factor (0 to 1 over time)
            // Starts at 0 (scattered), goes to 1 (formed)
            // We use a smoothstep-like curve for nice easing
            let convergence = Math.min(Math.max((time - 0.5) * 0.8, 0), 1);
            convergence = convergence * convergence * (3 - 2 * convergence); // Smoothstep

            // Current position interpolation
            const cx = THREE.MathUtils.lerp(particle.scatterX, particle.x, convergence);
            const cy = THREE.MathUtils.lerp(particle.scatterY, particle.y, convergence);
            const cz = THREE.MathUtils.lerp(particle.scatterZ, particle.z, convergence);

            // Add some noise/movement when formed
            const noise = Math.sin(time + i) * 0.5 * convergence;

            // Apply rotation based on mouse
            // We rotate the entire cloud by transforming the coordinates
            const cosX = Math.cos(mouseX * 0.05);
            const sinX = Math.sin(mouseX * 0.05);
            const cosY = Math.cos(mouseY * 0.05);
            const sinY = Math.sin(mouseY * 0.05);

            // Rotate around Y axis (horizontal mouse)
            let rx = cx * cosX - cz * sinX;
            let rz = cx * sinX + cz * cosX;

            // Rotate around X axis (vertical mouse)
            let ry = cy * cosY - rz * sinY;
            rz = cy * sinY + rz * cosY;

            dummy.position.set(
                rx + noise,
                ry + noise,
                rz
            );

            // Scale particles down as they come together for a cleaner look
            const s = 0.5 + (1 - convergence) * 2;
            dummy.scale.set(s, s, s);

            dummy.rotation.set(time * 0.2, time * 0.2, time * 0.2);
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <pointLight ref={light} distance={40} intensity={8} color="lightblue" />
            <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshPhongMaterial color="#2563eb" />
            </instancedMesh>
        </>
    );
}
