"use client";

import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Sidbar from './sidbar';


interface MobilsidbarProps {
  apiLimitCount: number;
  isPro: boolean;
}
const  Mobilsidbar = ({
  apiLimitCount = 0,
  isPro = false
}: MobilsidbarProps) => {
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]) 
  if(!isMounted) {
    return null
  }
  return (
   <Sheet>
    <SheetTrigger>
      <Button variant='ghost' size='icon' className='md:hidden'>
        <Menu />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className='p-0'>
        <Sidbar isPro={isPro} apiLimitCount={apiLimitCount} />
    </SheetContent>
   </Sheet>
       
   
  )
}

export default Mobilsidbar
