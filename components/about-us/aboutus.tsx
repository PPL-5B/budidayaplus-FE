'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionItem } from '@/components/ui/accordion';

const AboutUs = () => {
  const boutUS = [
    {
      title: 'Tentang BudidayaPlus',
      explanation: 'Dikembangkan oleh PT Dimensi Kreasi Nusantara sejak tahun 2024, aplikasi BudidayaPlus yang kami kembangkan ini bertujuan untuk membantu para peternak lele untuk meningkatkan produktivitas dan profit usaha mereka. \n\n Kami berharap dengan aplikasi yang kami rancang ini, produktivitas dan profit pengguna kami akan meningkat. \n\n Hormat kami, PT Dimensi Kreasi Nusantara'
    },
  ];

  return (
    <Card className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Tentang BudidayaPlus</h2>
      <Accordion>
        {boutUS.map((boutUS, index) => (
          <AccordionItem key={index} title={boutUS.title}>
            <p className="whitespace-pre-line">{boutUS.explanation}</p>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
};

export default AboutUs;