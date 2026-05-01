import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Share2, Bookmark, ShieldCheck, Terminal as TerminalIcon, X, List as ListIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useProgress } from '../lib/ProgressContext';
import ModuleQuiz from '../components/ModuleQuiz';
import { LIBRARY } from '../data/articles';

interface Section {
  id: string;
  title: string;
  content: string;
  level: number;
}

export default function ArticleView() {
  const { id } = useParams();
  const { progress, completeModule } = useProgress();
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  
  const articleMeta = LIBRARY[id || ''] || {
    title: "مستند تقني: قيد المعالجة 🛠️",
    author: "الأرشيف المركزي",
    date: "2026.XX.XX",
    readTime: "قيد التقدير",
    level: 0
  };

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      setIsFetching(true);
      setFetchError(null);
      try {
        const response = await fetch(`/articles/${id}.md`);
        if (!response.ok) throw new Error('فشل استرداد العقدة المعرفية [Resource Not Found]');
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsFetching(false);
      }
    };

    fetchContent();
  }, [id]);

  const article = {
    ...articleMeta,
    content: content || fetchError || "# جاري استرجاع البيانات...\n\nيتم الاتصال بالأرشيف المركزي..."
  };

  // Parse sections for navigation
  const parsedSections = React.useMemo(() => {
    const trimmedContent = (content || '').trim();
    if (!trimmedContent) return [];
    
    // Split by headings but keep the heading in the section content
    const rawSections = trimmedContent.split(/(?=^##?#? )/m).filter(Boolean);
    
    return rawSections.map((s, idx) => {
      const lines = s.trim().split('\n');
      const headingMatch = lines[0].match(/^#+\s+(.*)/);
      
      const title = headingMatch 
        ? headingMatch[1].replace(/[^\w\s\u0600-\u06FF]/g, '').trim() 
        : `الجزء ${idx + 1}`;
      
      const level = lines[0].match(/^(#+)/)?.[1].length || 1;
      const sectionId = `section-${idx}`;
      
      return {
        id: sectionId,
        title,
        content: s,
        level
      };
    });
  }, [content]);

  // Robust rendering of section content
  const renderSectionContent = (section: Section) => {
    const lines = section.content.trim().split('\n');
    let heading = '';
    let body = section.content;

    if (lines[0].startsWith('#')) {
      heading = lines[0];
      body = lines.slice(1).join('\n');
    }

    return (
      <div className="py-16 md:py-24">
        {heading && (
          <div className="prose prose-invert mb-12">
            <ReactMarkdown 
              components={{
                h1: ({ children }) => <h1 className="text-4xl md:text-6xl font-extralight text-white tracking-tighter uppercase mb-2 leading-tight glitch-text">{children}</h1>,
                h2: ({ children }) => <h2 className="text-3xl md:text-5xl font-light text-cyber-accent tracking-tight uppercase border-0 mt-0 mb-2 leading-snug">{children}</h2>,
                h3: ({ children }) => <h3 className="text-2xl font-medium text-slate-300 tracking-wide uppercase mt-0 mb-4 leading-relaxed">{children}</h3>,
              }}
            >
              {heading}
            </ReactMarkdown>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 100 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-1.5 bg-cyber-accent mt-8 rounded-full shadow-[0_0_20px_#e61919]" 
            />
          </div>
        )}
        
        <div className="prose prose-invert prose-emerald max-w-none 
          prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-xl md:prose-p:text-2xl prose-p:font-light
          prose-li:text-slate-400 prose-li:leading-loose prose-li:text-lg md:prose-li:text-xl
          prose-code:bg-cyber-accent/10 prose-code:text-cyber-accent prose-code:px-2 prose-code:py-0.5 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none prose-code:font-mono
          prose-pre:bg-black/40 prose-pre:border prose-pre:border-cyber-line prose-pre:shadow-xl prose-pre:rounded-lg
          prose-strong:text-white prose-strong:font-semibold
          prose-blockquote:border-r-4 prose-blockquote:border-l-0 prose-blockquote:border-cyber-accent prose-blockquote:bg-cyber-accent/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-lg prose-blockquote:my-10
          prose-img:rounded-xl prose-img:border prose-img:border-cyber-line
        ">
          <div className="markdown-body">
            <ReactMarkdown>{body || section.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  const isCompleted = progress.completedModules.includes(id || '');

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-text" dir="rtl">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-80 border-l border-cyber-line glass-panel p-8 lg:sticky lg:top-0 lg:h-screen overflow-y-auto z-30 relative">
          <div className="absolute top-0 right-0 w-1 h-full bg-cyber-accent opacity-10" />
          <Link to="/vault" className="flex items-center gap-2 text-cyber-muted hover:text-cyber-accent transition-colors mb-12 text-xs font-bold uppercase tracking-widest relative z-10">
            <ArrowLeft size={16} className="rotate-180" /> العودة للتشفير
          </Link>
          
          <div className="mb-12 relative z-10">
            <div className="text-[10px] font-mono text-cyber-accent uppercase tracking-[0.3em] mb-2">VOID_DATA // {id}</div>
            <h1 className="text-2xl font-bold text-white mb-6 leading-tight hologram-glow glitch-text">{article.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-[10px] font-mono text-cyber-muted uppercase tracking-widest border-y border-white/5 py-4">
              <div className="flex flex-col gap-1">
                <span className="opacity-40">المؤلف</span>
                <span className="text-white">{article.author}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="opacity-40">التاريخ</span>
                <span className="text-white">{article.date}</span>
              </div>
            </div>
          </div>

          <nav className="space-y-4">
            <h3 className="text-[10px] font-bold text-cyber-accent uppercase tracking-[0.3em] mb-6 font-mono opacity-60 flex items-center gap-2">
              <ListIcon size={14} /> NAVIGATION_MAP
            </h3>
            {parsedSections.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  const el = document.getElementById(s.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  setActiveSection(s.id);
                }}
                className={`w-full text-right p-3 text-[10px] font-bold uppercase tracking-widest transition-all border-r-2 ${activeSection === s.id ? 'bg-cyber-accent/10 border-cyber-accent text-cyber-accent' : 'border-transparent text-cyber-muted hover:text-white hover:bg-white/5'}`}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 md:p-12 lg:p-24 max-w-5xl mx-auto relative">
          {parsedSections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              {renderSectionContent(s)}
            </section>
          ))}

          {/* Footer / Quiz Section */}
          <section className="mt-32 pt-20 border-t border-cyber-line text-center max-w-4xl mx-auto relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-cyber-deep border border-cyber-line rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)]">
                <div className="-rotate-45 text-cyber-accent"><TerminalIcon size={20} /></div>
            </div>

            {!isCompleted ? (
              <div className="cyber-card bg-cyber-accent/5 border-cyber-accent/20 border-dashed p-12 flex flex-col items-center rounded-sm">
                <h3 className="text-2xl font-light uppercase tracking-[0.2em] text-white mb-4 glitch-text">اختبار النقاء الرقمي 💀</h3>
                <p className="text-sm text-cyber-muted max-w-xl leading-relaxed mb-10 font-light">
                  أنت تقف في مواجهة الحقيقة. لتوثيق هذا الاستحقاق، يجب أن تمر عبر بوابة التطهير. أي خطأ قد يعني العودة لنقطة الصفر.
                </p>
                <button 
                  onClick={() => setShowQuiz(true)}
                  className="group relative bg-cyber-accent text-cyber-black px-12 py-4 text-xs font-bold uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_40px_rgba(230,25,25,0.4)] overflow-hidden"
                >
                  <span className="relative z-10">بدء مرحلة التطهير</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            ) : (
              <div className="cyber-card bg-cyber-magenta/5 border-cyber-accent/20 border-dashed p-12 flex flex-col items-center rounded-sm">
                <ShieldCheck size={48} className="text-cyber-accent mb-6 animate-pulse" />
                <h3 className="text-2xl font-light uppercase tracking-[0.2em] text-white mb-4">تم تعميد العقدة بنجاح</h3>
                <p className="text-sm text-cyber-muted max-w-xl leading-relaxed mb-10 font-light">
                  تم استيعاب جوهر التهديد. سجلاتك الآن جزء من الفراغ السرمدي.
                </p>
                <Link to="/academy" className="mt-8 text-xs text-cyber-accent hover:underline tracking-widest font-mono uppercase">العودة للظلال</Link>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-black/95 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-cyber-deep border border-cyber-line rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-3xl w-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-cyber-accent" />
              <button 
                onClick={() => setShowQuiz(false)}
                className="absolute top-6 left-6 p-2 text-cyber-muted hover:text-white transition-colors z-20"
                title="إغلاق"
              >
                <X size={24} />
              </button>
              <div className="p-8 md:p-12">
                <ModuleQuiz 
                  moduleId={id || ''} 
                  onComplete={() => completeModule(id || '')} 
                  onClose={() => setShowQuiz(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
