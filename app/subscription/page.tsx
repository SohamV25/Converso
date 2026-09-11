import { PricingTable } from '@clerk/nextjs'
import { Lock, RefreshCcw, Sparkles } from 'lucide-react'
import React from 'react'

const perks = [
  { icon: Sparkles, text: 'More companions and longer sessions' },
  { icon: RefreshCcw, text: 'Change or cancel your plan anytime' },
  { icon: Lock, text: 'Secure checkout handled by Clerk' },
]

const Subscription = () => {
  return (
    <main>
      <section className='relative flex flex-col items-center gap-5 overflow-hidden pt-6 text-center'>
        <div aria-hidden className='graph-paper absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]' />
        <p className='eyebrow'>Pricing</p>
        <h1 className='max-w-3xl md:text-6xl'>
          Pick a plan. <span className='display-italic text-primary'>Keep the conversation going.</span>
        </h1>
        <p className='max-w-xl text-muted-foreground'>
          Start free and upgrade when you want more companions, more sessions and more ways to learn out loud.
        </p>
        <ul className='mt-2 flex flex-wrap justify-center gap-3'>
          {perks.map(({ icon: Icon, text }) => (
            <li key={text} className='flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground/85'>
              <Icon className='size-4 text-mustard' aria-hidden /> {text}
            </li>
          ))}
        </ul>
      </section>

      <section className='mx-auto w-full max-w-5xl'>
        <PricingTable
          appearance={{
            elements: {
              pricingTableCard: 'rounded-[28px] border border-border bg-surface shadow-none',
            },
          }}
        />
      </section>
    </main>
  )
}

export default Subscription
