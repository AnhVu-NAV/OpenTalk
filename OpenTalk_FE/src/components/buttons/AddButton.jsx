import React from 'react';

export default function OutlineButton({
  label,
  onClick,
  icon = null,
  disabled = false,
  loading = false,
  size = 'medium',
  fullWidth = false,
  type = 'button',
  iconPosition = 'left',
  className = ''
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`outline-button ${size} ${fullWidth ? 'full-width' : ''} ${disabled || loading ? 'disabled' : ''} ${className}`}
    >
      {icon && iconPosition === 'left' && <span className="icon">{icon}</span>}
      {loading ? 'Loading...' : label}
      {icon && iconPosition === 'right' && <span className="icon">{icon}</span>}

      <style jsx>{`
        .outline-button {
          background-color: #f5f5f5;
          color: #333;
          font-weight: 500;
          font-size: 14px;
          padding: 8px 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .outline-button:hover {
          background-color: #eaeaea;
        }

        .outline-button.disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .outline-button.small {
          font-size: 12px;
          padding: 6px 12px;
        }

        .outline-button.large {
          font-size: 16px;
          padding: 10px 20px;
        }

        .outline-button.full-width {
          width: 100%;
        }

        .icon {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #333;
        }
      `}</style>
    </button>
  );
}
