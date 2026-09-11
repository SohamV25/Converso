'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { ArrowRight, Bookmark, Clock } from 'lucide-react'
import { addBookmark, removeBookmark } from '@/lib/actions/companion.actions'

interface companionCardProps {
  id : string;
  name : string;
  topic : string;
  subject : string;
  duration : number;
  color : string;
  bookmarked? : boolean;
}

const CompanionCard = ({id, name, topic, subject, duration, color, bookmarked = false} : companionCardProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const { isSignedIn } = useAuth()

  // Local copy so the icon flips instantly instead of waiting for the server
  const [isBookmarked, setIsBookmarked] = useState(bookmarked)
  const [isPending, setIsPending] = useState(false)

  // Stay in sync when the server sends fresh data after revalidatePath
  useEffect(() => {
    setIsBookmarked(bookmarked)
  }, [bookmarked])

  const handleBookmark = async () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    const next = !isBookmarked
    setIsBookmarked(next)
    setIsPending(true)

    try {
      if (next) {
        await addBookmark(id, pathname)
      } else {
        await removeBookmark(id, pathname)
      }
    } catch (error) {
      // Saving failed, so put the icon back the way it was
      setIsBookmarked(!next)
      console.error('Failed to update bookmark', error)
    } finally {
      setIsPending(false)
    }
  }

  // Feed the pointer position to CSS for the moving highlight
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <article
      className='companion-card group min-h-[300px]'
      style={{backgroundColor : color}}
      onPointerMove={handlePointerMove}
    >
      {/* Halftone print texture */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.13] [background-image:radial-gradient(rgb(27_24_19)_1px,transparent_1.2px)] [background-size:9px_9px] [mask-image:linear-gradient(135deg,transparent_35%,black)]'
      />
      {/* Pointer-following highlight */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(260px_circle_at_var(--x,50%)_var(--y,50%),rgb(255_255_255/0.32),transparent_65%)]'
      />
      {/* Oversized subject mark as cover art */}
      <Image
        src={`/icons/${subject}.svg`}
        alt=''
        width={150}
        height={150}
        className='pointer-events-none absolute -right-6 -bottom-8 rotate-[-14deg] opacity-[0.12] transition-transform duration-500 group-hover:rotate-[-4deg]'
      />

      <div className='relative flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='flex size-10 items-center justify-center rounded-full bg-ink/10'>
            <Image src={`/icons/${subject}.svg`} alt='' width={20} height={20} />
          </span>
          <span className='subject-badge'>{subject}</span>
        </div>

        <button
          className='companion-bookmark disabled:opacity-50'
          onClick={handleBookmark}
          disabled={isPending}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          aria-pressed={isBookmarked}
        >
          <Bookmark className='size-4 text-cream' fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className='relative flex flex-col gap-2'>
        <h2 className='text-[1.75rem] leading-[1.05] font-semibold'>{name}</h2>
        <p className='line-clamp-2 text-sm text-ink/75'>{topic}</p>
      </div>

      <div className='relative flex items-center justify-between gap-3'>
        <span className='flex items-center gap-1.5 text-xs tracking-widest text-ink/70 uppercase'>
          <Clock className='size-3.5' aria-hidden /> {duration} min
        </span>
        <Link
          href={`/companions/${id}`}
          className='inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-cream transition-all duration-200 hover:gap-3'
        >
          Launch lesson <ArrowRight className='size-4' aria-hidden />
        </Link>
      </div>
    </article>
  )
}

export default CompanionCard
