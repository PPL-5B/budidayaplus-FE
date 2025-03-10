import React from 'react';

interface FoodSamplingWarningPopupProps {
  onClose: () => void;
  onShowDetail: () => void;
  showDetail: boolean;
}

const FoodSamplingWarningPopup: React.FC<FoodSamplingWarningPopupProps> = ({
  onClose,
  onShowDetail,
  showDetail,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80" data-testid="popup-warning">
        <div className="text-3xl mb-2">⚠️</div>
        <h2 className="text-lg font-bold">Indikator Tidak Sehat!</h2>
        <p className="text-sm text-gray-600">Lihat detail untuk melihat faktor penyebabnya</p>

        {showDetail && (
          <p className="mt-3 text-sm font-medium text-red-500">
            Maksimal kuantitas makanan adalah 1000!
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 mt-4 border-t pt-3">
          <button
            data-testid="close-button"
            onClick={onClose}
            className="text-black font-medium"
          >
            Tutup
          </button>
          <button
            data-testid="detail-button"
            onClick={onShowDetail}
            className="text-red-500 font-medium"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodSamplingWarningPopup;
