import React, { useState, useEffect } from 'react';
import { FaTimes, FaBuilding, FaCheck } from 'react-icons/fa';
import './BranchFormModal.css';

const BranchFormModal = ({ isOpen, toggle, onSubmit, initialData, error }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setIsSubmitting(false);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim() });
      if (!error) {
        setName('');
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setName('');
    toggle();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="branch-modal">
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              <FaBuilding />
            </div>
            <h2 className="modal-title">
              {initialData ? 'Edit Branch' : 'Create New Branch'}
            </h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            disabled={isSubmitting}
            type="button"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="branchName" className="form-label">
                Branch Name
                <span className="required-asterisk">*</span>
              </label>
              <div className="input-container">
                <input
                  id="branchName"
                  type="text"
                  className={`form-input ${error ? 'error' : ''}`}
                  placeholder="Enter branch name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  maxLength={100}
                />
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <div className="form-hint">
                Choose a descriptive name for your branch location
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={!name.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FaCheck />
                  {initialData ? 'Update Branch' : 'Create Branch'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchFormModal;
