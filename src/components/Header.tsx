import { Headphones, Shield } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();
  return (
    <header className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-4 animate-fade-in">
          <div className="w-16 h-16 gradient-gold rounded-2xl flex items-center justify-center shadow-gold animate-float">
            <Headphones className="text-primary-foreground" size={32} />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-center text-gradient-gold mb-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          مكتبة التدريبات السياحية
        </h1>

        <p className="text-center text-muted-foreground text-lg mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          استمع إلى الدروس التعليمية حول الوجهات السياحية المختلفة
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Shield className="text-primary" size={16} />
          <span>محتوى محمي - للاستماع فقط</span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">مرحبًا، {user.username}</span>
              <button onClick={() => signOut()} className="text-sm text-destructive underline">تسجيل خروج</button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-primary underline">تسجيل الدخول</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
