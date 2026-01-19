import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { apolloClient } from '@/lib/apollo-client';
import { Sidebar } from '@/components/sidebar';
import { DashboardPage } from '@/pages/dashboard';
import { FleetPage } from '@/pages/fleet';
import { ReportsPage } from '@/pages/reports';
import { MapPage } from '@/pages/map';
import { LoginPage } from '@/pages/login';
import { StoreContext, rootStore, useAuthStore } from '@/stores';

const ProtectedRoute = observer(function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
});

const PublicRoute = observer(function PublicRoute({ children }: { children: React.ReactNode }) {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreContext.Provider value={rootStore}>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex min-h-screen bg-background">
                    <Sidebar />
                    <main className="flex-1 ml-64 overflow-x-hidden">
                      <div className="container mx-auto py-8 px-6 max-w-7xl">
                        <Routes>
                          <Route path="/dashboard" element={<DashboardPage />} />
                          <Route path="/fleet" element={<FleetPage />} />
                          <Route path="/reports" element={<ReportsPage />} />
                          <Route path="/map" element={<MapPage />} />
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </StoreContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
