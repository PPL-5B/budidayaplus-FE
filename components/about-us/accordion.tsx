import React from "react";

const AboutUs = () => {
  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <details className="w-full max-w-2xl rounded-xl shadow-md group transition-all duration-300">
        <summary className="flex justify-between items-center px-6 py-4 text-xl font-bold text-white bg-[#2254C5] cursor-pointer list-none rounded-xl">
          <span className="text-white text-center">Tentang Kami</span>

          <svg
            className="w-10 h-8 ml-2 transition-transform duration-300 group-open:rotate-180"
            fill="white"
            viewBox="0 0 20 20"
          >
            <path d="M10 12l-6-6h12l-6 6z" />
          </svg>
        </summary>

        <div className="bg-[#F2F6FE] px-6 pb-6 pt-4 text-gray-700 rounded-b-xl space-y-4 text-base">
          <p>
            BudidayaPlus adalah aplikasi pendamping digital untuk pembudidaya ikan lele.
          </p>

          <div>
            <p><span className="font-semibold">Dikembangkan oleh:</span> PT Dimensi Kreasi Nusantara</p>
            <p><span className="font-semibold">Sejak:</span> 2024</p>
          </div>

          <div>
            <p>Aplikasi ini dirancang khusus untuk membantu para peternak lele dalam:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Meningkatkan produktivitas budidaya</li>
              <li>Mengoptimalkan manajemen usaha</li>
              <li>Meningkatkan profit bisnis</li>
            </ul>
          </div>

          <p className="italic">
            "Menjadi solusi teknologi yang efektif dan efisien bagi pembudidaya lele Indonesia"
          </p>

          <div className="text-right">
            <p className="font-semibold">Hormat kami,</p>
            <p>Tim BudidayaPlus</p>
          </div>
        </div>
      </details>
    </div>
  );
};

export default AboutUs;