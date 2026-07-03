import { useState, useEffect } from 'react';
import { GitBranch } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RealtimePage from './pages/RealtimePage';
import TechnicalPage from './pages/TechnicalPage';
import PredictionsPage from './pages/PredictionsPage';
import CorrelationPage from './pages/CorrelationPage';
import ModelRegistryPage from './pages/ModelRegistryPage';
import SystemStatsPage from './pages/SystemStatsPage';
import LSTMResearchPage from './pages/LSTMResearchPage';
import DocsPage from './pages/DocsPage';
import ArchitectureDoc from './pages/docs/ArchitectureDoc';
import ProducerDoc from './pages/docs/ProducerDoc';
import SparkStreamingDoc from './pages/docs/SparkStreamingDoc';
import SparkBatchDoc from './pages/docs/SparkBatchDoc';
import MongoDBDoc from './pages/docs/MongoDBDoc';
import LSTMDoc from './pages/docs/LSTMDoc';
import APIDoc from './pages/docs/APIDoc';
import FrontendDoc from './pages/docs/FrontendDoc';
import TestingDoc from './pages/docs/TestingDoc';
import DeploymentDoc from './pages/docs/DeploymentDoc';
import InterviewQADoc from './pages/docs/InterviewQADoc';
import { fetchStats } from './api/client';
import { type Coin } from './lib/coin';
import { PUBLIC_PAGES, pageVariants, PAGE_FILE, TAB_PAGES, type Page } from './components/layout/navigation';
import Sidebar from './components/layout/Sidebar';
import PublicShell from './components/layout/PublicShell';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});

/* ── Authenticated shell ────────────────────────────────────────────────── */
function AppShell() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [page, setPage] = useState<Page>('docs');
  const [coin, setCoin] = useState<Coin>('bitcoin');
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [dogePrice, setDogePrice] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = () => {
      fetchStats()
        .then(d => {
          setBtcPrice(d.latest_prices?.BTC?.price ?? null);
          setDogePrice(d.latest_prices?.DOGE?.price ?? null);
        })
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, [isAuthenticated]);

  const fmtP = (p: number | null, dec = 2) =>
    p != null
      ? `$${p.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`
      : '—';

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div style={{
        width: '100%', height: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-base)', flexDirection: 'column', gap: '14px',
      }}>
        <div className="font-display" style={{ fontSize: '22px', color: 'var(--accent)', letterSpacing: '0.02em' }}>
          Bitconiacs
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'Hanken Grotesk' }}>
          Loading...
        </div>
      </div>
    );
  }

  /* ── Public pages (no login needed) ── */
  if (!isAuthenticated && PUBLIC_PAGES.has(page)) {
    return (
      <PublicShell page={page} setPage={setPage}>
        {page === 'docs'             && <DocsPage onNavigate={(p) => setPage(p as Page)} />}
        {page === 'lstm-research'    && <LSTMResearchPage />}
        {page === 'doc-architecture' && <ArchitectureDoc />}
        {page === 'doc-producer'     && <ProducerDoc />}
        {page === 'doc-streaming'    && <SparkStreamingDoc />}
        {page === 'doc-batch'        && <SparkBatchDoc />}
        {page === 'doc-mongodb'      && <MongoDBDoc />}
        {page === 'doc-lstm'         && <LSTMDoc />}
        {page === 'doc-api'          && <APIDoc />}
        {page === 'doc-frontend'     && <FrontendDoc />}
        {page === 'doc-testing'      && <TestingDoc />}
        {page === 'doc-deployment'   && <DeploymentDoc />}
        {page === 'doc-qa'           && <InterviewQADoc />}
      </PublicShell>
    );
  }

  /* ── Login gate ── */
  if (!isAuthenticated) return <LoginPage />;

  /* ── Full authenticated layout ── */
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar
        page={page}
        coin={coin}
        user={user}
        btcPrice={fmtP(btcPrice, 2)}
        dogePrice={fmtP(dogePrice, 6)}
        onSelectPage={setPage}
        onSelectCoin={setCoin}
        onLogout={logout}
      />

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main style={{
        flex: 1,
        marginLeft: '232px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        {/* Editor tab-bar — pages as open source files */}
        <div className="tab-bar" style={{ position: 'sticky', top: 0, zIndex: 15 }}>
          {TAB_PAGES.map(p => {
            const active = page === p || (p === 'docs' && page.startsWith('doc-'));
            return (
              <button
                key={p}
                className={`tab ${active ? 'active' : ''}`}
                onClick={() => setPage(p)}
              >
                <span className="dot" />
                {PAGE_FILE[p]}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '28px 36px 48px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="page-content"
          >
            {page === 'dashboard'   && <DashboardPage coin={coin} />}
            {page === 'realtime'    && <RealtimePage coin={coin} />}
            {page === 'technical'   && <TechnicalPage coin={coin} />}
            {page === 'predictions' && <PredictionsPage coin={coin} />}
            {page === 'correlation' && <CorrelationPage />}
            {page === 'models'        && <ModelRegistryPage />}
            {page === 'system-stats'  && <SystemStatsPage />}
            {page === 'lstm-research' && <LSTMResearchPage />}
            {page === 'docs'          && <DocsPage onNavigate={(p) => setPage(p as Page)} />}
            {page === 'doc-architecture' && <ArchitectureDoc />}
            {page === 'doc-producer'     && <ProducerDoc />}
            {page === 'doc-streaming'    && <SparkStreamingDoc />}
            {page === 'doc-batch'        && <SparkBatchDoc />}
            {page === 'doc-mongodb'      && <MongoDBDoc />}
            {page === 'doc-lstm'         && <LSTMDoc />}
            {page === 'doc-api'          && <APIDoc />}
            {page === 'doc-frontend'     && <FrontendDoc />}
            {page === 'doc-testing'      && <TestingDoc />}
            {page === 'doc-deployment'   && <DeploymentDoc />}
            {page === 'doc-qa'           && <InterviewQADoc />}
          </motion.div>
        </AnimatePresence>
        </div>
      </main>

      {/* ── Status bar — VS Code style ──────────────────────────────────────── */}
      <div className="status-bar" style={{ left: '232px' }}>
        <span className="status-item"><GitBranch size={12} /> main</span>
        <span className="status-item ghost">{PAGE_FILE[page]}</span>
        <span style={{ flex: 1 }} />
        <span className="status-item ghost">{coin.toUpperCase()}</span>
        <span className="status-item ghost">BTC {fmtP(btcPrice, 2)}</span>
        <span className="status-item ghost">DOGE {fmtP(dogePrice, 6)}</span>
        <span className="status-item"><span className="pulse" /> live</span>
        <span className="status-item">UTF-8</span>
        <span className="status-item">LSTM v3</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </QueryClientProvider>
  );
}
