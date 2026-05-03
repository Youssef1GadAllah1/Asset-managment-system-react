import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Card } from '../../components/common'
import { Logo } from '../../components/common/Logo'
import { Reveal } from '../../components/common/Reveal'
import { Mail, KeyRound, Lock, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react'

const STEPS = {
  EMAIL:    'email',
  OTP:      'otp',
  PASSWORD: 'password',
  DONE:     'done',
}

const API = '/api'

async function apiFetch(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

export const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep]         = useState(STEPS.EMAIL)
  const [email, setEmail]       = useState('')
  const [otp, setOtp]           = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef([])

  // Resend countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const clearError = () => setError('')

  /* ── Step 1: Send OTP ── */
  const handleSendOtp = async (e) => {
    e?.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiFetch('/auth/forgot-password', { email })
      setStep(STEPS.OTP)
      setCountdown(60)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── Step 2: Verify OTP ── */
  const handleVerifyOtp = async (e) => {
    e?.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter all 6 digits'); return }
    setError('')
    setLoading(true)
    try {
      await apiFetch('/auth/verify-otp', { email, otp: code })
      setStep(STEPS.PASSWORD)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── Step 3: Reset Password ── */
  const handleResetPassword = async (e) => {
    e?.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setError('')
    setLoading(true)
    try {
      await apiFetch('/auth/reset-password', { email, otp: otp.join(''), newPassword: password })
      setStep(STEPS.DONE)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── OTP input helpers ── */
  const handleOtpChange = (idx, val) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[idx] = digit
    setOtp(next)
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus()
    if (next.every(d => d !== '')) {
      // auto-submit when all digits entered
      setTimeout(() => handleVerifyOtp(null), 120)
    }
  }

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...otp]
    pasted.split('').forEach((d, i) => { next[i] = d })
    setOtp(next)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
    e.preventDefault()
  }

  const stepTitle = {
    [STEPS.EMAIL]:    'Forgot Password',
    [STEPS.OTP]:      'Check Your Email',
    [STEPS.PASSWORD]: 'Create New Password',
    [STEPS.DONE]:     'Password Reset!',
  }

  const stepIcon = {
    [STEPS.EMAIL]:    <Mail size={28} className="text-primary-600" />,
    [STEPS.OTP]:      <KeyRound size={28} className="text-primary-600" />,
    [STEPS.PASSWORD]: <Lock size={28} className="text-primary-600" />,
    [STEPS.DONE]:     <CheckCircle size={28} className="text-green-500" />,
  }

  const progressSteps = [STEPS.EMAIL, STEPS.OTP, STEPS.PASSWORD]
  const currentProgress = progressSteps.indexOf(step)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800
      flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Reveal direction="down">
          <div className="flex flex-col items-center mb-8 gap-2">
            <Logo size="lg" to={null} />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Asset Management System</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <Card className="overflow-hidden">

            {/* Progress bar */}
            {step !== STEPS.DONE && (
              <div className="flex gap-1 mb-6 -mx-6 -mt-6 px-6 pt-6">
                {progressSteps.map((s, i) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all duration-500
                      ${i <= currentProgress ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                  />
                ))}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30
                flex items-center justify-center flex-shrink-0">
                {stepIcon[step]}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{stepTitle[step]}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {step === STEPS.EMAIL    && 'Enter your email to receive a reset code'}
                  {step === STEPS.OTP      && `We sent a 6-digit code to ${email}`}
                  {step === STEPS.PASSWORD && 'Choose a strong new password'}
                  {step === STEPS.DONE     && 'Your password has been updated'}
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                rounded-xl text-red-700 dark:text-red-300 text-sm animate-slideDown">
                {error}
              </div>
            )}

            {/* ── Step 1: Email ── */}
            {step === STEPS.EMAIL && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearError() }}
                  placeholder="your@email.com"
                  autoFocus
                  required
                />
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Reset Code'}
                </Button>
              </form>
            )}

            {/* ── Step 2: OTP ── */}
            {step === STEPS.OTP && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6-digit OTP boxes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Enter 6-digit code
                  </label>
                  <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => otpRefs.current[idx] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 text-center text-2xl font-bold
                          border-2 border-gray-300 dark:border-gray-600 rounded-xl
                          focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none
                          dark:bg-gray-800 dark:text-gray-100
                          transition-all duration-200
                          hover:border-primary-400"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? 'Verifying…' : 'Verify Code'}
                </Button>

                {/* Resend */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-400">
                      Resend code in <span className="font-semibold text-primary-600">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setOtp(['','','','','','']); handleSendOtp() }}
                      className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700
                        font-medium transition-colors duration-200"
                    >
                      <RefreshCw size={14} />
                      Resend code
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* ── Step 3: New password ── */}
            {step === STEPS.PASSWORD && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearError() }}
                  placeholder="Min. 8 characters"
                  autoFocus
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); clearError() }}
                  placeholder="Repeat your new password"
                  required
                />

                {/* Password strength bar */}
                {password.length > 0 && (
                  <div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          password.length < 8  ? 'w-1/4 bg-red-500' :
                          password.length < 12 ? 'w-2/4 bg-yellow-500' :
                          'w-full bg-green-500'
                        }`}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${
                      password.length < 8  ? 'text-red-500' :
                      password.length < 12 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {password.length < 8 ? 'Too short' : password.length < 12 ? 'Good' : 'Strong'}
                    </p>
                  </div>
                )}

                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? 'Resetting…' : 'Reset Password'}
                </Button>
              </form>
            )}

            {/* ── Step 4: Done ── */}
            {step === STEPS.DONE && (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full
                  flex items-center justify-center mx-auto">
                  <CheckCircle size={44} className="text-green-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Your password has been reset successfully.
                  You can now sign in with your new password.
                </p>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </Button>
              </div>
            )}

            {/* Back link */}
            {step !== STEPS.DONE && (
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400
                    hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>
            )}
          </Card>
        </Reveal>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Next-Step · EVA Cosmetics Group
        </p>
      </div>
    </div>
  )
}
