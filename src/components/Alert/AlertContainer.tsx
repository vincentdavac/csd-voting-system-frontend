import { useEffect } from 'react';
import Alert from './index';

interface AlertItem {
  id: number;
  status: 'success' | 'warning' | 'error';
  title?: string;
  message: string;
}

interface AlertContainerProps {
  alerts: AlertItem[];
  removeAlert: (id: number) => void;
}

const AlertContainer = ({ alerts, removeAlert }: AlertContainerProps) => {
  useEffect(() => {
    const timers = alerts.map(
      (alert) =>
        setTimeout(() => {
          removeAlert(alert.id);
        }, 3000), // 3 seconds
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [alerts, removeAlert]);

  return (
    <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          status={alert.status}
          title={alert.title}
          message={alert.message}
          onClose={() => removeAlert(alert.id)} // manual remove
        />
      ))}
    </div>
  );
};

export default AlertContainer;
