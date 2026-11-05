import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const Alert = ({ type = 'info', message }) => {
  const styles = {
    error: 'bg-red-900/20 border-red-500 text-red-200',
    success: 'bg-green-900/20 border-green-500 text-green-200',
    info: 'bg-blue-900/20 border-blue-500 text-blue-200',
    warning: 'bg-yellow-900/20 border-yellow-500 text-yellow-200'
  };

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
    warning: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-start space-x-3 p-4 rounded-lg border ${styles[type]}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Alert;
