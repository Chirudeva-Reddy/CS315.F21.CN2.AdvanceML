import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { fmt, fmtVolume } from '../../../lib/format';
import type { PredictionsResponse, RealtimeResponse } from '../../../api/client';

interface StatCardsProps {
  decimals: number;
  price: number | null;
  realtime?: RealtimeResponse;
  prediction?: PredictionsResponse;
}

/** Top KPI block rendered as a source file: each metric is a const declaration. */
export default function StatCards({ decimals, price, realtime, prediction }: StatCardsProps) {
  const nextDayP = prediction?.next_day_price;
  const live = realtime?.source === 'realtime';
  const up = nextDayP != null && price != null && nextDayP >= price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="editor-pane"
      style={{ marginBottom: '16px' }}
    >
      <div className="pane-titlebar">
        <div className="win-dots"><i /><i /><i /></div>
        <span><span className="file">overview</span><span className="ext">.tsx</span></span>
        <span style={{ flex: 1 }} />
        <span className="tok-com">// snapshot · refreshes 30s</span>
      </div>

      <div className="code-body" style={{ padding: '10px 0' }}>
        {/* price */}
        <Row>
          <span className="tok-key">const</span>{' '}
          <span className="tok-fn">price</span>{' '}
          <span className="tok-punc">=</span>{' '}
          <span className="tok-num" style={{ fontSize: '15px', fontWeight: 600 }}>{fmt(price, decimals)}</span>
          <Comment>
            {live
              ? <><Wifi size={11} style={{ verticalAlign: '-1px' }} /> live stream</>
              : <><WifiOff size={11} style={{ verticalAlign: '-1px' }} /> batch data</>}
          </Comment>
        </Row>

        {/* 24h range */}
        <Row>
          <span className="tok-key">const</span>{' '}
          <span className="tok-fn">range_24h</span>{' '}
          <span className="tok-punc">= [</span>
          <span className="tok-str">{fmt(realtime?.daily_low, decimals)}</span>
          <span className="tok-punc">, </span>
          <span className="tok-str">{fmt(realtime?.daily_high, decimals)}</span>
          <span className="tok-punc">]</span>
          <Comment>// low · high</Comment>
        </Row>

        {/* forecast */}
        <Row>
          <span className="tok-key">const</span>{' '}
          <span className="tok-fn">forecast</span>{' '}
          <span className="tok-punc">=</span>{' '}
          <span className="tok-fn">predict</span><span className="tok-punc">()</span>{' '}
          <span className="tok-punc">→</span>{' '}
          <span style={{ color: nextDayP ? 'var(--accent-light)' : 'var(--text-muted)', fontWeight: 600 }}>
            {fmt(nextDayP, decimals)}
          </span>{' '}
          {nextDayP != null && (
            <span style={{ color: up ? 'var(--up)' : 'var(--down)' }}>{up ? '↑' : '↓'}</span>
          )}
          <Comment>{prediction?.model_version ? `// ${prediction.model_version}` : '// next-day'}</Comment>
        </Row>

        {/* volume */}
        <Row last>
          <span className="tok-key">const</span>{' '}
          <span className="tok-fn">volume</span>{' '}
          <span className="tok-punc">=</span>{' '}
          <span className="tok-num" style={{ fontWeight: 600 }}>{fmtVolume(realtime?.avg_volume)}</span>
          <Comment>// avg 24h</Comment>
        </Row>
      </div>
    </motion.div>
  );
}

function Row({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div className="code-row" style={last ? undefined : { }}>
      <div style={{ gridColumn: '2', paddingRight: '18px', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
        {children}
      </div>
    </div>
  );
}

function Comment({ children }: { children: React.ReactNode }) {
  return (
    <span className="tok-com" style={{ marginLeft: '14px', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px' }}>
      {children}
    </span>
  );
}
