'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils';

const navItems = [
    {label : 'Home', href : '/'},
    {label : 'Companions', href : '/companions'},
    {label : 'My Journey', href : '/my-journey'},
    {label : 'Pricing', href : '/subscription'},
]

const isActive = (pathname: string, href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

const NavItems = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false)

    // Close the mobile menu whenever the route changes
    useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
        {/* Desktop */}
        <div className='hidden items-center gap-1 rounded-full border border-border bg-surface/60 p-1 md:flex'>
            {navItems.map(({label, href}) => (
                <Link
                    key={label}
                    href={href}
                    aria-current={isActive(pathname, href) ? 'page' : undefined}
                    className={cn(
                        'rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground',
                        isActive(pathname, href) && 'bg-cream text-ink hover:text-ink'
                    )}
                >
                    {label}
                </Link>
            ))}
        </div>

        {/* Mobile */}
        <button
            className='flex size-11 items-center justify-center rounded-full border border-border bg-surface md:hidden'
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls='mobile-nav'
            aria-label={open ? 'Close menu' : 'Open menu'}
        >
            {open ? <X className='size-5' /> : <Menu className='size-5' />}
        </button>

        {open && (
            <div
                id='mobile-nav'
                className='absolute inset-x-4 top-[calc(100%+8px)] flex flex-col gap-1 rounded-3xl border border-border bg-surface p-2 shadow-2xl md:hidden'
            >
                {navItems.map(({label, href}) => (
                    <Link
                        key={label}
                        href={href}
                        aria-current={isActive(pathname, href) ? 'page' : undefined}
                        className={cn(
                            'rounded-2xl px-4 py-3 font-medium text-muted-foreground',
                            isActive(pathname, href) && 'bg-cream text-ink'
                        )}
                    >
                        {label}
                    </Link>
                ))}
            </div>
        )}
    </>
  )
}

export default NavItems
