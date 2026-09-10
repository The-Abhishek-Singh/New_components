import ClienteleMarquee from '@/src/components/clientaleMarquee'
import SiteFooter from '@/src/components/footer'
import Navbar from '@/src/components/navbar'
import SelectedWorkSection from '@/src/components/selectedworksection'
import ServicesScrollSection from '@/src/components/service'
import TestimonialMarquee from '@/src/components/testimonial'
import React from 'react'

const page = () => {
  return (
    <div className='bg-black'>

    <Navbar />

       <div className=" h-52 w-full">
      
    </div>
  

    <SelectedWorkSection />
      <div className=" h-52 w-full">
      
    </div>

    <ClienteleMarquee />

    <ServicesScrollSection />

    <TestimonialMarquee />
           <div className=" h-52 w-full">
      
    </div>

   <SiteFooter />


    </div>
  )
}

export default page