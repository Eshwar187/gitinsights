import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface DNAHelixProps {
    primaryColor: string;
    secondaryColor: string;
    languages: { language: string; percentage: number }[];
}

// Language to color mapping
const LANGUAGE_COLORS: Record<string, string> = {
    'TypeScript': '#3178c6',
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Ruby': '#701516',
    'PHP': '#4F5D95',
    'Swift': '#FA7343',
    'Kotlin': '#A97BFF',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
};

function DNAStrand({ position, color, rotation }: { position: [number, number, number]; color: string; rotation: number }) {
    const sphereRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (sphereRef.current) {
            sphereRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + rotation) * 0.1;
        }
    });

    return (
        <Sphere ref={sphereRef} args={[0.15, 16, 16]} position={position}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </Sphere>
    );
}

function HelixConnector({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
    return (
        <Line
            points={[start, end]}
            color={color}
            lineWidth={2}
            opacity={0.6}
            transparent
        />
    );
}

function AnimatedHelix({ languages }: { languages: { language: string; percentage: number }[] }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    const helixPoints = useMemo(() => {
        const points: { left: [number, number, number]; right: [number, number, number]; color: string; index: number }[] = [];
        const numPoints = 20;
        const height = 8;
        const radius = 1.5;

        for (let i = 0; i < numPoints; i++) {
            const t = i / numPoints;
            const y = (t - 0.5) * height;
            const angle = t * Math.PI * 4; // 2 full rotations

            const langIndex = i % Math.max(languages.length, 1);
            const lang = languages[langIndex]?.language || 'Unknown';
            const color = LANGUAGE_COLORS[lang] || '#888888';

            points.push({
                left: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number],
                right: [Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius] as [number, number, number],
                color,
                index: i
            });
        }

        return points;
    }, [languages]);

    return (
        <group ref={groupRef}>
            {helixPoints.map((point, i) => (
                <group key={i}>
                    <DNAStrand position={point.left} color={point.color} rotation={i} />
                    <DNAStrand position={point.right} color={point.color} rotation={i + Math.PI} />
                    <HelixConnector start={point.left} end={point.right} color={point.color} />
                </group>
            ))}

            {/* Backbone lines */}
            <Line
                points={helixPoints.map(p => p.left)}
                color="#4a90d9"
                lineWidth={1}
                opacity={0.4}
                transparent
            />
            <Line
                points={helixPoints.map(p => p.right)}
                color="#d94a90"
                lineWidth={1}
                opacity={0.4}
                transparent
            />
        </group>
    );
}

export function DNAVisualization({ languages }: DNAHelixProps) {
    return (
        <div className="w-full h-[400px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl overflow-hidden">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90d9" />

                <AnimatedHelix languages={languages} />

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={5}
                    maxDistance={15}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
}

export default DNAVisualization;
