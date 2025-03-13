import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, X } from 'lucide-react';

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

export const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => (
  <div className="p-2 bg-red-100 rounded-md">
    <p className="font-semibold">{alert.parameter}</p>
    <p>Actual: {alert.actual_value}</p>
    <p>Target: {alert.target_value}</p>
    <p className="text-red-500">Status: {alert.status}</p>
  </div>
);

const PondAlertPopup: React.FC<PondAlertPopupProps> = ({ alerts, onClose }) => {
  const [open, setOpen] = useState<boolean>(alerts.length > 0);

  useEffect(() => {
    setOpen(alerts.length > 0);
  }, [alerts]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

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
