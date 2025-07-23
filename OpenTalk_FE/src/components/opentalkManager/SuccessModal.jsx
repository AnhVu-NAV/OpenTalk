import React from "react";

function SuccessDialog({ show, onClose, title = "Success", message = "Request successfully sent" }) {
  if (!show) return null;

  return (
    <div className="success-dialog-overlay">
      <div className="success-dialog-content">
        <div className="success-dialog-icon">
          <svg width="76" height="76" viewBox="0 0 76 76">
            <circle cx="38" cy="38" r="38" fill="#57C278"/>
            <path d="M23 39.5L34 50.5L53 29.5" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="success-dialog-title">{title}</div>
        <div className="success-dialog-message">{message}</div>
        <button className="success-dialog-btn" onClick={onClose}>OK</button>
      </div>
      <style>{`
        .success-dialog-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.20);
          z-index: 9999;
          display: flex; align-items: center; justify-content: center;
        }
        .success-dialog-content {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 6px 32px rgba(0,0,0,0.10);
          padding: 40px 40px 24px 40px;
          min-width: 320px;
          max-width: 95vw;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: popIn 0.25s cubic-bezier(.31,1.26,.47,1.35) both;
        }
        @keyframes popIn {
          from {transform: scale(0.75);}
          to {transform: scale(1);}
        }
        .success-dialog-icon {
          margin-bottom: 24px;
        }
        .success-dialog-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #222;
          margin-bottom: 7px;
        }
        .success-dialog-message {
          color: #555;
          font-size: 1rem;
          margin-bottom: 32px;
        }
        .success-dialog-btn {
          padding: 10px 32px;
          background: #2ca748;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1.09rem;
          font-weight: 600;
          transition: background 0.16s;
          cursor: pointer;
        }
        .success-dialog-btn:hover, .success-dialog-btn:focus {
          background: #178034;
        }
      `}</style>
    </div>
  );
}

export default SuccessDialog;
