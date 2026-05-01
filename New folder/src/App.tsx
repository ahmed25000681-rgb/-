import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Terminal, Shield, Book, MessageSquare, Scale, Info, Menu, X, User as UserIcon, Zap, AlertCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import Landing from './pages/Landing';
import Academy from './pages/Academy';
import AcademyModules from './pages/AcademyModules';
import Vault from './pages/Vault';
import Forum from './pages/Forum';
import Ethics from './pages/Ethics';
import ArticleView from './pages/ArticleView';
import AdminSettings from './pages/AdminSettings';
import { ProgressProvider, useProgress } from './lib/ProgressContext';
import { SettingsProvider, useSettings } from './lib/SettingsContext';
import AIAssistant from './components/AIAssistant';
import { ErrorBoundary } from './components/ErrorBoundary';

const NavLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 border-r-2 relative group overflow-hidden ${isActive ? 'bg-cyber-accent/10 text-cyber-accent border-cyber-accent shadow-[inset_-10px_0_20px_rgba(230,25,25,0.1)]' : 'text-cyber-muted hover:text-white border-transparent'}`}>
      <div className={`absolute inset-0 bg-cyber-accent/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500`} />
      <Icon size={16} className={`${isActive ? 'animate-pulse' : ''}`} />
      <span className="text-[11px] font-bold uppercase tracking-[0.15em] relative z-10">{children}</span>
    </Link>
  );
};

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, checkAdmin } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const Header = () => {
  const { progress } = useProgress();
  const { settings, updateSettings } = useSettings();
  const [user, setUser] = React.useState(auth.currentUser);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const adminRes = await checkAdmin();
        setIsAdmin(adminRes);
      } else {
        setIsAdmin(false);
      }
    });
    return unsub;
  }, []);

  const handleLogin = async () => {
    const loadingToast = toast.loading('جاري التحقق من الهوية...');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('تم تسجيل الدخول بنجاح', { id: loadingToast });
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('تم إغلاق النافذة المنبثقة. يرجى المحاولة مرة أخرى أو فتح الموقع في علامة تبويب جديدة.', { 
          id: loadingToast,
          duration: 6000 
        });
      } else {
        toast.error('فشل تسجيل الدخول: ' + (error.message || 'خطأ غير معروف'), { id: loadingToast });
      }
    }
  };

  const handleLogout = () => signOut(auth);
  
  const getLevelLabel = (lvl: number) => {
    if (isAdmin) return 'ROOT_ADMIN: الفراغ';
    switch(lvl) {
      case 0: return 'المستوى 01: مساعد';
      case 1: return 'المستوى 02: محلل';
      case 2: return 'المستوى 03: خبير';
      default: return 'المستوى 00: زائر';
    }
  };

  return (
    <header className="h-16 border-b border-cyber-line flex items-center justify-between px-8 glass-panel z-50 sticky top-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-cyber-accent/5 border border-cyber-accent flex items-center justify-center shadow-[0_0_20px_rgba(230,25,25,0.2)] group cursor-pointer overflow-hidden relative" style={{ borderColor: settings.primaryColor }}>
          <div className="absolute inset-0 bg-cyber-accent/20 translate-y-full group-hover:translate-y-0 transition-transform" />
          <div className="w-6 h-6 border-2 border-cyber-accent rotate-45 flex items-center justify-center relative z-10" style={{ borderColor: settings.primaryColor }}>
            <div className="w-2 h-2 bg-cyber-accent rounded-full animate-ping" style={{ backgroundColor: settings.primaryColor }}></div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight text-white leading-tight uppercase hologram-glow glitch-text">{settings.siteName}</h1>
          <span className="text-[10px] text-cyber-accent font-mono tracking-[0.2em] uppercase opacity-80" style={{ color: settings.primaryColor }}>
            {isAdmin ? 'نظام التحكم المركزي' : 'بروتوكول التحليل العميق'}
          </span>
        </div>
      </div>
      
      <div className="hidden lg:flex items-center gap-4 px-8 border-x border-cyber-line flex-1 max-w-sm mx-12">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <Zap 
                size={11} 
                className={settings.horrorIntensity > 5 ? 'animate-pulse' : 'opacity-50'} 
                style={{ color: settings.horrorIntensity > 5 ? settings.primaryColor : '#64748b' }}
              />
              <span className="text-[8px] font-bold text-cyber-muted uppercase tracking-[0.2em]">INTENSITY_LEVEL</span>
            </div>
            <span className="text-[10px] font-mono text-white/50">{settings.horrorIntensity}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="1"
            value={settings.horrorIntensity}
            onChange={(e) => updateSettings({ horrorIntensity: parseInt(e.target.value) })}
            className="w-full h-1 bg-cyber-line rounded-full appearance-none cursor-pointer accent-cyber-accent hover:opacity-100 opacity-70 transition-opacity"
            style={{ accentColor: settings.primaryColor }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex flex-col items-start ml-2 text-left">
              <div className="flex items-center gap-1.5">
                {isAdmin && <Shield size={10} className="text-cyber-accent" />}
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">{user.displayName || 'مستخدم'}</span>
              </div>
              <span className={`text-[9px] font-mono uppercase tracking-tighter opacity-80 ${isAdmin ? 'text-cyber-accent' : 'text-cyber-emerald'}`}>
                {getLevelLabel(progress.level)}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className={`w-10 h-10 rounded-full border border-cyber-accent/30 bg-cyber-accent/5 flex items-center justify-center text-cyber-accent shadow-[0_0_15px_rgba(0,242,255,0.1)] hover:bg-cyber-accent hover:text-black transition-all ${isAdmin ? 'border-cyber-accent ring-1 ring-cyber-accent/50' : ''}`}
            >
              <UserIcon size={20} />
            </button>
          </>
        ) : (
          <button 
            onClick={handleLogin}
            className="px-4 py-1.5 border border-cyber-accent text-cyber-accent text-[10px] font-bold uppercase tracking-widest hover:bg-cyber-accent hover:text-black transition-all"
          >
            تسجيل الدخول [Login]
          </button>
        )}
      </div>
    </header>
  );
};

const Sidebar = () => {
  const { progress } = useProgress();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const check = async () => {
      const res = await checkAdmin();
      setIsAdmin(res);
    };
    check();
  }, [auth.currentUser]);
  
  // Calculate L0 progress based on modules completed (2 modules for L1)
  const l0ProgressPercent = Math.min(100, Math.round((progress.completedModules.length / 2) * 100));

  return (
    <aside className="w-64 border-l border-cyber-line hidden lg:flex flex-col h-[calc(100vh-104px)] fixed right-0 top-16 glass-panel overflow-y-auto">
      <div className="flex-1 py-6 px-4">
        <h2 className="text-[10px] font-bold text-cyber-accent uppercase tracking-[0.3em] mb-6 px-4 font-mono opacity-60">MAIN_NAV.SYS</h2>
        <nav className="space-y-1">
          <NavLink to="/" icon={Terminal}>منصة التشغيل</NavLink>
          <NavLink to="/academy" icon={Book}>الأكاديمية</NavLink>
          <NavLink to="/vault" icon={Shield}>المستودع</NavLink>
          <NavLink to="/forum" icon={MessageSquare}>المنتدى</NavLink>
          <NavLink to="/ethics" icon={Scale}>الأخلاقيات والقانون</NavLink>
          {isAdmin && <NavLink to="/admin" icon={Shield}>لوحة التحكم (Admin)</NavLink>}
        </nav>
        
        <div className="mt-12 px-4 space-y-4">
          <h3 className="text-[9px] font-bold text-cyber-muted uppercase tracking-widest font-mono">STATUS_CHECK</h3>
          <div className="p-4 bg-black/40 border border-cyber-accent/20 rounded-sm text-[10px]">
             <div className="flex justify-between items-center mb-3">
               <span className="text-cyber-accent font-mono">L{progress.level}_SYNC</span>
               <span className="text-white font-mono">{progress.level > 0 ? 'READY' : `${l0ProgressPercent}%`}</span>
             </div>
             <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: progress.level > 0 ? '100%' : `${l0ProgressPercent}%` }}
                 className="bg-cyber-accent h-full shadow-[0_0_20px_#e61919]" 
               />
             </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 mt-auto">
        <div className={`p-4 border border-dashed rounded transition-colors ${progress.ethicsSigned ? 'border-cyber-emerald bg-cyber-emerald/5' : 'border-cyber-line bg-slate-900/20'}`}>
          <h4 className={`text-[10px] font-bold mb-1 uppercase tracking-tighter ${progress.ethicsSigned ? 'text-cyber-emerald' : 'text-slate-600'}`}>
            الوضع الأخلاقي
          </h4>
          <p className="text-[9px] text-cyber-muted leading-tight uppercase font-mono tracking-tighter">
            توقيع المستخدم: {progress.ethicsSigned ? 'موثق ✓' : 'قيد الانتظار'}
          </p>
        </div>
      </div>
    </aside>
  );
};

const Footer = () => {
  const { settings } = useSettings();
  return (
    <footer className="h-10 bg-cyber-deep border-t border-cyber-line px-8 flex items-center justify-between text-[10px] font-mono text-cyber-muted fixed bottom-0 left-0 right-0 z-50">
      <div className="flex gap-6">
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-pulse" /> المنصة: نشطة</span>
        <span>بريد الدعم: {settings.contactEmail}</span>
        <span>العقد: 1402 خاضعة للرقابة</span>
      </div>
      <div className="flex gap-6 items-center">
        <span className="text-cyber-accent">الوضع: غير قابل للتراجع</span>
        <span>v0.4.2-VOID-STABLE</span>
      </div>
    </footer>
  );
};

import { VerificationBanner } from './components/VerificationBanner';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-cyber-black flex flex-col pb-10" dir="rtl">
      <div className="cyber-grid" />
      <Header />
      <VerificationBanner />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 lg:mr-64 p-8 overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={useLocation().pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <SettingsProvider>
        <ProgressProvider>
          <ErrorBoundary>
            <Layout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/academy" element={<Academy />} />
                <Route path="/academy/:level" element={<AcademyModules />} />
                <Route path="/article/:id" element={<ArticleView />} />
                <Route path="/vault" element={<Vault />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/ethics" element={<Ethics />} />
                <Route path="/admin" element={<AdminSettings />} />
              </Routes>
            </Layout>
          </ErrorBoundary>
        </ProgressProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}

