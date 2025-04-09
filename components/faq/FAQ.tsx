'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionItem } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: 'Apa itu BudidayaPlus?',
      answer: 'BudidayaPlus adalah aplikasi pendamping digital untuk pembudidaya ikan lele. \n\nMisi kami adalah membantu pembudidaya meningkatkan hasil panen dan keuntungan melalui pengelolaan berbasis data yang mudah dipahami. \n\nAplikasi ini dikembangkan oleh tim PT Dimensi Kreasi Nusantara.'
    },
    {
      question: 'Apa fitur BudidayaPlus?',
      answer: '1. Pantau kondisi kolam dengan mudah\n2. Lacak pertumbuhan ikan\n3. Kelola pemberian pakan dengan tepat\n4. Catat dan evaluasi hasil panen'
    },
    {
      question: 'Testimoni Pengguna',
      answer: '"Berkat BudidayaPlus, hasil panen saya meningkat 30% dalam 3 bulan terakhir." \n- Pak Sugeng, Jawa Timur'
    }
  ];

  return (
    <Card className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Pertanyaan Umum</h2>
      <Accordion>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} title={faq.question}>
            <p className="whitespace-pre-line">{faq.answer}</p>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
};

export default FAQ;