import React, { useState } from 'react';
import authApi from '../api/authApi';
import SuccessToast from '../components/SuccessToast/SuccessToast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.forgetPassword(email);
      showToast(res.data.message, 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again!';
      showToast(msg, 'error');
      console.error(err);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="bg-white p-5 shadow rounded" style={{ width: '100%', maxWidth: 400 }}>
          <div className="text-center mb-4">
            <h5 className="fw-bold">Forgot Password</h5>
            <p className="text-muted" style={{ fontSize: 14 }}>
              Enter your email to receive a password reset link
            </p>
          </div>

          <hr className="my-4" />

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Email<span className="text-danger">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-dark w-100">Send Reset Link</button>
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