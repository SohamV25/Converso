'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { subjects } from '@/constants'
import { getSubjectColor } from '@/lib/utils'
import Reveal from '@/components/Reveal'
import Waveform from '@/components/Waveform'

const PickSubjectVisual = () => (
    <div className='grid w-full grid-cols-3 gap-2.5 sm:gap-3' aria-hidden>
        {subjects.map((subject, i) => (
            <div
                key={subject}
                className='flex aspect-[5/4] flex-col items-center justify-center gap-1.5 rounded-2xl sm:aspect-square sm:gap-2'
                style={{ backgroundColor: getSubjectColor(subject), transform: `rotate(${[-3, 2, -1, 3, -2, 1][i]}deg)` }}
            >
                <Image src={`/icons/${subject}.svg`} alt='' width={30} height={30} className='size-6 sm:size-7' />
                <span className='text-[9px] font-semibold tracking-widest text-ink/70 uppercase sm:text-[10px]'>{subject}</span>
            </div>
        ))}
    </div>
)

const VoiceVisual = () => (
    <div className='flex w-full flex-col gap-2.5 sm:gap-3' aria-hidden>
        {[['Voice', 'Female', 'Male'], ['Style', 'Casual', 'Formal']].map(([label, on, off]) => (
            <div key={label} className='flex items-center justify-between gap-2 rounded-2xl bg-surface-2 p-1.5 pl-4 sm:p-2 sm:pl-5'>
                <span className='eyebrow'>{label}</span>
                <div className='flex gap-1 rounded-full bg-ink p-1 text-xs sm:text-sm'>
                    <span className='rounded-full bg-cream px-3 py-1.5 font-medium text-ink sm:px-4'>{on}</span>
                    <span className='px-3 py-1.5 text-muted-foreground sm:px-4'>{off}</span>
                </div>
            </div>
        ))}
        <div className='flex items-center gap-3 rounded-2xl bg-surface-2 p-3.5 sm:gap-4 sm:p-5'>
            <span className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary sm:size-11'>
                <Waveform count={4} className='h-4 gap-[2px]' barClassName='bg-ink w-[2px]' />
            </span>
            <p className='font-display text-base italic sm:text-lg'>&ldquo;Alright, let&apos;s make this click.&rdquo;</p>
        </div>
    </div>
)

const TalkVisual = () => (
    <div className='flex w-full flex-col gap-3 rounded-2xl bg-surface-2 p-4 sm:gap-4 sm:p-6' aria-hidden>
        <div className='flex items-center gap-3'>
            <span className='relative flex size-2.5'>
                <span className='absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70' />
                <span className='relative inline-flex size-2.5 rounded-full bg-primary' />
            </span>
            <span className='eyebrow text-foreground'>Live session</span>
        </div>
        <Waveform className='h-10 sm:h-14' />
        <p className='font-display text-base leading-snug sm:text-xl'>
            <span className='text-mustard'>Neura:</span> What happens when the signal reaches the synapse?
        </p>
        <p className='font-display text-base leading-snug text-muted-foreground max-[359px]:hidden sm:text-xl'>
            <span className='text-primary'>You:</span> It jumps across… chemically?
        </p>
    </div>
)

const steps: { n: string; title: string; body: string; accent: string; visual: ReactNode }[] = [
    { n: '01', title: 'Pick a subject', accent: '#e9b949', body: 'Maths, science, languages, history, coding or economics — then narrow it to the exact topic you are stuck on.', visual: <PickSubjectVisual /> },
    { n: '02', title: 'Shape the voice', accent: '#3fe0b0', body: 'A male or female voice, formal or casual. Your companion keeps that personality every session.', visual: <VoiceVisual /> },
    { n: '03', title: 'Talk it through', accent: '#e0876a', body: 'Hit start and speak. It explains, checks you are following, and saves a transcript for your journey.', visual: <TalkVisual /> },
]

// One card in the stack. As later cards slide over it, it shrinks toward its top edge and dims,
// so the pile reads as physical depth rather than cards simply overlapping.
const StackCard = ({ step, index, total, progress, still }: {
    step: (typeof steps)[number]; index: number; total: number; progress: MotionValue<number>; still: boolean
}) => {
    const depth = total - 1 - index
    const range = [index / total, 1]
    const scale = useTransform(progress, range, [1, 1 - depth * 0.06])
    const shade = useTransform(progress, range, [0, depth * 0.28])

    return (
        <li className='sticky top-0 flex h-[90svh] items-center pt-14 md:h-[88svh] md:pt-16'>
            <motion.article
                style={{ scale: still ? 1 : scale, top: `calc(-3svh + ${index * 20}px)`, '--accent': step.accent } as unknown as CSSProperties}
                className='relative w-full origin-top overflow-hidden rounded-[28px] border border-border bg-surface p-5 shadow-[0_-30px_60px_-34px_rgb(0_0_0/0.95)] sm:p-7 md:rounded-[36px] md:p-10'
            >
                {/* Accent glow + faint grid, tinted per step */}
                <div aria-hidden className='pointer-events-none absolute -top-24 -left-16 size-64 rounded-full opacity-25 blur-3xl' style={{ backgroundColor: step.accent }} />
                <div aria-hidden className='graph-paper pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom_right,black,transparent_60%)]' />

                {/* Phones: numeral beside the title, then body, then visual.
                    md+: numeral | copy | visual across one row. */}
                <div className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-4 [grid-template-areas:'num_title'_'body_body'_'visual_visual'] md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-x-12 md:gap-y-3 md:[grid-template-areas:'num_title_visual'_'num_body_visual']">
                    <span
                        aria-hidden
                        className='self-center font-display text-[4.25rem] leading-[0.8] font-bold text-transparent italic [-webkit-text-stroke:1.5px_var(--accent)] [grid-area:num] sm:text-[6rem] md:text-[10rem]'
                    >
                        {step.n}
                    </span>
                    <div className='flex min-w-0 flex-col gap-1.5 self-end [grid-area:title] md:gap-3'>
                        <span className='eyebrow' style={{ color: step.accent }}>Step {step.n} / 0{total}</span>
                        <h3 className='font-display text-2xl leading-tight font-semibold tracking-tight sm:text-3xl md:text-4xl'>{step.title}</h3>
                    </div>
                    <p className='max-w-sm text-sm leading-relaxed text-muted-foreground [grid-area:body] sm:text-base md:self-start'>{step.body}</p>
                    <div className='min-w-0 [grid-area:visual]'>{step.visual}</div>
                </div>

                {/* Darkens this card as it sinks into the stack */}
                <motion.div aria-hidden className='pointer-events-none absolute inset-0 bg-ink' style={{ opacity: still ? 0 : shade }} />
            </motion.article>
        </li>
    )
}

const HowItWorks = () => {
    const stack = useRef<HTMLOListElement>(null)
    const still = useReducedMotion() ?? false
    const { scrollYProgress } = useScroll({ target: stack, offset: ['start start', 'end end'] })

    return (
        <section aria-labelledby='how-heading' className='flex flex-col gap-4 md:gap-6'>
            <Reveal className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10'>
                <div className='flex flex-col gap-4'>
                    <p className='eyebrow'>(03) How it works</p>
                    <h2 id='how-heading' className='max-w-3xl text-4xl leading-[1.02] font-semibold md:text-6xl'>
                        Three steps to a tutor that <span className='display-italic text-primary'>listens.</span>
                    </h2>
                </div>
                <p className='max-w-xs text-muted-foreground md:pb-2 md:text-right'>
                    Setup takes under a minute. The learning takes as long as you like.
                </p>
            </Reveal>

            <ol ref={stack} className='relative'>
                {steps.map((step, i) => (
                    <StackCard key={step.n} step={step} index={i} total={steps.length} progress={scrollYProgress} still={still} />
                ))}
            </ol>
        </section>
    )
}

export default HowItWorks
