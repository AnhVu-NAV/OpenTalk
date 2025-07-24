import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import SuccessToast from '../components/SuccessToast/SuccessToast';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    } else {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords don't match", 'error');
      return;
    }

    try {
      const response = await authApi.resetPassword({ token, newPassword: password });
      showToast(response.data.message, 'success');
      setTimeout(() => navigate('/login'));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. Please try again.';
      showToast(msg, 'error');
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      showToast('Invalid or expired token', 'error');
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <>
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="bg-white p-5 shadow rounded" style={{ width: '100%', maxWidth: 400 }}>
          <div className="text-center mb-4">
            <h5 className="fw-bold">Reset Your Password</h5>
            <p className="text-muted" style={{ fontSize: 14 }}>
              Please enter your new password.
            </p>
          </div>

          <hr className="my-4" />

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                New Password<span className="text-danger">*</span>
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your new password"
                value={password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Confirm Password<span className="text-danger">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-dark w-100">Reset Password</button>
          </form>

          <p className="text-center mt-3 small">
            Remember your password? <a href="/login">Back to login</a>
          </p>
        </div>
      </div>

      <SuccessToast
        message={toastMessage}
        isVisible={toastVisible}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />
    </>
  );
}