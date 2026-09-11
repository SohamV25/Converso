import Link from 'next/link'
import Image from 'next/image'
import { subjects } from '@/constants'
import { getSubjectColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Each row renders the list twice and slides by exactly half, so the loop is seamless
const Row = ({ outlined = false }: { outlined?: boolean }) => (
    <div className='group mask-fade-x overflow-hidden'>
        <div className={cn('flex w-max animate-marquee group-hover:[animation-play-state:paused]', outlined && '[animation-direction:reverse] [animation-duration:46s]')}>
            {[...subjects, ...subjects].map((subject, i) => {
                const duplicate = i >= subjects.length
                return (
                    <Link
                        key={`${subject}-${i}`}
                        href={`/companions?subject=${subject}`}
                        aria-hidden={duplicate || outlined || undefined}
                        tabIndex={duplicate || outlined ? -1 : undefined}
                        className='flex items-center gap-5 pr-10 md:pr-14'
                    >
                        <span
                            className={cn(
                                'flex size-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 md:size-16',
                                i % 2 ? 'rotate-6' : '-rotate-6',
                                'hover:rotate-0'
                            )}
                            style={{ backgroundColor: getSubjectColor(subject) }}
                        >
                            <Image src={`/icons/${subject}.svg`} alt='' width={28} height={28} />
                        </span>
                        <span
                            className={cn(
                                'font-display text-5xl leading-none capitalize md:text-7xl',
                                outlined ? 'text-stroke font-bold' : 'display-italic transition-colors hover:text-primary'
                            )}
                        >
                            {subject}
                        </span>
                    </Link>
                )
            })}
        </div>
    </div>
)

const SubjectMarquee = () => (
    <section aria-label='Subjects' className='flex flex-col gap-6 border-y border-border bg-surface/40 py-10'>
        <Row />
        <Row outlined />
    </section>
)

export default SubjectMarquee
