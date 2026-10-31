import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertBannerProps {
  type?: AlertType;
  title?: string;
  message: React.ReactNode;
  dismissible?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  action,
  className = '',
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const styles = {
    info: {
      container: 'bg-brand-50 border-brand-200 text-brand-900',
      icon: <Info className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />,
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />,
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />,
    },
  };

  const current = styles[type];

  return (
    <div
      className={`rounded-xl border p-4 shadow-sm flex items-start gap-3 transition-all ${current.container} ${className}`}
    >
      {current.icon}
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-sm leading-5 mb-0.5">{title}</h4>}
        <div className="text-xs leading-relaxed opacity-95">{message}</div>
        {action && <div className="mt-2.5">{action}</div>}
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
