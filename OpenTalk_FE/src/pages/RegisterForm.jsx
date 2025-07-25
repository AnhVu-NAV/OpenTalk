import { useState } from "react"
import { useNavigate } from "react-router-dom"
import authApi from "../api/authApi"
import styles from "./styles/module/RegisterForm.module.css"

export default function SignUp() {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    agree: false,
  })
  const [formErrors, setFormErrors] = useState({})
  const [generalError, setGeneralError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
    // clear field error when user types
    setFormErrors({ ...formErrors, [name]: null })
    setGeneralError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.agree) {
      alert("You must agree to the terms.")
      return
    }

    // reset previous errors
    setFormErrors({})
    setGeneralError("")

    try {
      const response = await authApi.register({
        fullname: form.fullname,
        username: form.username,
        email: form.email,
        password: form.password,
      })

      const { code, message } = response.data
      if (code === 0) {
        alert("Registered successfully! Please login.")
        navigate("/login")
      } else {
        setGeneralError(message)
      }
    } catch (err) {
      if (err.response && err.response.status === 400 && typeof err.response.data === "object") {
        setFormErrors(err.response.data)
      } else if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message)
      } else {
        setGeneralError("An unexpected error occurred during registration.")
      }
      console.error(err)
    }
  }

  return (
      <div className={styles.container}>
        <div className={styles.floatingElements}>
          <div className={styles.floatingShape}></div>
          <div className={styles.floatingShape}></div>
          <div className={styles.floatingShape}></div>
        </div>

        <div className={styles.floatingCard}>
          <div className={styles.leftPanel}>
            <div className={styles.header}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>💬</div>
                OpenTalk
              </div>
              <h1 className={styles.title}>Create An Account</h1>
            </div>

            {generalError && <div className={styles.errorAlert}>{generalError}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <div className={styles.inputIcon}>👤</div>
                <input
                    type="text"
                    name="fullname"
                    className={`${styles.input} ${formErrors.fullname ? styles.invalid : ""}`}
                    placeholder="Full Name"
                    value={form.fullname}
                    onChange={handleChange}
                    required
                />
                {formErrors.fullname && <div className={styles.errorMessage}>{formErrors.fullname}</div>}
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputIcon}>🏷️</div>
                <input
                    type="text"
                    name="username"
                    className={`${styles.input} ${formErrors.username ? styles.invalid : ""}`}
                    placeholder="User Name"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                {formErrors.username && <div className={styles.errorMessage}>{formErrors.username}</div>}
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputIcon}>📧</div>
                <input
                    type="email"
                    name="email"
                    className={`${styles.input} ${formErrors.email ? styles.invalid : ""}`}
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                {formErrors.email && <div className={styles.errorMessage}>{formErrors.email}</div>}
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputIcon}>🔒</div>
                <input
                    type="password"
                    name="password"
                    className={`${styles.input} ${formErrors.password ? styles.invalid : ""}`}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                {formErrors.password && <div className={styles.errorMessage}>{formErrors.password}</div>}
              </div>

              <div className={styles.checkboxGroup}>
                <input
                    className={styles.checkbox}
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={handleChange}
                />
                <label className={styles.checkboxLabel}>
                  I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className={styles.registerButton}>
                Sign up
              </button>
            </form>

            <p className={styles.footer}>
              Already have an account?{" "}
              <a href="/login" className={styles.footerLink}>
                Login here.
              </a>
            </p>
          </div>

          <div className={styles.rightPanel}></div>
        </div>
      </div>
  )
}
