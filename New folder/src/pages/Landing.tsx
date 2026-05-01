import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Terminal, Shield, Cpu, Network, Lock, BookOpen, Activity, Zap, Radio, Globe } from 'lucide-react';

const StatBox = ({ label, value, color = "cyber-accent" }: any) => (
  <div className="flex flex-col border-l border-white/5 pr-4">
    <span className="text-[8px] font-mono text-cyber-muted uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-xs font-mono font-bold text-${color} animate-pulse tracking-tighter`}>{value}</span>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="cyber-card p-6 group cursor-default hover:border-cyber-accent/60"
  >
    <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-white/5 group-hover:text-cyber-accent/20 transition-colors">
      DATA_NODE_VOID
    </div>
    <div className="w-12 h-12 mb-6 bg-black/60 border border-cyber-accent/20 flex items-center justify-center group-hover:border-cyber-accent group-hover:shadow-[0_0_25px_rgba(230,25,25,0.3)] transition-all">
      <Icon size={20} className="text-cyber-accent group-hover:scale-110 transition-transform" />
    </div>
    <h3 className="text-xs font-bold uppercase tracking-[0.25em] mb-3 text-white group-hover:text-cyber-accent transition-colors border-b border-white/5 pb-2">{title}</h3>
    <p className="text-[11px] text-cyber-muted leading-relaxed font-medium">{desc}</p>
    <div className="mt-6 flex items-center gap-2">
      <div className="w-full h-[1px] bg-white/5" />
      <Zap size={10} className="text-white/10 group-hover:text-cyber-accent transition-colors" />
    </div>
  </motion.div>
);

const GlitchTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative inline-block glitch-text">
      <span className="hologram-glow">{children}</span>
      <motion.span 
        animate={{ opacity: [0, 1, 0], x: [0, -2, 2, 0] }}
        transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 4 }}
        className="absolute top-0 left-0 text-cyber-magenta opacity-50"
      >
        {children}
      </motion.span>
    </div>
  );
};

export default function Landing() {
  const [bootSequence, setBootSequence] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBootSequence(prev => (prev < 4 ? prev + 1 : prev));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-24">
      {/* Hero OS Header */}
      <section className="relative pt-12 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-12 space-y-8">
            <div className="flex items-center gap-6 overflow-x-hidden border-y border-white/5 py-4">
              <StatBox label="VOID_STATUS" value="INFECTED" color="cyber-accent" />
              <StatBox label="PROTOCOLS" value="NON-REVERSIBLE" />
              <StatBox label="THREAT_LEVEL" value="EXTREME" />
              <StatBox label="BREACHES" value="0.4%" />
              <div className="flex-1" />
              <div className="hidden md:flex items-center gap-2 text-[9px] font-mono text-cyber-muted uppercase tracking-widest">
                <Radio size={10} className="animate-pulse text-red-500" />
                DANGER: 1,402 Compromised Nodes
              </div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] font-mono text-cyber-accent/60 uppercase tracking-[0.4em] flex items-center gap-4"
              >
                <div className="w-12 h-[1px] bg-cyber-accent/40" />
                EXTRACTED_ARCHIVE // BEYOND_INTERFACE
              </motion.div>
              
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] uppercase">
                <GlitchTitle>هندسة</GlitchTitle><br />
                الأمن <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent via-red-900 to-black animate-pulse">المحرم</span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm md:text-base text-cyber-muted max-w-2xl leading-relaxed border-r-2 border-cyber-accent pr-6 bg-cyber-accent/5 py-4"
              >
                مرحباً بك في المستوى التالي. هنا، لا نتعلم تشغيل البرمجيات، بل نتعلم منطق بنائها وتفكيكها. منصة بحثية أكاديمية متخصصة في جذور الأنظمة والبروتوكولات.
              </motion.p>
              
              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 className="flex flex-wrap gap-4 pt-6"
              >
                <Link to="/academy" className="cyber-button px-10 py-4 text-xs tracking-[0.4em] scale-110">
                  ولوج المنطقة الآمنة [Enter]
                </Link>
                <Link to="/vault" className="px-10 py-4 text-xs font-bold uppercase tracking-[0.4em] text-cyber-muted hover:text-white border border-white/10 hover:border-white/40 transition-all transition-all">
                  الأرشيف
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Systems Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Cpu} 
          title="نواة الأنظمة" 
          desc="دراسة طبقات التجريد في أنظمة التشغيل، من إدارة العمليات إلى معمارية النواة واستراتيجيات التحكم الكلي."
          delay={0.1}
        />
        <FeatureCard 
          icon={Network} 
          title="هندسة الشبكات" 
          desc="تحليل بنية الإنترنت العالمية، بروتوكولات التوجيه، وطرق تأمين مسارات البيانات على المستوى الوطني."
          delay={0.2}
        />
        <FeatureCard 
          icon={Lock} 
          title="التشفير الحديث" 
          desc="الغوص في الرياضيات خلف RSA، Elliptic Curves، ومستقبل التشفير ما بعد الكمي (Post-Quantum)."
          delay={0.3}
        />
      </section>

      {/* Real-time Intel Feed */}
      <section className="relative">
        <div className="absolute inset-0 bg-cyber-accent/5 -skew-y-3 pointer-events-none" />
        <div className="relative z-10 p-8 glass-panel border-r-4 border-r-cyber-accent">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-cyber-accent animate-pulse" />
                <span className="text-[10px] text-cyber-accent font-mono uppercase tracking-[0.3em]">Global_Observer.EXE</span>
              </div>
              <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">تحديثات الاستخبارات الرقمية</h2>
            </div>
            <Link to="/academy" className="text-[10px] font-mono text-cyber-muted hover:text-white border-b border-transparent hover:border-white py-1 uppercase tracking-widest transition-all">
              عرض السجلات الكاملة &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "ثغرة في منطق التشفير PQC", node: "0xFEA9", type: "CRITICAL", color: "red" },
              { title: "رصد هجوم زلزال سيبراني", node: "0x44BC", type: "WARNING", color: "orange" },
              { title: "تحديث الأكاديمية: المستوى 3", node: "0x1201", type: "INFO", color: "blue" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-5 bg-black/60 border border-white/5 relative group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[8px] font-mono text-${item.color}-500 uppercase px-2 py-1 bg-${item.color}-500/10`}>
                    TYPE: {item.type}
                  </span>
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                    NODE: {item.node}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyber-accent transition-colors uppercase leading-tight mb-4">
                  {item.title}
                </h4>
                <div className="w-full h-1 bg-white/5 relative overflow-hidden">
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: i*0.5 }}
                    className={`absolute inset-0 w-1/3 bg-${item.color}-500/40`} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Mission */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-20">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-8">
            لماذا نحن <span className="text-cyber-accent">مختلفون؟</span>
          </h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="text-cyber-accent font-mono text-xl">01</div>
              <div>
                <h4 className="text-white font-bold uppercase text-xs mb-2 tracking-widest">الفلسفة الهندسية</h4>
                <p className="text-[11px] text-cyber-muted leading-relaxed">نحن لا نبيع أدوات. نحن نبني عقولاً قادرة على فهم كيفية عمل الأداة من الداخل وإعادة هندستها.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-cyber-accent font-mono text-xl">02</div>
              <div>
                <h4 className="text-white font-bold uppercase text-xs mb-2 tracking-widest">الأبحاث الاستراتيجية</h4>
                <p className="text-[11px] text-cyber-muted leading-relaxed">محتوانا يعتمد على أحدث الأبحاث في أمن العتاد والشبكات الواسعة، وليس مجرد دروس برمجة تقليدية.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative aspect-video glass-panel overflow-hidden group">
          <div className="absolute inset-0 bg-cyber-accent/5 flex items-center justify-center">
            <Globe size={120} className="text-cyber-accent/20 animate-spin-slow" />
            <div className="absolute border border-cyber-accent/40 w-48 h-48 rounded-full animate-ping opacity-20" />
            <div className="absolute border border-cyber-magenta/40 w-64 h-64 rounded-full animate-ping opacity-10" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-black/80 p-4 border border-white/5">
             <div className="flex justify-between items-center text-[10px] font-mono text-cyber-accent mb-2">
                <span>WORLD_SCAN_ACTIVE</span>
                <span>88.2%</span>
             </div>
             <div className="w-full h-1 bg-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '88.2%' }}
                  className="h-full bg-cyber-accent"
                />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
