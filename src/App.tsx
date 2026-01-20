import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { useAuthStore } from './stores/authStore';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import HomePage from './pages/HomePage';

import './App.css';

// Auth Pages (New Premium UI)
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// App Pages
import AuctionListPage from './pages/AuctionListPage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import ProfilePage from './pages/ProfilePage';
import SellerPage from './pages/SellerPage';
import AdminPage from './pages/AdminPage';
import UpgradeToSellerPage from './pages/UpgradeToSellerPage';
import AuditPage from './pages/AuditPage';
import WinnerPaymentPage from './pages/WinnerPaymentPage';

function AppRoutes() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-medium">Loading AxumAuction...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Auth Routes */}
      <Route path="/signin" element={!user ? <SignInPage /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
      <Route path="/verify-email" element={<OTPVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected App Routes */}
      <Route path="/auctions" element={<AuctionListPage />} />
      <Route path="/auction/:id" element={<AuctionDetailPage />} />
      <Route path="/auction/:id/audit" element={<AuditPage />} />
      <Route path="/payment/:id" element={<WinnerPaymentPage />} />
      <Route path="/categories" element={<CategoriesPage />} />

      {/* User Dashboard */}
      <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/signin" />} />

      {/* Seller Dashboard */}
      <Route path="/seller" element={user ? <SellerPage /> : <Navigate to="/signin" />} />
      <Route path="/become-seller" element={user ? <UpgradeToSellerPage /> : <Navigate to="/signin" />} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} />

      {/* Legacy Dashboard Redirects */}
      <Route path="/dashboard" element={<Navigate to="/profile" />} />
      <Route path="/dashboard/profile" element={<Navigate to="/profile" />} />
      <Route path="/dashboard/seller" element={<Navigate to="/seller" />} />
      <Route path="/dashboard/admin" element={<Navigate to="/admin" />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <NotificationProvider>
          <SocketProvider>
            <Router>
              <AppRoutes />
            </Router>
            <Toaster />
            <Sonner />
          </SocketProvider>
        </NotificationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
