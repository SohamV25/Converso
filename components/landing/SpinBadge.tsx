import { Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

// Retro "sticker": text running round a circle that slowly turns, with a mic at the centre
const SpinBadge = ({ className }: { className?: string }) => (
    <div className={cn('relative size-32', className)} aria-hidden>
        <svg viewBox='0 0 100 100' className='size-full animate-[spin_22s_linear_infinite]'>
            <defs>
                <path id='spin-badge-circle' d='M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0' />
            </defs>
            <circle cx='50' cy='50' r='49' className='fill-ink stroke-border' strokeWidth='1' />
            <text className='fill-cream text-[9.6px] font-semibold tracking-[0.24em] uppercase'>
                <textPath href='#spin-badge-circle'>Learn out loud • AI voice tutors • </textPath>
            </text>
        </svg>
        <span className='absolute inset-0 m-auto flex size-12 -rotate-12 items-center justify-center rounded-full bg-mustard text-ink shadow-lg'>
            <Mic className='size-5' />
        </span>
    </div>
)

export default SpinBadge
