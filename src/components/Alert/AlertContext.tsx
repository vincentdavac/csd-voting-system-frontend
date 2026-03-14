import { createContext, useContext, useState } from 'react';
import AlertContainer from './AlertContainer';

type Status = 'success' | 'warning' | 'error';

interface AlertItem {
  id: number;
  status: Status;
  message: string;
}

interface AlertContextType {
  showAlert: (status: Status, message: string) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used inside AlertProvider');
  return context;
};

export const AlertProvider = ({ children }: any) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = (status: Status, message: string) => {
    const id = Date.now();

    setAlerts([{ id, status, message }]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 3000);
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />
    </AlertContext.Provider>
  );
};
