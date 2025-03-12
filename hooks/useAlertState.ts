import { useState, useEffect } from "react";

export function useAlertState(alerts: any[]) {
  const [open, setOpen] = useState<boolean>(alerts.length > 0);

  useEffect(() => {
    setOpen(alerts.length > 0);
  }, [alerts]);

  return { open, setOpen };
}
