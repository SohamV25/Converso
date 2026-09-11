import { cn } from '@/lib/utils'

// Pure-CSS animated voice bars — heights and delays are fixed so SSR and client match
const bars = [0.45, 0.8, 0.55, 1, 0.7, 0.9, 0.5, 0.75, 0.6, 0.95, 0.5, 0.7, 0.4, 0.85, 0.55]

const Waveform = ({ className, barClassName, count = bars.length }: {
    className?: string; barClassName?: string; count?: number
}) => (
    <div className={cn('flex h-10 items-center gap-[3px]', className)} aria-hidden>
        {bars.slice(0, count).map((h, i) => (
            <span
                key={i}
                className={cn('w-[3px] origin-center animate-wave rounded-full bg-primary', barClassName)}
                style={{ height: `${h * 100}%`, animationDelay: `${(i % 7) * -0.13}s` }}
            />
        ))}
    </div>
)

export default Waveform
