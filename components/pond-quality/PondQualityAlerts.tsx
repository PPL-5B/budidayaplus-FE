'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Definisi tipe untuk Alert
interface Alert {
  id: string; // Menambahkan ID unik
  parameter: string;
  actual_value: number;
  target_value: number;
  status: string;
}

// Definisi tipe untuk props komponen utama
interface PondAlertPopupProps {
  alerts: Alert[];
  onClose?: () => void; // Callback opsional untuk menangani event tutup popup
}

// Fungsi pengganti `formatParameterName` yang sebelumnya ada di utils.ts
const formatParameterName = (param: string): string => {
  return param.replace(/_/g, ' ').toUpperCase(); // Mengubah snake_case menjadi huruf besar dengan spasi
};

// Custom Hook untuk mengelola state "open" berdasarkan alert yang diterima
export const useAlertState = (alerts: Alert[]) => {
  const [open, setOpen] = useState<boolean>(alerts.length > 0);

  useEffect(() => {
    setOpen(alerts.length > 0);
  }, [alerts]);

  return { open, setOpen };
};

// Komponen AlertItem yang digunakan dalam daftar alert
export const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => (
  <div className="p-2 bg-red-100 rounded-md">
    <p className="font-semibold">{formatParameterName(alert.parameter)}</p>
    <p>Actual: {alert.actual_value}</p>
    <p>Target: {alert.target_value}</p>
    <p className="text-red-500">Status: {alert.status}</p>
  </div>
);

// Komponen utama untuk menampilkan popup alert
const PondAlertPopup: React.FC<PondAlertPopupProps> = ({ alerts, onClose }) => {
  const { open, setOpen } = useAlertState(alerts);

  // Optimisasi: Menggunakan useCallback agar handleClose tidak dibuat ulang setiap render
  const handleClose = useCallback(() => {
    setOpen(false);
    if (onClose) onClose();
  }, [setOpen, onClose]);

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
          {alerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PondAlertPopup;
