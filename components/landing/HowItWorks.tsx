import Image from 'next/image'
import { subjects } from '@/constants'
import { getSubjectColor } from '@/lib/utils'
import Reveal from '@/components/Reveal'
import Waveform from '@/components/Waveform'

const PickSubjectVisual = () => (
    <div className='grid w-full grid-cols-3 gap-3' aria-hidden>
        {subjects.map((subject, i) => (
            <div
                key={subject}
                className='flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl transition-transform duration-300 hover:-rotate-3 hover:scale-105'
                style={{ backgroundColor: getSubjectColor(subject), transform: `rotate(${[-3, 2, -1, 3, -2, 1][i]}deg)` }}
            >
                <Image src={`/icons/${subject}.svg`} alt='' width={30} height={30} />
                <span className='text-[10px] font-semibold tracking-widest text-ink/70 uppercase'>{subject}</span>
            </div>
        ))}
    </div>
)

const VoiceVisual = () => (
    <div className='flex w-full flex-col gap-3' aria-hidden>
        {[['Voice', 'Female', 'Male'], ['Style', 'Casual', 'Formal']].map(([label, on, off]) => (
            <div key={label} className='flex items-center justify-between rounded-2xl bg-surface-2 p-2 pl-5'>
                <span className='eyebrow'>{label}</span>
                <div className='flex gap-1 rounded-full bg-ink p-1 text-sm'>
                    <span className='rounded-full bg-cream px-4 py-1.5 font-medium text-ink'>{on}</span>
                    <span className='px-4 py-1.5 text-muted-foreground'>{off}</span>
                </div>
            </div>
        ))}
        <div className='flex items-center gap-4 rounded-2xl bg-surface-2 p-5'>
            <span className='flex size-11 items-center justify-center rounded-full bg-primary'>
                <Waveform count={4} className='h-4 gap-[2px]' barClassName='bg-ink w-[2px]' />
            </span>
            <p className='font-display text-lg italic'>&ldquo;Alright, let&apos;s make this click.&rdquo;</p>
        </div>
    </div>
)

const TalkVisual = () => (
    <div className='flex w-full flex-col gap-4 rounded-2xl bg-surface-2 p-6' aria-hidden>
        <div className='flex items-center gap-3'>
            <span className='relative flex size-2.5'>
                <span className='absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70' />
                <span className='relative inline-flex size-2.5 rounded-full bg-primary' />
            </span>
            <span className='eyebrow text-foreground'>Live session</span>
        </div>
        <Waveform className='h-14' />
        <p className='font-display text-xl leading-snug'>
            <span className='text-mustard'>Neura:</span> So what do you think happens when the signal reaches the synapse?
        </p>
        <p className='font-display text-xl leading-snug text-muted-foreground'>
            <span className='text-primary'>You:</span> It jumps across… chemically?
        </p>
    </div>
)

const steps = [
    { n: '01', title: 'Pick a subject', body: 'Maths, science, languages, history, coding or economics — then narrow it to the exact topic you are stuck on.', visual: <PickSubjectVisual /> },
    { n: '02', title: 'Shape the voice', body: 'Choose a male or female voice and a formal or casual style. Your companion keeps that personality every session.', visual: <VoiceVisual /> },
    { n: '03', title: 'Talk it through', body: 'Hit start and speak. It explains, checks you are following, and saves a transcript you can revisit in your journey.', visual: <TalkVisual /> },
]

// Each card sticks a little lower than the last, so they stack like index cards as you scroll
const HowItWorks = () => (
    <section aria-labelledby='how-heading' className='flex flex-col gap-10'>
        <Reveal className='flex flex-col gap-4'>
            <p className='eyebrow'>(03) How it works</p>
            <h2 id='how-heading' className='max-w-3xl text-4xl font-semibold md:text-6xl'>
                Three steps to a tutor that <span className='display-italic text-primary'>listens</span>.
            </h2>
        </Reveal>

        <ol className='flex flex-col gap-6'>
            {steps.map((step, i) => (
                <li
                    key={step.n}
                    className='sticky'
                    style={{ top: `calc(6rem + ${i * 1.75}rem)` }}
                >
                    <article className='grid items-center gap-8 overflow-hidden rounded-[32px] border border-border bg-surface p-7 shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.9)] md:grid-cols-[auto_1fr_1.1fr] md:gap-12 md:p-10'>
                        <span className='text-stroke font-display text-[7rem] leading-[0.8] font-bold italic md:text-[10rem]' aria-hidden>
                            {step.n}
                        </span>
                        <div className='flex flex-col gap-3'>
                            <span className='eyebrow text-primary'>Step {step.n}</span>
                            <h3 className='font-display text-3xl font-semibold tracking-tight md:text-4xl'>{step.title}</h3>
                            <p className='max-w-sm leading-relaxed text-muted-foreground'>{step.body}</p>
                        </div>
                        {step.visual}
                    </article>
                </li>
            ))}
        </ol>
    </section>
)

export default HowItWorks
