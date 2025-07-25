import {useEffect, useState} from "react"
import authApi from "../api/authApi"
import { saveAuthTokens } from "../helper/auth"
import SuccessToast from "../components/SuccessToast/SuccessToast"
import styles from "./styles/module/LoginForm.module.css"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })

  // State cho toast
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")
  const [generatedCode, setGeneratedCode] = useState("")
  const [inputCode, setInputCode] = useState("")

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase()
    setGeneratedCode(code)
  }

  useEffect(() => {
    generateCode()
  }, [])

  const showToast = (msg, type = "success") => {
    setToastMessage(msg)
    setToastType(type)
    setToastVisible(true)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (inputCode.trim().toUpperCase() !== generatedCode) {
        showToast("Incorrect verification code", "error")
        return
      }
      const res = await authApi.login(form)
      const data = res.data.result
      saveAuthTokens(data)
      showToast("Login successful!", "success")
      setTimeout(() => (window.location.href = "/"), 1000)
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again!"
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
                <div className={styles.avatar}></div>
                <h1 className={styles.title}>Login</h1>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <div className={styles.inputIcon}>📧</div>
                  <input
                      type="text"
                      name="email"
                      className={styles.input}
                      placeholder="Email Address"
                      value={form.email}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputIcon}>🔒</div>
                  <input
                      type="password"
                      name="password"
                      className={styles.input}
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className={styles.verificationGroup}>
                  <div className={`${styles.inputGroup} ${styles.verificationInput}`}>
                    <div className={styles.inputIcon}>🔐</div>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Verification code"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        required
                    />
                  </div>
                  <div className={styles.verificationCode} onClick={generateCode} title="Click to refresh">
                    {generatedCode}
                  </div>
                </div>

                <button type="submit" className={styles.loginButton}>
                  Login
                </button>
              </form>

              <div className={styles.footer}>
                <a href="/forget-password" className={styles.forgotPasswordLink}>
                  Forget Password?
                </a>
                <a href="/register" className={styles.registerLink}>
                  Register
                </a>
              </div>
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
