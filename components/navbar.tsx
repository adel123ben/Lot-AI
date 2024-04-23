import React from 'react'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import Mobilsidbar from './mobil-sidbar'
import { getApiLimitCount } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'

const Navbar = async  () => {
  const apiLimitCountPromise = getApiLimitCount();
  const isPro = await checkSubscription();
  return (
    <div className='flex items-center p-4'>
     <Mobilsidbar isPro={isPro} apiLimitCount={await apiLimitCountPromise} />
      <div className='flex w-full justify-end'>
        <UserButton afterSignOutUrl='/' />
      </div>
    </div>
  )
}

export default Navbar
