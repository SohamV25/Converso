import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/Reveal'
import Waveform from '@/components/Waveform'

// A bold mint poster block to close the page — breaks up the dark before the footer
const ClosingCTA = () => (
    <Reveal>
        <section className='relative overflow-hidden rounded-[40px] bg-primary px-6 py-16 text-ink md:px-16 md:py-24'>
            <div
                aria-hidden
                className='pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgb(27_24_19)_1.2px,transparent_1.4px)] [background-size:12px_12px] [mask-image:linear-gradient(to_left,black,transparent_70%)]'
            />
            <div className='relative flex flex-col items-start gap-8'>
                <p className='text-xs font-semibold tracking-[0.2em] uppercase'>(05) Your turn</p>
                <h2 className='max-w-4xl text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] font-semibold'>
                    Got a topic you&apos;ve been avoiding? <span className='display-italic'>Talk it out.</span>
                </h2>
                <div className='flex flex-wrap items-center gap-6'>
                    <Link
                        href='/companions/new'
                        className='group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-base font-semibold text-cream transition-transform duration-200 hover:-translate-y-0.5'
                    >
                        Build your companion
                        <ArrowRight className='size-5 transition-transform group-hover:translate-x-1' aria-hidden />
                    </Link>
                    <Waveform count={14} className='h-10' barClassName='bg-ink' />
                </div>
            </div>
        </section>
    </Reveal>
)

export default ClosingCTA
