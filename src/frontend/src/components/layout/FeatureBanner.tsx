const FEATURES = [
  { icon: '📊', label: 'Live Dashboard' },
  { icon: '⚡', label: 'Realtime Prices' },
  { icon: '📈', label: 'Technical Analysis' },
  { icon: '🧠', label: 'LSTM Predictions' },
  { icon: '🔗', label: 'Correlation' },
  { icon: '🤖', label: 'Model Registry' },
];

/** Sign-in-to-unlock feature banner shown on the public docs homepage. */
export default function FeatureBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(124,58,237,0.06) 100%)',
      borderBottom: '1px solid rgba(79,70,229,0.15)',
      padding: '14px 36px',
      display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
    }}>
      {/* Left: label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: 'var(--up)', boxShadow: '0 0 6px var(--up)',
          animation: 'none',
        }} />
        <span style={{
          fontFamily: 'Hanken Grotesk', fontSize: '12px', fontWeight: 600,
          color: 'var(--text-secondary)',
        }}>
          Đăng nhập để truy cập đầy đủ tính năng:
        </span>
      </div>

      {/* Feature chips */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
        {FEATURES.map(f => (
          <span
            key={f.label}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '3px 10px', borderRadius: '20px',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              fontFamily: 'Hanken Grotesk', fontSize: '11px', fontWeight: 500,
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ fontSize: '11px' }}>{f.icon}</span>
            {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}
