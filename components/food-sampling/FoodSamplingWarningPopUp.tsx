import React from 'react';
import { X } from 'lucide-react';

interface FoodSamplingWarningPopupProps {
  onClose: () => void;
}

const FoodSamplingWarningPopup: React.FC<FoodSamplingWarningPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-[#EAF0FF] rounded-lg p-6 shadow-md w-full max-w-xs mx-auto"
        data-testid="popup-warning"
      >
        {/* Icon Bulat */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center">
            <X className="w-5 h-5 text-purple-400" />
          </div>
        </div>

        {/* Judul */}
        <h2 className="text-center text-lg font-semibold text-neutral-800">Indikator Tidak Sehat!</h2>

        {/* Deskripsi */}
        <p className="text-center text-sm text-neutral-600 mt-1">
          Maksimal kuantitas makanan 1000!
        </p>

        {/* Tombol */}
        <button
          onClick={onClose}
          className="mt-5 w-full bg-[#2154C5] hover:bg-[#1A3F96] text-white font-semibold py-2 rounded-md text-sm"
        >
          Saya Paham
        </button>
      </div>
    </div>
  );
};

export default FoodSamplingWarningPopup;
