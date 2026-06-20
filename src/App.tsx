import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LayoutDirectionA } from './components/Layout/LayoutDirectionA'
import { LoginScreen } from './components/Auth/LoginScreen'
import { colors } from './design/tokens'
import './index.css'

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colors['bg/page'] }}>
        <p style={{ color: colors['ink/muted'] }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <LayoutDirectionA />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
