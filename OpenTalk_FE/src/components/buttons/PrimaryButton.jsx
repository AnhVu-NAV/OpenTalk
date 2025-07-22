import React from 'react';

export default function PrimaryButton({
  label,
  onClick,
  disabled = false,
  loading = false,
  size = 'medium',
  fullWidth = false,
  type = 'button',
  className = ''
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`primary-button ${size} ${fullWidth ? 'full-width' : ''} ${disabled || loading ? 'disabled' : ''} ${className}`}
    >
      {loading ? 'Loading...' : label}
      <style jsx>{`
        .primary-button {
          background-color: #002E1E;
          color: white;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .primary-button:hover {
          background-color: #004B34;
        }

        .primary-button.disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .primary-button.small {
          font-size: 12px;
          padding: 6px 12px;
        }

        .primary-button.medium {
          font-size: 14px;
          padding: 8px 16px;
        }

        .primary-button.large {
          font-size: 16px;
          padding: 10px 20px;
        }

        .primary-button.full-width {
          width: 100%;
        }
      `}</style>
    </button>
  );
}
