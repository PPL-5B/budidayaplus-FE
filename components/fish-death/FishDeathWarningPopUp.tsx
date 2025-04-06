import React from 'react';

interface FishDeathWarningPopupProps {
  message: string;
  onClose: () => void;
  onToggleDetail: () => void;
  showDetail: boolean;
}

const FishDeathWarningPopup: React.FC<FishDeathWarningPopupProps> = ({
  message,
  onClose,
  showDetail,
  onToggleDetail
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80" data-testid="popup-warning">
        <div className="text-3xl mb-2">⚠️</div>
        <h2 className="text-lg font-bold text-yellow-600">Peringatan!</h2>
        <p className="text-sm text-gray-600">Lihat detail untuk melihat penyebabnya</p>

        {showDetail && (
          <p className="mt-3 text-sm font-medium text-red-500">
            {message}
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
            onClick={onToggleDetail}
            className="text-red-500 font-medium"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default FishDeathWarningPopup;
