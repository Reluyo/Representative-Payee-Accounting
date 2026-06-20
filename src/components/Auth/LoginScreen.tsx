import { useState } from 'react';
import { colors, radius } from '../../design/tokens';
import { useAuth } from '../../contexts/AuthContext';

export function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email.trim(), password);
        if (error) {
          setError(error);
        } else {
          setSuccess('Account created! Check your email to confirm, then sign in.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          setError(error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors['bg/page'],
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
        <div style={{
          backgroundColor: colors['header/bg'],
          borderRadius: `${radius.card}px`,
          padding: '28px 24px',
          color: '#fff',
          textAlign: 'center',
          marginBottom: '28px',
        }}>
          <div style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
            Representative Payee
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Source Serif 4', serif" }}>
            Accounting
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], display: 'block', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 600,
                border: `1px solid ${colors['border/hairline']}`,
                borderRadius: '12px',
                boxSizing: 'border-box',
                color: colors['ink/primary'],
                backgroundColor: '#fff',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], display: 'block', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 600,
                border: `1px solid ${colors['border/hairline']}`,
                borderRadius: '12px',
                boxSizing: 'border-box',
                color: colors['ink/primary'],
                backgroundColor: '#fff',
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: '14px', color: '#ef4444', fontWeight: 600, marginBottom: '12px' }}>
              {error}
            </p>
          )}

          {success && (
            <p style={{ fontSize: '14px', color: '#16a34a', fontWeight: 600, marginBottom: '12px' }}>
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '56px',
              border: 'none',
              borderRadius: `${radius.button}px`,
              backgroundColor: colors['brand/primary'],
              color: '#fff',
              fontSize: '17px',
              fontWeight: 800,
              fontFamily: 'inherit',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: '12px',
            }}
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              fontSize: '15px',
              fontWeight: 700,
              color: colors['brand/primary'],
              cursor: 'pointer',
              padding: '12px',
              fontFamily: 'inherit',
            }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </form>
      </div>
    </div>
  );
}
