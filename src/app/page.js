import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ProductsSection from '@/components/ProductsSection'
import WhyGlutenFreeSection from '@/components/WhyGlutenFreeSection'
import GallerySection from '@/components/GallerySection'
import TestimonialsSection from '@/components/TestimonialsSection'
import PricingSection from '@/components/PricingSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <WhyGlutenFreeSection />
      <GallerySection />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </>
  )
}
