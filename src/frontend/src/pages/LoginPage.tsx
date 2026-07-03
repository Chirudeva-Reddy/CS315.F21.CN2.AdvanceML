import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ username, password });
    } catch {
      setError('auth failed: invalid credentials (exit 1)');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
    color: 'var(--tok-com)', minWidth: '96px', userSelect: 'none',
  };

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}
      >
        <div className="terminal">
          {/* Terminal titlebar */}
          <div className="terminal-head">
            <div className="win-dots"><i /><i /><i /></div>
            <span className="title">bitconiacs — auth — zsh</span>
          </div>

          <div style={{ padding: '26px 24px 28px' }}>
            {/* Boot banner */}
            <div className="font-mono" style={{ fontSize: '12px', lineHeight: 1.9, marginBottom: '22px' }}>
              <div className="tok-com"># crypto analytics · lambda architecture</div>
              <div>
                <span className="tok-str">❯</span>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>./bitconiacs</span>{' '}
                <span className="tok-key">--login</span>
              </div>
              <div className="tok-com">initializing BTC · DOGE · LSTM dual-head v3 …</div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={labelStyle}>username:</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="admin"
                  autoComplete="username"
                  style={{ flex: 1, padding: '9px 12px', fontSize: '13px' }}
                  required
                />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={labelStyle}>password:</span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ flex: 1, padding: '9px 12px', fontSize: '13px' }}
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <div className="font-mono" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '9px 12px',
                  background: 'var(--down-subtle)',
                  border: '1px solid var(--down-border)',
                  borderRadius: '7px', marginBottom: '18px',
                  fontSize: '12px', color: 'var(--down)',
                }}>
                  <AlertCircle size={13} />
                  {error}
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="font-mono"
                style={{
                  width: '100%', padding: '11px',
                  background: loading ? 'var(--bg-elevated)' : 'var(--accent)',
                  border: 'none', borderRadius: '8px',
                  color: loading ? 'var(--text-muted)' : '#fff',
                  fontSize: '13px', fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s', textAlign: 'left',
                }}
              >
                {loading
                  ? <><span style={{ color: 'rgba(255,255,255,0.7)' }}>❯</span> authenticating…</>
                  : <>❯ sign_in()<span className="caret" style={{ color: '#fff' }}>▊</span></>}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="font-mono" style={{
              marginTop: '22px', paddingTop: '16px',
              borderTop: '1px solid var(--border)',
              fontSize: '10.5px', color: 'var(--tok-com)', lineHeight: 1.7,
            }}>
              <div>// Spark Streaming + Batch · FastAPI · MongoDB</div>
              <div>// Kafka → Spark → LSTM → serving layer</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
