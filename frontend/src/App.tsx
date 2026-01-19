import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Layout } from '@/components/layout/layout';
import { LoginPage } from '@/pages/login';
import { DashboardPage } from '@/pages/dashboard';
import { FleetPage } from '@/pages/fleet';
import { ReportsPage } from '@/pages/reports';
import { MapPage } from '@/pages/map';
import { StoreContext, rootStore, useAuthStore } from '@/stores';

// Protected Route component
const ProtectedRoute = observer(function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
});

// Public Route component (redirects to dashboard if already authenticated)
const PublicRoute = observer(function PublicRoute({ children }: { children: React.ReactNode }) {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
});

function App() {
  return (
    <StoreContext.Provider value={rootStore}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Protected routes with layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/map" element={<MapPage />} />
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreContext.Provider>
  );
}

export default App;
