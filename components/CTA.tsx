import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { subjects } from '@/constants'
import { getSubjectColor } from '@/lib/utils'
import Waveform from '@/components/Waveform'

const CTA = () => {
  return (
    <section className='cta-section'>
      {/* Accent corner glow */}
      <div aria-hidden className='pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-mint/25 blur-3xl' />

      <span className='cta-badge relative'>Start learning your way</span>

      <h2 className='relative text-3xl leading-tight font-semibold md:text-4xl'>
        Build a companion that <span className='display-italic text-mustard'>fits how you learn.</span>
      </h2>
      <p className='relative text-muted-foreground'>
        Pick a name, subject, voice and personality — then learn through voice conversations that feel natural.
      </p>

      {/* Stack of subject tiles standing in for the old illustration */}
      <div className='relative flex w-full items-center justify-between gap-4 rounded-2xl bg-surface-2 p-4' aria-hidden>
        <div className='flex -space-x-3'>
          {subjects.slice(0, 5).map((subject, i) => (
            <span
              key={subject}
              className='flex size-11 items-center justify-center rounded-xl border-2 border-surface-2'
              style={{ backgroundColor: getSubjectColor(subject), transform: `rotate(${(i - 2) * 6}deg)` }}
            >
              <Image src={`/icons/${subject}.svg`} alt='' width={20} height={20} />
            </span>
          ))}
        </div>
        <Waveform count={10} className='h-8' barClassName='bg-mustard' />
      </div>

      <Link href="/companions/new" className='btn-primary relative mt-auto w-full justify-center py-3 text-base'>
        <Plus className='size-4' aria-hidden /> Build a new companion
      </Link>
    </section>
  )
}

export default CTA
