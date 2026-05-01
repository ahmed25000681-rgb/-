import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Layers, ChevronRight, Lock, CheckCircle2, Zap, Radio, ShieldCheck, Activity } from 'lucide-react';
import { useProgress } from '../lib/ProgressContext';

const TRACKS = [
  {
    level: 0,
    title: "نقطة البداية",
    role: "أصول النظام",
    desc: "القاعدة الأساسية. إذا لم تكن تعرف كيف تعمل دورات المعالج، فأنت لا تنتمي إلى هنا.",
    topics: ["المعمارية والذاكرة", "بروتوكولات الشبكات", "أنوية الأنظمة", "البرمجة البدائية C++/Python"],
  },
  {
    level: 1,
    title: "مساعد أمني",
    role: "مهندس دفاعي",
    desc: "سد الفجوة بين النظرية والمنطق التطبيقي للثغرات البرمجية.",
    topics: ["التشفير المتقدم", "إدارة جلسات الويب", "منطق الثغرات", "تحصين قواعد البيانات"],
  },
  {
    level: 2,
    title: "محلل محترف",
    role: "مهندس عكسي",
    desc: "تفكيك الأنظمة لفهم جوهرها. تحليل البرمجيات الخبيثة والملفات الثنائية.",
    topics: ["الهندسة العكسية", "تحليل البرمجيات الخبيثة", "التحقـيق الرقمي", "الاستجابة للحوادث"],
  },
  {
    level: 3,
    title: "باحث خبير",
    role: "متخصص Zero-Day",
    desc: "القمة. تطوير ثغرات مبتكرة والبحث في المجهول الرقمي.",
    topics: ["تطوير الثغرات", "أمن سحابة النظم", "اكتشاف الـ Zero-Day", "أبحاث التهديدات المتقدمة"],
  }
];

const TrackCard = ({ track, delay, progress }: any) => {
  const isLocked = false; // All restrictions removed
  const isCompleted = track.level < progress.level;
  
  // Progress percent for current level
  let percent = 0;
  if (track.level === 0) percent = Math.min(100, Math.round((progress.completedModules.length / 2) * 100));
  if (isCompleted) percent = 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className={`cyber-card p-6 relative overflow-hidden group ${isLocked ? 'opacity-30' : 'hover:border-cyber-accent/60 shadow-[0_0_40px_rgba(0,0,0,0.8)] border-white/5'}`}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-cyber-accent opacity-20" />
      
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-cyber-accent animate-pulse' : 'bg-cyber-accent animate-pulse'}`} />
             <span className="text-[9px] font-mono text-cyber-accent uppercase tracking-[0.3em]">{isLocked ? 'VOID_LOCK' : isCompleted ? 'MISSION_LOGGED' : 'ACTIVE_HUNT'}</span>
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:hologram-glow transition-all glitch-text">{track.title}</h3>
          <div className="flex items-center gap-2">
            <Radio size={10} className="text-cyber-muted opacity-50" />
            <p className="text-[9px] font-mono text-cyber-muted uppercase tracking-[0.2em]">{track.role}</p>
          </div>
        </div>
        <div className="p-3 bg-black/80 border border-white/5 rounded-sm group-hover:border-cyber-accent/30 transition-colors">
          {!isLocked ? <Layers size={20} className="text-cyber-accent" /> : <Lock size={20} className="text-cyber-muted" />}
        </div>
      </div>
      
      <p className="text-[11px] text-cyber-muted mb-8 leading-relaxed font-medium bg-black/20 p-4 border-r border-white/5">
        {track.desc}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-10">
        {track.topics.map((topic: string, i: number) => (
          <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-cyber-muted hover:text-white transition-colors cursor-default group/item">
            <Zap size={10} className="text-cyber-accent opacity-30 group-hover/item:opacity-100 transition-opacity" />
            <span className="uppercase tracking-wider">{topic}</span>
          </div>
        ))}
      </div>
      
      {(track.level <= progress.level || isCompleted) && (
        <div className="mb-8">
           <div className="flex justify-between items-center mb-2 text-[9px] font-mono text-cyber-accent">
             <span className="flex items-center gap-2 uppercase"><Activity size={10} /> تحميل الوعي الرقمي</span>
             <span className="hologram-glow">{percent}%</span>
           </div>
           <div className="w-full bg-black/40 h-1 overflow-hidden p-[1x]">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${percent}%` }}
               className="bg-cyber-accent h-full shadow-[0_0_20px_#e61919]" 
             />
           </div>
        </div>
      )}

      <Link 
        to={isLocked ? '#' : `/academy/${track.level}`}
        onClick={(e) => isLocked && e.preventDefault()}
        className={`w-full py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all border ${isLocked ? 'border-white/5 text-white/20 cursor-not-allowed' : 'cyber-button'}`}
      >
        {isLocked ? 'تم رفض الوصول' : isCompleted ? 'مراجعة الأرشيف' : 'بدء المسار [Execute]'}
        <ChevronRight size={14} className={`rotate-180 ${isLocked ? 'opacity-0' : ''}`} />
      </Link>

      <div className="absolute -bottom-4 -right-4 text-7xl font-black text-white/5 pointer-events-none select-none italic group-hover:text-white/10 transition-colors uppercase">
        L{track.level}
      </div>
    </motion.div>
  );
};

export default function Academy() {
  const { progress } = useProgress();

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <header className="relative space-y-4">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100px' }}
          className="h-1 bg-cyber-accent"
        />
        <div className="space-y-1">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white glitch-text">تسلسل <span className="text-cyber-accent">الظلال</span></h1>
          <p className="text-cyber-muted font-mono text-[10px] uppercase tracking-[0.4em] opacity-60">ACADEMY_VOID_PROTOCOL_V4.6</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {TRACKS.map((track, i) => (
          <TrackCard key={track.level} track={track} delay={i * 0.1} progress={progress} />
        ))}
      </div>

      <div className="glass-panel p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Radio size={120} className="text-cyber-accent" />
        </div>
        <div className="relative z-10 space-y-4 text-center">
          <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3">
            <ShieldCheck size={20} className="text-cyber-accent animate-pulse" />
            بروتوكول الوصول الشامل مفعل
          </h3>
          <p className="text-xs text-cyber-muted max-w-2xl mx-auto uppercase tracking-widest leading-loose font-medium">
             تم إلغاء جميع قيود التسلسل المعرفي. يمكنك الآن الولوج إلى أي وحدة فنية في الأرشيف المركزي وتحدي قدراتك الهندسية في أي مستوى تراه مناسباً. تذكر دائماً: الفهم العميق لأساسيات النظام هو ما يصنع الفارق بين الهاكر والمهندس الحقيقي.
          </p>
        </div>
      </div>
    </div>
  );
}

