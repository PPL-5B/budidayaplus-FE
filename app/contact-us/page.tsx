import ContactForm from '@/components/contact-us/WhatsAppContactForm';

export default function ContactUs() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className='text-3xl leading-7 font-semibold mt-5 text-[#2154C5]'>Hubungi Kami</h1>
      <div className="max-w-md mx-auto mt-5">
        <ContactForm />
      </div>
    </div>
  );
}