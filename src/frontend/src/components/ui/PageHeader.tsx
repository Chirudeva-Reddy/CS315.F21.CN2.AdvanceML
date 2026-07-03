interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  /** Optional content rendered on the right of the header row. */
  right?: React.ReactNode;
  /** Aligns the right content to the start when items differ in height (Predictions). */
  alignStart?: boolean;
  /** Bottom margin in px (default 28). Predictions uses 24. */
  marginBottom?: number;
}

/**
 * Standard page header: a display-font H1 title with a secondary subtitle line,
 * and optional right-aligned content. Used on every authenticated page.
 */
export default function PageHeader({ title, subtitle, right, alignStart = true, marginBottom = 28 }: PageHeaderProps) {
  // IDE-style breadcrumb path derived from the title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return (
    <div style={{
      display: 'flex',
      alignItems: alignStart ? 'flex-start' : 'center',
      justifyContent: 'space-between',
      marginBottom: `${marginBottom}px`,
    }}>
      <div style={{ position: 'relative', paddingLeft: '14px' }}>
        {/* editor gutter bar */}
        <span style={{
          position: 'absolute', left: 0, top: '2px', bottom: '2px', width: '3px',
          borderRadius: '3px', background: 'var(--accent)',
        }} />
        <div className="font-mono" style={{
          fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.02em',
          marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ color: 'var(--up)' }}>❯</span>
          <span>~/bitconiacs/<span style={{ color: 'var(--accent-light)' }}>{slug}</span></span>
        </div>
        <h1 className="font-display" style={{ margin: 0, fontSize: '23px', color: 'var(--text-primary)' }}>
          {title}
        </h1>
        {subtitle != null && (
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'Hanken Grotesk' }}>
            {subtitle}
          </div>
        )}
      </div>
      {right}
    </div>
  );
}
