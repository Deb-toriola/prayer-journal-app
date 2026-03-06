import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AppIcon from './AppIcon';
import PrayingHands from './PrayingHands';

export default function AuthScreen({ onSignIn, onSignUp, onResetPassword, onUpdatePassword, error, clearError, isModal, onClose, initialView }) {
  const [view, setView] = useState(initialView || 'login'); // 'login' | 'signup' | 'reset' | 'newPassword'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    setLoading(true);

    if (view === 'login') {
      await onSignIn(email, password);
    } else if (view === 'signup') {
      const ok = await onSignUp(email, password);
      if (ok) setSignupDone(true);
    } else if (view === 'reset') {
      const ok = await onResetPassword(email);
      if (ok) setResetSent(true);
    } else if (view === 'newPassword') {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setLocalError('Password must be at least 8 characters.');
        setLoading(false);
        return;
      }
      const ok = await onUpdatePassword(password);
      if (ok) setPasswordUpdated(true);
    }
    setLoading(false);
  };

  const switchView = (v) => {
    clearError();
    setLocalError('');
    setView(v);
    setResetSent(false);
    setSignupDone(false);
    setPasswordUpdated(false);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className={isModal ? 'auth-modal-overlay' : 'auth-screen'}>
      <div className={isModal ? 'auth-modal-container' : 'auth-container'}>

        {/* Modal close button */}
        {isModal && onClose && (
          <button className="auth-modal-close" onClick={onClose} aria-label="Close">✕</button>
        )}

        {/* App branding */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <AppIcon size={isModal ? 36 : 48} />
          </div>
          <h1 className="auth-brand-name">My Prayer App</h1>
          {!isModal && <p className="auth-brand-tagline">A sacred space for your conversations with God</p>}
        </div>

        {/* Card */}
        <div className="auth-card">

          {/* Back button (for reset / newPassword view) */}
          {view !== 'login' && !signupDone && !resetSent && !passwordUpdated && view !== 'newPassword' && (
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
            {view === 'newPassword' && 'Set new password'}
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

          {passwordUpdated && (
            <div className="auth-success">
              <div className="auth-success-icon">✅</div>
              <p className="auth-success-title">Password updated!</p>
              <p className="auth-success-sub">
                Your new password is saved. Sign in with it whenever you're ready.
              </p>
              <button className="auth-link-btn" onClick={() => switchView('login')}>
                Sign in
              </button>
            </div>
          )}

          {/* Form */}
          {!signupDone && !resetSent && !passwordUpdated && (
            <form className="auth-form" onSubmit={handleSubmit}>

              {/* Error */}
              {(error || localError) && (
                <div className="auth-error">
                  {error || localError}
                </div>
              )}

              {/* Email — hidden for newPassword view (user is already authed via recovery link) */}
              {view !== 'newPassword' && (
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
              )}

              {/* Password (not shown for reset) */}
              {view !== 'reset' && (
                <div className="auth-field">
                  <label className="auth-label">
                    {view === 'newPassword' ? 'New password' : 'Password'}
                  </label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      className="auth-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={view === 'signup' || view === 'newPassword' ? 'Create a password' : 'Your password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={view === 'signup' || view === 'newPassword' ? 8 : undefined}
                      autoComplete={view === 'signup' || view === 'newPassword' ? 'new-password' : 'current-password'}
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
                  {(view === 'signup' || view === 'newPassword') && (
                    <p className="auth-password-hint">
                      Must include uppercase, lowercase and a number — e.g. <strong>Praying2024</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Confirm password — only for newPassword view */}
              {view === 'newPassword' && (
                <div className="auth-field">
                  <label className="auth-label">Confirm new password</label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      className="auth-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repeat your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
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
                    {view === 'newPassword' && 'Save New Password'}
                  </>
                )}
              </button>

              {/* Switch view — hidden for newPassword (user arrived via email link) */}
              {view !== 'newPassword' && (
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
              )}
            </form>
          )}
        </div>

        <p className="auth-footer">
          <PrayingHands size={18} style={{ marginRight: 6 }} /> Your prayers are private and secure
        </p>
      </div>
    </div>
  );
}
