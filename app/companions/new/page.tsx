import CompanionForm from '@/components/CompanionForm'
import { newCompanionPermissions } from '@/lib/actions/companion.actions';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
import Waveform from '@/components/Waveform';

const tips = [
  ['01', 'Name it', 'Give your companion a personality — "Countsy the Number Wizard" sticks better than "Maths".'],
  ['02', 'Be specific', 'A narrow topic like "integration by parts" gets you a far sharper lesson than "calculus".'],
  ['03', 'Pick a vibe', 'Casual for exploring, formal for exam prep. You can always build another.'],
]

const NewCompanion = async() => {

  //First check that the user is logged in if not make him sign in
  const { userId } = await auth();
  if(!userId){
    redirect('/sign-in')
  }

  const canCreateCompanion = await newCompanionPermissions()
  return (
    <main>
      { canCreateCompanion ? (
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16'>
          <section className='flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start'>
            <div className='flex flex-col gap-4'>
              <p className='eyebrow'>Companion builder</p>
              <h1>
                Make a tutor <span className='display-italic text-primary'>that&apos;s yours.</span>
              </h1>
              <p className='max-w-md text-muted-foreground'>
                Six quick choices. When you are done you will go straight into your first voice session.
              </p>
            </div>

            <ol className='flex flex-col gap-3'>
              {tips.map(([n, title, body]) => (
                <li key={n} className='flex gap-4 rounded-2xl border border-border bg-surface/60 p-4'>
                  <span className='font-display text-xl italic text-primary'>{n}</span>
                  <div className='flex flex-col gap-1'>
                    <p className='font-display text-lg font-semibold'>{title}</p>
                    <p className='text-sm text-muted-foreground'>{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className='hidden items-center gap-3 text-sm text-muted-foreground lg:flex' aria-hidden>
              <Waveform count={12} className='h-6' />
              Voice sessions start in seconds
            </div>
          </section>

          <section className='panel p-5 sm:p-6 md:p-10'>
            <CompanionForm/>
          </section>
        </div>
      ) : (
        <article className='companion-limit mx-auto max-w-lg'>
          <span className='flex size-20 items-center justify-center rounded-3xl border border-border bg-surface'>
            <Lock className='size-8 text-mustard' aria-hidden />
          </span>

          <div className='cta-badge'>
            Upgrade your plan
          </div>

          <h1>You&apos;ve reached your limit</h1>

          <p className='text-muted-foreground'>You&apos;ve used every companion on your current plan. Upgrade to create more companions and unlock premium features.</p>

          <Link href={"/subscription"} className='btn-primary w-full justify-center py-3 text-base'>
            Upgrade my plan <ArrowRight className='size-4' aria-hidden />
          </Link>
        </article>
      )}
    </main>
  )
}

export default NewCompanion
