import { createContext, useContext, useState, useCallback } from 'react';
import AlertContainer from './AlertContainer';

type Status = 'success' | 'warning' | 'error';

interface AlertItem {
  id: number;
  status: Status;
  message: string;
  title?: string;
}

interface AlertContextType {
  // Added optional title for more detailed system feedback
  showAlert: (status: Status, message: string, title?: string) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used inside AlertProvider');
  return context;
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const removeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = useCallback(
    (status: Status, message: string, title?: string) => {
      const id = Date.now();

      // Changed from replacing the array to spreading the previous state
      // This allows multiple alerts to stack in the UI
      setAlerts((prev) => [...prev, { id, status, message, title }]);

      // Auto-clear logic remains, but now handles individual IDs in the queue
      setTimeout(() => {
        removeAlert(id);
      }, 3000);
    },
    [removeAlert],
  );

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {/* The container handles the visual stacking 
          while the provider handles the data stream.
      */}
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />
    </AlertContext.Provider>
  );
};
