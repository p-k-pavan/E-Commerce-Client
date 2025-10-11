'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { IoSearch } from "react-icons/io5"
import { TypeAnimation } from 'react-type-animation'
import { FaArrowLeft } from "react-icons/fa"

const Search = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSearchPage, setIsSearchPage] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const searchText = searchParams?.get('q') || ''

  // Mobile detection hook
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const isSearch = pathname === "/search"
    setIsSearchPage(isSearch)
  }, [pathname])

  const redirectToSearchPage = () => {
    router.push("/search")
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const url = `/search?q=${encodeURIComponent(value)}`
    router.push(url)
  }

  return (
    <div className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200'>
      <div>
        {(isMobile && isSearchPage) ? (
          <Link 
            href="/" 
            className='flex justify-center items-center h-full p-2 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md'
          >
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button className='flex justify-center items-center h-full p-3 group-focus-within:text-primary-200'>
            <IoSearch size={22} />
          </button>
        )}
      </div>
      <div className='w-full h-full'>
        {!isSearchPage ? (
          // not in search page
          <div 
            onClick={redirectToSearchPage} 
            className='w-full h-full flex items-center cursor-pointer'
          >
            <TypeAnimation
              sequence={[
                'Search "milk"',
                1000,
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "panner"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "curd"',
                1000,
                'Search "rice"',
                1000,
                'Search "egg"',
                1000,
                'Search "chips"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          // when on search page
          <div className='w-full h-full'>
            <input
              type='text'
              placeholder='Search for atta dal and more.'
              autoFocus
              defaultValue={searchText}
              className='bg-transparent w-full h-full outline-none'
              onChange={handleOnChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Search