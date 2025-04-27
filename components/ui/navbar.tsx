'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useProfile } from '@/hooks/useProfile'

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Pond', href: '/pond' },
  { name: 'Task', href: '/task' },
  { name: 'Profile', href: '/profile' },
]

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const handleNavigation = (href: string) => {
    router.push(href)
  }
  const profile = useProfile()
  const username = profile?.user.phone_number || ''

  if (pathname.startsWith('/auth')) return null

  return (
    <div className='flex justify-around items-center h-full w-full'>
      {menuItems.map((item) => {
        const isActive = item.href === '/profile' ? pathname.startsWith(item.href) : pathname === item.href
        return isActive ? (
          <Button key={item.name} className='bg-white hover:bg-white'>
            <Image 
              src={`/navbar/pressed/${item.name}.svg`} 
              height={50} 
              width={50} 
              alt={item.name} 
              className='w-8 h-8' 
            />
            <p className='text-[#2154C5] ml-2'>{item.name}</p>
          </Button>
        ) : (
          <Button 
            key={item.name} 
            onClick={() => handleNavigation(item.href === '/profile' ? `/profile/${username}` : item.href)} 
            size={'icon'} 
            className='bg-transparent hover:bg-transparent'
          >
            <Image 
              src={`/navbar/idle/${item.name}.svg`} 
              height={50} 
              width={50} 
              alt={item.name} 
              className='w-8 h-8' 
            />
          </Button>
        )
      })}
    </div>
  )
}

export default Navbar