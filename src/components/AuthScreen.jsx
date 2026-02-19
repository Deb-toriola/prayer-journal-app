import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AppIcon from './AppIcon';

export default function AuthScreen({ onSignIn, onSignUp, onResetPassword, error, clearError }) {
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    if (view === 'login') {
      await onSignIn(email, password);
    } else if (view === 'signup') {
      const ok = await onSignUp(email, password);
      if (ok) setSignupDone(true);
    } else if (view === 'reset') {
      const ok = await onResetPassword(email);
      if (ok) setResetSent(true);
    }
    setLoading(false);
  };

  const switchView = (v) => {
    clearError();
    setView(v);
    setResetSent(false);
    setSignupDone(false);
    setPassword('');
  };

  return (
    <div className="auth-screen">
      <div className="auth-container">

        {/* App branding */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <AppIcon size={48} />
          </div>
          <h1 className="auth-brand-name">Prayer Journal</h1>
          <p className="auth-brand-tagline">A sacred space for your conversations with God</p>
        </div>

        {/* Card */}
        <div className="auth-card">

          {/* Back button (for reset view) */}
          {view !== 'login' && !signupDone && !resetSent && (
            <button className="auth-back-btn" onClick={() => switchView('login')}>
              <ArrowLeft size={16} />
              Back to sign in
            </button>
          )}

          {/* Title */}
          <h2 className="auth-card-title">
            {view === 'login' && 'Welcome back'}
            {view === 'signup' && 'Create your account'}
            {view === 'reset' && 'Reset password'}
          </h2>

          {/* Success states */}
          {signupDone && (
            <div className="auth-success">
              <div className="auth-success-icon">✉️</div>
              <p className="auth-success-title">Check your email</p>
              <p className="auth-success-sub">
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back to sign in.
              </p>
              <button className="auth-link-btn" onClick={() => switchView('login')}>
                Back to sign in
              </button>
            </div>
          )}

          {resetSent && (
            <div className="auth-success">
              <div className="auth-success-icon">📬</div>
              <p className="auth-success-title">Reset email sent</p>
              <p className="auth-success-sub">
                Check your inbox at <strong>{email}</strong> for a password reset link.
              </p>
              <button className="auth-link-btn" onClick={() => switchView('login')}>
                Back to sign in
              </button>
            </div>
          )}

          {/* Form */}
          {!signupDone && !resetSent && (
            <form className="auth-form" onSubmit={handleSubmit}>

              {/* Error */}
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    className="auth-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password (not shown for reset) */}
              {view !== 'reset' && (
                <div className="auth-field">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      className="auth-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={view === 'signup' ? 'At least 6 characters' : 'Your password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={view === 'signup' ? 6 : undefined}
                      autoComplete={view === 'signup' ? 'new-password' : 'current-password'}
                    />
                    <button
                      type="button"
                      className="auth-show-pw"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot password link */}
              {view === 'login' && (
                <button
                  type="button"
                  className="auth-forgot-btn"
                  onClick={() => switchView('reset')}
                >
                  Forgot password?
                </button>
              )}

              {/* Submit */}
              <button className="auth-submit-btn" type="submit" disabled={loading}>
                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>
                    {view === 'login' && 'Sign In'}
                    {view === 'signup' && 'Create Account'}
                    {view === 'reset' && 'Send Reset Link'}
                  </>
                )}
              </button>

              {/* Switch view */}
              <div className="auth-switch">
                {view === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button type="button" className="auth-switch-btn" onClick={() => switchView('signup')}>
                      Sign up
                    </button>
                  </>
                ) : view === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <button type="button" className="auth-switch-btn" onClick={() => switchView('login')}>
                      Sign in
                    </button>
                  </>
                ) : null}
              </div>
            </form>
          )}
        </div>

        <p className="auth-footer">
          🙏 Your prayers are private and secure
        </p>
      </div>
    </div>
  );
}
