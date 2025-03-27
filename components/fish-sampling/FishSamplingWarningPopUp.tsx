import React from 'react';

interface FishSamplingWarningPopupProps {
  onClose: () => void;
  onShowDetail: () => void;
  showDetail: boolean;
  errorMessages: string[];
}

const FishSamplingWarningPopup: React.FC<FishSamplingWarningPopupProps> = ({
  onClose,
  onShowDetail,
  showDetail,
  errorMessages,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
        <div className="text-3xl mb-2">⚠️</div>
        <h2 className="text-lg font-bold">Indikator Abnormal!</h2>
        <p className="text-sm text-gray-600">Lihat detail untuk melihat faktor penyebabnya</p>

        {showDetail && (
          <div className="mt-3 text-sm font-medium">
            <ul className="list-disc list-inside text-left">
              {errorMessages.map((message) => (
                <li key={message} className="text-red-600">{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-4 border-t pt-3">
          <button onClick={onClose} className="text-black font-medium">Tutup</button>
          <button onClick={onShowDetail} className="text-red-500 font-medium">Lihat Detail</button>
        </div>
      </div>
    </div>
  );
};

export default FishSamplingWarningPopup;