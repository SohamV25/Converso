import { cn } from '@/lib/utils'

// Brand mark: a mint badge with three voice bars
const Logo = ({ className }: { className?: string }) => (
    <span
        aria-hidden
        className={cn('flex size-9 items-center justify-center gap-[3px] rounded-[11px] bg-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]', className)}
    >
        <span className='h-[38%] w-[3px] rounded-full bg-ink' />
        <span className='h-[62%] w-[3px] rounded-full bg-ink' />
        <span className='h-[46%] w-[3px] rounded-full bg-ink' />
    </span>
)

export default Logo
