import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/features/Dashboard';
import { Onboarding } from './components/features/Onboarding';
import { Wallet } from './components/features/Wallet';
import { Insights } from './components/features/Insights';
import { UserProvider, useUser } from './lib/UserContext';
import { Layout } from './components/ui/Layout';

function AppContent() {
  const { state } = useUser();

  if (!state.onboarded) {
    return <Onboarding />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
