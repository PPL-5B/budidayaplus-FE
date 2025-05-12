import React from 'react';

interface FishSamplingWarningPopupProps {
  onClose: () => void;
  errorMessages: string[];
}

const FishSamplingWarningPopup: React.FC<FishSamplingWarningPopupProps> = ({
  onClose,
  errorMessages,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
        <div className="text-3xl mb-2">⚠️</div>
        <h2 className="text-lg font-bold">Indikator Abnormal!</h2>
        <ul className="mt-3 text-sm font-medium list-disc list-inside text-left text-red-600">
          {errorMessages.map((message) => (
            <li key={message} role="alert">{message}</li>
          ))}
        </ul>
        <div className="mt-4 border-t pt-3">
          <button onClick={onClose} className="text-black font-medium">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default FishSamplingWarningPopup;
