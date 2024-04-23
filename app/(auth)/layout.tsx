import React from 'react'


interface layoutProps {
    children: React.ReactNode
}
function layout({children}: layoutProps) {
  return (
    <div className='flex items-center justify-center h-full'>
      {children}
    </div>
  )
}

export default layout
