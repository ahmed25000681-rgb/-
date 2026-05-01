import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, ShieldAlert, CheckSquare, AlertCircle, ShieldCheck } from 'lucide-react';
import { useProgress } from '../lib/ProgressContext';

export default function Ethics() {
  const { progress, signEthics } = useProgress();
  const [agreed, setAgreed] = useState(progress.ethicsSigned);

  const handleSign = () => {
    if (agreed && !progress.ethicsSigned) {
      signEthics();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <header className="text-center mb-16">
        <Scale size={48} className="text-cyber-accent mx-auto mb-6" />
        <h1 className="text-5xl font-bold uppercase tracking-tighter mb-4">ضوابط الحدود</h1>
        <p className="text-cyber-muted text-lg">هندسة السايبر هي منصة أبحاث أكاديمية. الحوكمة غير قابلة للتفاوض.</p>
      </header>

      <section className="space-y-8 mb-16">
        <div className="cyber-card bg-red-950/10 border-red-900/50 p-8">
          <div className="flex items-center gap-4 mb-4">
            <ShieldAlert className="text-red-500" size={24} />
            <h2 className="text-lg font-bold uppercase text-red-500">تحذير قانوني</h2>
          </div>
          <p className="text-sm text-cyber-text leading-relaxed font-serif italic mb-6" dir="ltr">
            "الوصول غير المصرح به إلى أنظمة الكمبيوتر، وتدمير البيانات، وإنشاء البرامج الضارة لأغراض خبيثة هي جرائم جنائية في معظم السلطات القضائية، بما في ذلك على سبيل المثال لا الحصر قانون إساءة استخدام الكمبيوتر (المملكة المتحدة)، وCFAA (الولايات المتحدة الأمريكية)، والمادة 306 من قانون العقوبات المصري."
          </p>
          <div className="p-4 bg-black/40 border border-red-900/20 rounded text-[11px] font-mono text-cyber-muted uppercase tracking-widest space-y-2">
            <p>1. المعلومات المقدمة هنا هي للاستخدام التعليمي فقط.</p>
            <p>2. المستخدمون مسؤولون عن الامتثال للقوانين المحلية.</p>
            <p>3. أدوات المنصة مخصصة للاختبار على البنية التحتية المملوكة فقط.</p>
          </div>
        </div>

        <div className="cyber-card p-8">
          <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-3">
             <CheckSquare className="text-cyber-accent" />
             ميثاق الأخلاق والسلوك
          </h2>
          <div className="space-y-6 text-sm text-cyber-muted leading-relaxed text-right">
            <div>
              <h3 className="text-cyber-text font-bold mb-2">أولاً: النزاهة الأكاديمية</h3>
              <p>لن أستخدم المعرفة المكتسبة من هندسة السايبر للتسبب في ضرر أو تعطيل أو خسارة مالية لأي فرد أو مؤسسة.</p>
            </div>
            <div>
              <h3 className="text-cyber-text font-bold mb-2">ثانياً: عدم الانتشار</h3>
              <p>لن أشارك نصوصاً برمجية استغلالية مؤتمتة أو حمولات حربية. تركيزي ينصب على منطق ومعمارية الأنظمة.</p>
            </div>
            <div>
              <h3 className="text-cyber-text font-bold mb-2">ثالثاً: الإفصاح المسؤول</h3>
              <p>عند اكتشاف ثغرات أمنية، سألتزم ببروتوكولات الإفصاح المسؤول ولن ألجأ أبداً إلى الابتزاز.</p>
            </div>
          </div>

          <div className="mt-12 p-6 border border-cyber-line bg-slate-900/40 rounded-lg">
             {progress.ethicsSigned ? (
               <div className="flex flex-col items-center py-6 text-cyber-emerald">
                 <ShieldCheck size={48} className="mb-4" />
                 <h3 className="text-lg font-bold uppercase tracking-widest mb-2">تم توقيع الميثاق</h3>
                 <p className="text-[10px] uppercase font-mono tracking-tighter">التوقيع الرقمي رقم: #SEC-{Math.random().toString(16).slice(2, 10).toUpperCase()} مرخص</p>
               </div>
             ) : (
               <>
                 <label className="flex items-start gap-4 cursor-pointer group mb-8">
                   <input 
                     type="checkbox" 
                     className="mt-1 w-5 h-5 rounded border-cyber-line bg-cyber-black text-cyber-accent focus:ring-cyber-accent"
                     checked={agreed}
                     onChange={(e) => setAgreed(e.target.checked)}
                   />
                   <span className="text-xs font-bold uppercase italic tracking-wider text-cyber-muted group-hover:text-cyber-text transition-colors text-right">
                      لقد قرأت التحذيرات القانونية وأوقع طواعية على ميثاق السلوك هذا. أتحمل المسؤولية القانونية الكاملة عن أفعالي خارج هذه المنصة.
                   </span>
                 </label>
                 
                 <button 
                    onClick={handleSign}
                    disabled={!agreed}
                    className={`w-full py-4 font-bold uppercase tracking-widest transition-all ${agreed ? 'bg-cyber-accent text-cyber-black hover:bg-white cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white/5 text-cyber-muted cursor-not-allowed'}`}
                 >
                    التوقيع الرقمي والمصادقة على الدخول
                 </button>
               </>
             )}
          </div>
        </div>
      </section>

      <footer className="flex items-center gap-4 p-4 border border-blue-900/20 bg-blue-950/10 rounded-lg">
         <AlertCircle size={20} className="text-blue-400" />
         <span className="text-[10px] font-mono text-blue-300 uppercase tracking-widest">
           تم تسجيل توقيعك الرقمي بنظام HASH_FS الـ {progress.ethicsSigned ? 'نشط' : 'قيد الانتظار'}
         </span>
      </footer>
    </div>
  );
}

