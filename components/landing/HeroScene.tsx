'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, Float, Html, MeshDistortMaterial, RoundedBox, Sparkles } from '@react-three/drei'
import { subjectsColors } from '@/constants'

type Subject = keyof typeof subjectsColors

// Each subject rides its own tilted orbit; pairs share a ring on opposite sides
const orbits: { subject: Subject; radius: number; speed: number; tilt: number; phase: number }[] = [
    { subject: 'maths',     radius: 2.4,  speed: 0.3,  tilt: 0.38,  phase: 0 },
    { subject: 'science',   radius: 2.4,  speed: 0.3,  tilt: 0.38,  phase: Math.PI },
    { subject: 'language',  radius: 2.95, speed: 0.2,  tilt: -0.55, phase: 1.2 },
    { subject: 'coding',    radius: 2.95, speed: 0.2,  tilt: -0.55, phase: 1.2 + Math.PI },
    { subject: 'history',   radius: 3.4,  speed: 0.14, tilt: 1.0,   phase: 2.3 },
    { subject: 'economics', radius: 3.4,  speed: 0.14, tilt: 1.0,   phase: 2.3 + Math.PI },
]

// Rasterise a subject's SVG icon onto a canvas so it stays crisp as a texture
function useIconTexture(subject: string) {
    const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)

    useEffect(() => {
        let created: THREE.CanvasTexture | null = null
        let cancelled = false
        const img = new window.Image()
        img.onload = () => {
            if (cancelled) return
            const size = 256
            const canvas = document.createElement('canvas')
            canvas.width = canvas.height = size
            canvas.getContext('2d')?.drawImage(img, 0, 0, size, size)
            created = new THREE.CanvasTexture(canvas)
            created.colorSpace = THREE.SRGBColorSpace
            created.anisotropy = 4
            setTexture(created)
        }
        img.src = `/icons/${subject}.svg`
        return () => {
            cancelled = true
            created?.dispose()
        }
    }, [subject])

    return texture
}

function SubjectBadge({ subject, radius, speed, tilt, phase, still, onSelect }: {
    subject: Subject; radius: number; speed: number; tilt: number; phase: number; still: boolean
    onSelect: (subject: string) => void
}) {
    const pivot = useRef<THREE.Group>(null)
    const badge = useRef<THREE.Group>(null)
    const [hovered, setHovered] = useState(false)
    const icon = useIconTexture(subject)

    useFrame((_, dt) => {
        // Pause this badge's orbit while hovered so it is easy to click
        if (!still && !hovered && pivot.current) pivot.current.rotation.y += dt * speed
        if (badge.current) {
            const target = hovered ? 1.35 : 1
            badge.current.scale.setScalar(THREE.MathUtils.damp(badge.current.scale.x, target, 10, dt))
        }
    })

    return (
        <group rotation={[tilt, 0, 0]}>
            {/* Orbit path, drawn like a vintage science diagram */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.006, 6, 180]} />
                <meshBasicMaterial color="#f2eadb" transparent opacity={0.12} />
            </mesh>

            <group ref={pivot} rotation={[0, phase, 0]}>
                <Billboard position={[radius, 0, 0]}>
                    <group
                        ref={badge}
                        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
                        onPointerOut={() => { setHovered(false); document.body.style.cursor = '' }}
                        onClick={(e) => { e.stopPropagation(); document.body.style.cursor = ''; onSelect(subject) }}
                    >
                        <RoundedBox args={[0.8, 0.8, 0.18]} radius={0.15} smoothness={4}>
                            <meshStandardMaterial color={subjectsColors[subject]} roughness={0.5} />
                        </RoundedBox>
                        {icon && (
                            <mesh position={[0, 0, 0.096]}>
                                <planeGeometry args={[0.5, 0.5]} />
                                <meshBasicMaterial map={icon} transparent toneMapped={false} />
                            </mesh>
                        )}
                        {hovered && (
                            <Html center position={[0, 0.72, 0]} zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
                                <span className='whitespace-nowrap rounded-full border border-border bg-ink/90 px-3 py-1 text-xs font-semibold tracking-widest text-cream uppercase shadow-xl backdrop-blur'>
                                    Explore {subject} →
                                </span>
                            </Html>
                        )}
                    </group>
                </Billboard>
            </group>
        </group>
    )
}

// Rings that swell out of the orb and fade, like a voice carrying through the room
function VoiceRipples({ still }: { still: boolean }) {
    const rings = useRef<(THREE.Mesh | null)[]>([])

    useFrame(({ clock }) => {
        rings.current.forEach((ring, i) => {
            if (!ring) return
            const t = still ? 0.35 + i * 0.2 : (clock.elapsedTime * 0.32 + i / 3) % 1
            ring.scale.setScalar(1.25 + t * 2.3)
            ;(ring.material as THREE.MeshBasicMaterial).opacity = (1 - t) * (still ? 0.12 : 0.28)
        })
    })

    return (
        <>
            {[0, 1, 2].map((i) => (
                <mesh key={i} ref={(el) => { rings.current[i] = el }}>
                    <ringGeometry args={[0.985, 1, 128]} />
                    <meshBasicMaterial color="#a6f3dc" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
                </mesh>
            ))}
        </>
    )
}

function Orb({ still }: { still: boolean }) {
    const shell = useRef<THREE.Mesh>(null)
    const core = useRef<THREE.Group>(null)
    const [hovered, setHovered] = useState(false)
    const pulse = useRef(0)

    useFrame((state, dt) => {
        if (shell.current && !still) {
            shell.current.rotation.y += dt * 0.12
            shell.current.rotation.x += dt * 0.04
        }
        // Clicking makes the orb "speak": a quick swell that eases back
        if (core.current) {
            pulse.current = THREE.MathUtils.damp(pulse.current, 0, 4, dt)
            const breathe = still ? 0 : Math.sin(state.clock.elapsedTime * 1.6) * 0.015
            const s = 1 + pulse.current * 0.18 + breathe + (hovered ? 0.04 : 0)
            core.current.scale.setScalar(THREE.MathUtils.damp(core.current.scale.x, s, 8, dt))
        }
    })

    return (
        <group>
            <group
                ref={core}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
                onPointerOut={() => { setHovered(false); document.body.style.cursor = '' }}
                onClick={(e) => { e.stopPropagation(); pulse.current = 1 }}
            >
                <mesh>
                    <sphereGeometry args={[1.15, 128, 128]} />
                    <MeshDistortMaterial
                        color="#22cf9b"
                        emissive="#06714f"
                        emissiveIntensity={0.6}
                        roughness={0.28}
                        metalness={0.05}
                        distort={still ? 0.12 : hovered ? 0.48 : 0.3}
                        speed={still ? 0 : hovered ? 3 : 1.6}
                    />
                </mesh>
                {/* Soft atmospheric halo */}
                <mesh scale={1.42}>
                    <sphereGeometry args={[1.15, 48, 48]} />
                    <meshBasicMaterial color="#3fe0b0" transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
                </mesh>
            </group>
            <mesh ref={shell} scale={1.8}>
                <icosahedronGeometry args={[1, 1]} />
                <meshBasicMaterial color="#f2eadb" wireframe transparent opacity={0.13} />
            </mesh>
        </group>
    )
}

// Eases the whole scene toward the pointer, and drags a warm light along with it
function Rig({ children, still }: { children: React.ReactNode; still: boolean }) {
    const group = useRef<THREE.Group>(null)
    const light = useRef<THREE.PointLight>(null)

    useFrame((state, dt) => {
        const px = still ? 0 : state.pointer.x
        const py = still ? 0 : state.pointer.y
        if (group.current) {
            group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, py * 0.22, 3, dt)
            group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, px * 0.35, 3, dt)
        }
        if (light.current) {
            light.current.position.x = THREE.MathUtils.damp(light.current.position.x, px * 5, 4, dt)
            light.current.position.y = THREE.MathUtils.damp(light.current.position.y, py * 4, 4, dt)
        }
    })

    return (
        <>
            <pointLight ref={light} position={[0, 0, 4]} intensity={22} distance={14} color="#fff4e6" />
            <group ref={group}>{children}</group>
        </>
    )
}

export default function HeroScene({ still, active, onSelectSubject }: {
    still: boolean; active: boolean; onSelectSubject: (subject: string) => void
}) {
    return (
        <Canvas
            camera={{ position: [0, 0.3, 11], fov: 40 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            // Only render continuously while visible and motion is allowed
            frameloop={active && !still ? 'always' : 'demand'}
            eventSource={typeof document !== 'undefined' ? document.body : undefined}
            eventPrefix="client"
        >
            <ambientLight intensity={0.5} />
            <hemisphereLight args={['#fff1dc', '#1b1813', 0.6]} />
            <directionalLight position={[4, 5, 4]} intensity={2} color="#fff1dc" />
            <pointLight position={[-4, -2, 3]} intensity={26} color="#e9b949" />

            <Sparkles count={70} scale={[11, 8, 5]} size={2.2} speed={still ? 0 : 0.3} opacity={0.5} color="#e9b949" />

            <Rig still={still}>
                <VoiceRipples still={still} />
                <Float speed={still ? 0 : 1.2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <Orb still={still} />
                </Float>
                {orbits.map((o) => (
                    <SubjectBadge key={o.subject} {...o} still={still} onSelect={onSelectSubject} />
                ))}
            </Rig>
        </Canvas>
    )
}
