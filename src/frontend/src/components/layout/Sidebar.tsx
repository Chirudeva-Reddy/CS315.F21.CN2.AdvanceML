import { ChevronDown, LogOut, FolderOpen } from 'lucide-react';
import { NAV_ITEMS, PAGE_FILE, type Page } from './navigation';
import type { Coin } from '../../lib/coin';
import type { AuthUser } from '../../api/client';

interface SidebarProps {
  page: Page;
  coin: Coin;
  user: AuthUser | null;
  btcPrice: string;
  dogePrice: string;
  onSelectPage: (p: Page) => void;
  onSelectCoin: (c: Coin) => void;
  onLogout: () => void;
}

/** Fixed left navigation rail styled as an IDE file-tree explorer. */
export default function Sidebar({
  page, coin, user, btcPrice, dogePrice, onSelectPage, onSelectCoin, onLogout,
}: SidebarProps) {
  return (
    <aside style={{
      width: '232px',
      minWidth: '232px',
      flexShrink: 0,
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: 20,
    }}>
      {/* Brand — workspace title */}
      <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="win-dots"><i /><i /><i /></div>
          <div className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>bitconiacs</span>
            <span style={{ color: 'var(--tok-com)' }}> — workspace</span>
          </div>
        </div>
      </div>

      {/* Active asset — const declaration */}
      <div style={{ padding: '14px 12px', borderBottom: '1px solid var(--border)' }}>
        <div className="tree-label" style={{ paddingLeft: '6px', marginBottom: '10px' }}>
          .env
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {([
            ['bitcoin',  'BTC',  btcPrice],
            ['dogecoin', 'DOGE', dogePrice],
          ] as const).map(([c, sym, price]) => {
            const on = coin === c;
            return (
              <button
                key={c}
                onClick={() => onSelectCoin(c)}
                className="font-mono"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 10px', borderRadius: '7px', border: 'none',
                  background: on ? 'var(--accent-subtle)' : 'transparent',
                  outline: on ? '1px solid rgba(79,70,229,0.22)' : '1px solid transparent',
                  cursor: 'pointer', transition: 'all 0.12s', fontSize: '12px',
                }}
              >
                <span>
                  <span className="tok-key">ASSET</span>
                  <span className="tok-punc">=</span>
                  <span style={{ color: on ? 'var(--tok-str)' : 'var(--text-muted)', fontWeight: 600 }}>{sym}</span>
                </span>
                <span style={{ color: on ? 'var(--tok-num)' : 'var(--text-muted)' }}>{price}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation — file tree */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '2px 4px 10px', color: 'var(--text-secondary)',
        }}>
          <ChevronDown size={13} />
          <FolderOpen size={13} color="var(--tok-key)" />
          <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
            src
          </span>
        </div>
        {NAV_ITEMS.map(item => {
          const active = page === item.id || (item.id === 'docs' && page.startsWith('doc-'));
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`tree-item ${active ? 'active' : ''}`}
              style={{ marginBottom: '1px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.85 }}>
                {item.icon}
              </span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {PAGE_FILE[item.id]}
              </span>
              {item.badge && (
                <span className="font-mono" style={{
                  padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 500,
                  background: active ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                  color: active ? 'var(--accent-light)' : 'var(--text-muted)',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User — session footer */}
      <div style={{ padding: '12px 12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'var(--purple-subtle)',
              border: '1px solid rgba(124,58,237,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="font-mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--purple)' }}>
                {user?.username?.[0]?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="font-mono">
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user?.username ?? 'admin'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--tok-com)' }}>
                @{user?.role ?? 'admin'}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign out"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px', borderRadius: '6px', color: 'var(--text-muted)',
              transition: 'color 0.12s', display: 'flex', alignItems: 'center',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--down)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
