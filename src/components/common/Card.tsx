import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footer?: React.ReactNode;
  badge?: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  icon,
  className = '',
  bodyClassName = 'p-6',
  headerClassName = 'px-6 py-4 border-b border-slate-100',
  footer,
  badge,
  hoverEffect = false,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm transition-all overflow-hidden ${
        hoverEffect ? 'hover:shadow-md hover:border-slate-300' : ''
      } ${className}`}
    >
      {(title || subtitle || action || icon || badge) && (
        <div className={`flex items-center justify-between gap-4 ${headerClassName}`}>
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="flex-shrink-0 p-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-200">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {title && <h3 className="font-semibold text-slate-900 truncate text-base">{title}</h3>}
                {badge && <div>{badge}</div>}
              </div>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}

      <div className={bodyClassName}>{children}</div>

      {footer && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};
