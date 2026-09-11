'use client'

import { Component, useRef, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useInView, useReducedMotion } from 'motion/react'

// Static stand-in: shown while the 3D code loads, and if WebGL is unavailable
const FallbackOrb = () => (
    <div className='absolute inset-0 flex items-center justify-center' aria-hidden>
        <div className='size-[46%] animate-float rounded-full bg-[radial-gradient(circle_at_35%_30%,#a6f3dc,#3fe0b0_45%,#0e5a45)] shadow-[0_0_120px_20px_rgb(63_224_176/0.35)]' />
        <div className='absolute size-[78%] rounded-full border border-cream/10' />
        <div className='absolute size-[96%] rounded-full border border-dashed border-cream/10' />
    </div>
)

// Three.js is heavy and needs the browser, so load it client-side only
const HeroScene = dynamic(() => import('./HeroScene'), {
    ssr: false,
    loading: () => <FallbackOrb />,
})

class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false }
    static getDerivedStateFromError() { return { failed: true } }
    render() { return this.state.failed ? <FallbackOrb /> : this.props.children }
}

const HeroCanvas = () => {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { margin: '120px' })
    const reduceMotion = useReducedMotion() ?? false
    const router = useRouter()

    return (
        <div
            ref={ref}
            role='img'
            aria-label='A glowing voice orb sending out sound ripples, circled by six subject badges on orbit lines. Move your pointer to tilt the scene, click the orb to make it pulse, or click a badge to browse that subject.'
            className='relative aspect-square w-full'
        >
            {/* Accent glow behind the scene */}
            <div className='absolute inset-[12%] rounded-full bg-mint/25 blur-[90px]' aria-hidden />
            <WebGLBoundary>
                <HeroScene
                    still={reduceMotion}
                    active={inView}
                    onSelectSubject={(subject) => router.push(`/companions?subject=${subject}`)}
                />
            </WebGLBoundary>
        </div>
    )
}

export default HeroCanvas
