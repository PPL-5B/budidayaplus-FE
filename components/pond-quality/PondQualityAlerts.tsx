'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { formatParameterName } from '@/components/pond-quality/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';


interface Alert {
  parameter: string;
  actual_value: number;
  target_value: number;
  status: string;
}

interface PondAlertPopupProps {
  alerts: Alert[];
  onClose?: () => void; // OCP: Callback agar cara menutup popup bisa dikustom
}

// Custom Hook untuk mengelola state open
export const useAlertState = (alerts: Alert[]) => {
  const [open, setOpen] = useState<boolean>(alerts.length > 0);

  useEffect(() => {
    setOpen(alerts.length > 0);
  }, [alerts]);

  return { open, setOpen };
};

// Komponen AlertItem dipisahkan
export const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => (
  <div className="p-2 bg-red-100 rounded-md">
    <p className="font-semibold">{formatParameterName(alert.parameter)}</p>
    <p>Actual: {alert.actual_value}</p>
    <p>Target: {alert.target_value}</p>
    <p className="text-red-500">Status: {alert.status}</p>
  </div>
);

// PondAlertPopup dengan refaktor (OCP + Custom Hook)
const PondAlertPopup: React.FC<PondAlertPopupProps> = ({ alerts, onClose }) => {
  const { open, setOpen } = useAlertState(alerts);

  // Optimisasi: Menggunakan useCallback agar handleClose tidak dibuat ulang setiap render
  const handleClose = useCallback(() => {
    setOpen(false);
    if (onClose) onClose();
  }, [setOpen, onClose]); // Sekarang setOpen juga ada dalam dependensi
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-6 h-6" /> ALERT: Pond Quality Issue
          </DialogTitle>
          <button
            aria-label="close"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <AlertItem key={index} alert={alert} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PondAlertPopup;
