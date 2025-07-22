import React, { useState } from "react";
import authApi from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    agree: false,
  });
  const [formErrors, setFormErrors] = useState({});      // Server-side field errors
  const [generalError, setGeneralError] = useState("");  // Non-field error
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    // clear field error when user types
    setFormErrors({ ...formErrors, [name]: null });
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agree) {
      alert("You must agree to the terms.");
      return;
    }

    // reset previous errors
    setFormErrors({});
    setGeneralError("");

    try {
      const response = await authApi.register({
        fullname: form.fullname,
        username: form.username,
        email: form.email,
        password: form.password,
      });

      const { code, message } = response.data;
      if (code === 0) {
        alert("Registered successfully! Please login.");
        navigate("/login");
      } else {
        setGeneralError(message);
      }

    } catch (err) {
      if (err.response && err.response.status === 400 && typeof err.response.data === "object") {
        setFormErrors(err.response.data);
      } else if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("An unexpected error occurred during registration.");
      }
      console.error(err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="bg-white p-5 shadow rounded"
        style={{ width: "100%", maxWidth: 400 }}
      >
        {generalError && (
          <div className="alert alert-danger">
            {generalError}
          </div>
        )}

        <h5 className="fw-bold text-center mb-4">Create An Account</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              Full Name<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="fullname"
              className={`form-control ${formErrors.fullname ? "is-invalid" : ""}`}
              placeholder="Enter your name"
              value={form.fullname}
              onChange={handleChange}
              required
            />
            {formErrors.fullname && (
              <div className="invalid-feedback">
                {formErrors.fullname}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              User Name<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="username"
              className={`form-control ${formErrors.username ? "is-invalid" : ""}`}
              placeholder="Enter account username"
              value={form.username}
              onChange={handleChange}
              required
            />
            {formErrors.username && (
              <div className="invalid-feedback">
                {formErrors.username}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Email<span className="text-danger">*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {formErrors.email && (
              <div className="invalid-feedback">
                {formErrors.email}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Password<span className="text-danger">*</span>
            </label>
            <input
              type="password"
              name="password"
              className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {formErrors.password && (
              <div className="invalid-feedback">
                {formErrors.password}
              </div>
            )}
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            <label className="form-check-label">
              I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Sign up
          </button>
        </form>

        <p className="text-center mt-3 small">
          Already have an account? <a href="/login">Login here.</a>
        </p>
      </div>
    </div>
  );
}