'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react';
import {formUrlQuery, removeKeysFromUrlQuery} from '@jsmastery/utils'

const Searchinput = () => {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams()
    const query = searchParams.get('topic') || ''

    // Start from whatever topic is already in the URL, so a refresh keeps the search
    const [searchQuery, setSearchQuery] = useState(query)

    useEffect(()=>{
        const delyaDebounceFn = setTimeout(()=>{
                if(searchQuery){
                const newUrl = formUrlQuery({
                    params : searchParams.toString(),
                    key : "topic",
                    value : searchQuery
                });
                router.push(newUrl, {scroll : false})
            }else{
                if(pathname === '/companions'){
                    const newUrl = removeKeysFromUrlQuery({
                        params : searchParams.toString(),
                        keysToRemove : ["topic"]
                    })
                    router.push(newUrl, {scroll : false})
                }
            }
        }, 1000)

        // Cancel the pending search if the input changes again or the page is left
        return () => clearTimeout(delyaDebounceFn)
    }, [searchQuery, router, searchParams, pathname])

  return (
    <label className='flex h-11 w-full items-center gap-2.5 rounded-full border border-border bg-surface-2 px-4 transition-colors focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgb(63_224_176/0.18)] sm:w-80'>
        <Search className='size-4 shrink-0 text-muted-foreground' aria-hidden />
        <input
            aria-label='Search companions by topic or name'
            placeholder='Search by topic or name…'
            className='w-full bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm'
            value={searchQuery}
            onChange={(e)=> setSearchQuery(e.target.value)}
         />
    </label>
  )
}

export default Searchinput
