"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WaveGrid() {
    const pointsRef = useRef();
    const linesRef = useRef();

    // Wave parameters
    const waveSize = 200;
    const pointSpacing = 4;
    const pointCount = Math.floor(waveSize / pointSpacing);
    const totalPoints = pointCount * pointCount;

    // Create geometry
    const { positions, colors, lineIndices } = useMemo(() => {
        const positions = new Float32Array(totalPoints * 3);
        const colors = new Float32Array(totalPoints * 3);
        const lineIndices = [];

        let index = 0;
        for (let i = 0; i < pointCount; i++) {
            for (let j = 0; j < pointCount; j++) {
                const x = (i - pointCount / 2) * pointSpacing;
                const z = (j - pointCount / 2) * pointSpacing;

                positions[index * 3] = x;
                positions[index * 3 + 1] = 0;
                positions[index * 3 + 2] = z;

                // Green gradient from center
                const distance = Math.sqrt(x * x + z * z) / (waveSize / 2);
                const intensity = 1 - Math.min(distance, 1) * 0.7;

                // Green color (#2EE59D)
                colors[index * 3] = 0.18 * intensity;     // R
                colors[index * 3 + 1] = 0.9 * intensity;  // G
                colors[index * 3 + 2] = 0.62 * intensity; // B

                // Create line connections
                if (j < pointCount - 1) {
                    lineIndices.push(i * pointCount + j, i * pointCount + j + 1);
                }
                if (i < pointCount - 1) {
                    lineIndices.push(i * pointCount + j, (i + 1) * pointCount + j);
                }

                index++;
            }
        }

        return { positions, colors, lineIndices };
    }, [pointCount, pointSpacing, waveSize, totalPoints]);

    // Animate waves
    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array;

            for (let i = 0; i < pointCount; i++) {
                for (let j = 0; j < pointCount; j++) {
                    const index = (i * pointCount + j) * 3;
                    const x = positions[index];
                    const z = positions[index + 2];

                    // Multiple wave frequencies
                    const wave1 = Math.sin((x * 0.08) + time * 0.8) * 3;
                    const wave2 = Math.cos((z * 0.08) + time * 0.6) * 3;
                    const wave3 = Math.sin((x * 0.04 + z * 0.04) + time) * 2;

                    positions[index + 1] = wave1 + wave2 + wave3;
                }
            }

            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }

        if (linesRef.current) {
            linesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <>
            {/* Points */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={totalPoints}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={totalPoints}
                        array={colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.2}
                    vertexColors
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Lines */}
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={totalPoints}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="index"
                        count={lineIndices.length}
                        array={new Uint16Array(lineIndices)}
                        itemSize={1}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#2EE59D"
                    transparent
                    opacity={0.3}
                />
            </lineSegments>
        </>
    );
}

const ThreeJSFooter = () => {
    return (
        <div className="absolute inset-0 opacity-60 h-full w-full pointer-events-none">
            <Canvas
                camera={{ position: [0, 15, 40], fov: 60 }}
                style={{ background: 'transparent' }}
            >
                <WaveGrid />
            </Canvas>
        </div>
    );
};

export default ThreeJSFooter;
