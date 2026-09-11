'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
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

  return (
    <article
    className='companion-card' style={{backgroundColor : color}}
    >
      <div className='flex justify-between items-center'>
        <div className='subject-badge'>
        {subject}
        </div>

        <button
          className='companion-bookmark disabled:opacity-50'
          onClick={handleBookmark}
          disabled={isPending}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          aria-pressed={isBookmarked}
        >
        <Image
          src={isBookmarked ? '/icons/bookmark-filled.svg' : '/icons/bookmark.svg'}
          alt=""
          width={12.5}
          height={15}
        />
        </button>
      </div>

      <h2 className='text-2xl font-bold'>{name}</h2>

      <p className='text-sm'>{topic}</p>

      <div className='flex items-center gap-2'>
        <Image src="/icons/clock.svg" alt='duration' width={13.5} height={13.5}/>
      </div>

      <p className='text-sm'>{duration} minutes</p>

      <Link href={`/companions/${id}`} className='w-full'>
        <button className='btn-primary w-full justify-center'>
          Launch Lesson
        </button>
      </Link>

    </article>
  )
}

export default CompanionCard
