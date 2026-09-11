'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { cn } from '@/lib/utils'

// Words wrapped in *asterisks* are set in the accent italic
const statement =
    'Most of us learned best by *listening* — to a teacher who paused, asked a question, and actually waited for the answer. Converso brings that back: a patient voice that explains, checks in, and lets you *think out loud.*'

const Word = ({ word, progress, range, still }: {
    word: string; progress: MotionValue<number>; range: [number, number]; still: boolean
}) => {
    const opacity = useTransform(progress, range, [0.16, 1])
    const accent = word.startsWith('*') || word.endsWith('*') || word.endsWith('*.')
    const clean = word.replace(/\*/g, '')

    return (
        <motion.span
            style={{ opacity: still ? 1 : opacity }}
            className={cn('mr-[0.24em] inline-block', accent && 'display-italic text-mustard')}
        >
            {clean}
        </motion.span>
    )
}

// A statement that lights up word by word as it scrolls through the viewport
const Manifesto = () => {
    const ref = useRef<HTMLParagraphElement>(null)
    const still = useReducedMotion() ?? false
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] })

    // Carry the accent across a phrase: "*think out loud.*" spans three words
    const words = statement.split(' ')
    let inAccent = false
    const marked = words.map((w) => {
        const opens = w.startsWith('*')
        const closes = w.endsWith('*') || w.endsWith('*.')
        const token = inAccent || opens ? (opens ? w : `*${w}`) : w
        if (opens && !closes) inAccent = true
        if (closes) inAccent = false
        return token
    })

    return (
        <section aria-labelledby='manifesto-heading' className='flex flex-col gap-8'>
            <p id='manifesto-heading' className='eyebrow'>(02) Why voice</p>
            <p ref={ref} className='font-display text-[clamp(1.9rem,4.3vw,4rem)] leading-[1.12] font-medium tracking-tight'>
                {marked.map((word, i) => (
                    <Word
                        key={i}
                        word={word}
                        progress={scrollYProgress}
                        range={[i / marked.length, (i + 1) / marked.length]}
                        still={still}
                    />
                ))}
            </p>
        </section>
    )
}

export default Manifesto
