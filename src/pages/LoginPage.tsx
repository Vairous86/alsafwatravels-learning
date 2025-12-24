import Login from '@/components/Login';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  // If already logged in, redirect to home
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen gradient-dark flex items-center justify-center">
      <Helmet>
        <title>Login - مكتبة التدريبات السياحية</title>
      </Helmet>
      <div className="max-w-md w-full p-6 bg-muted/40 rounded-lg backdrop-blur">
        <h2 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h2>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
