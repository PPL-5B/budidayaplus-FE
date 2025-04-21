// app/contact-us/page.tsx
import AboutUs from '@/components/about-us/aboutus';

export default function AboutUS() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className='text-3xl leading-7 font-semibold mt-5 text-[#2154C5]'>Mengenal BudidayaPlus</h1>
      <div className="max-w-md mx-auto mt-5">
        <AboutUs />
      </div>
    </div>
  );
}