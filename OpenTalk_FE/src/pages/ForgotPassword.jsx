import { useState } from "react"
import authApi from "../api/authApi"
import SuccessToast from "../components/SuccessToast/SuccessToast"
import styles from "./styles/module/ForgotPassword.module.css"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")

  const showToast = (msg, type = "success") => {
    setToastMessage(msg)
    setToastType(type)
    setToastVisible(true)
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await authApi.forgetPassword(email)
      showToast(res.data.message, "success")
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again!"
      showToast(msg, "error")
      console.error(err)
    }
  }

  return (
      <>
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
                <h1 className={styles.title}>Forgot Password</h1>
                <p className={styles.subtitle}>Enter your email to receive a password reset link</p>
              </div>

              <hr className={styles.divider} />

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <div className={styles.inputIcon}>📧</div>
                  <input
                      type="email"
                      name="email"
                      className={styles.input}
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleChange}
                      required
                  />
                </div>

                <button type="submit" className={styles.submitButton}>
                  Send Reset Link
                </button>
              </form>

              <p className={styles.footer}>
                Remember your password?{" "}
                <a href="/login" className={styles.footerLink}>
                  Back to login
                </a>
              </p>
            </div>

            <div className={styles.rightPanel}></div>
          </div>
        </div>

        <SuccessToast
            message={toastMessage}
            isVisible={toastVisible}
            type={toastType}
            onClose={() => setToastVisible(false)}
        />
      </>
  )
}
