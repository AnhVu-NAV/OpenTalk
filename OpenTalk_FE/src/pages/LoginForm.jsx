import React, { useState } from 'react';
import authApi from '../api/authApi';
import { saveAuthTokens } from '../helper/auth';
import SuccessToast from '../components/SuccessToast/SuccessToast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  // State cho toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await authApi.login(form);
      const data = res.data.result;
      saveAuthTokens(data);
      showToast('Login successful!', 'success');
      setTimeout(() => window.location.href = '/', 1000);
    } catch (err) {
      const msg = err.response?.data?.message
        || 'Login failed. Please try again!';
      showToast(msg, 'error');
      console.error(err);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="bg-white p-5 shadow rounded" style={{ width: '100%', maxWidth: 400 }}>
          <div className="text-center mb-4">
            <h5 className="fw-bold">Welcome Back</h5>
            <p className="text-muted" style={{ fontSize: 14 }}>
              Login to your account to continue
            </p>
          </div>

          <hr className="my-4" />

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Email<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Password<span className="text-danger">*</span>
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 text-end">
              <a href="/forget-password" className="text-decoration-none small">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-dark w-100">Login</button>
          </form>

          <p className="text-center mt-3 small">
            Don’t have an account? <a href="/register">Register now.</a>
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