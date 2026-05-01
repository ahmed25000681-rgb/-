import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Lock, CheckCircle2, Terminal, ShieldCheck } from 'lucide-react';
import { useProgress } from '../lib/ProgressContext';

const MODULES_DATA: Record<number, any[]> = {
  0: [
    { id: 'cpu-arch-01', title: "معمارية المعالج والذاكرة الداخلية", duration: "45د", type: "الأكاديمية" },
    { id: 'networking-101', title: "تحليل بروتوكول TCP/IP ومنطق SYN", duration: "30د", type: "الأكاديمية" },
    { id: 'linux-kernel-01', title: "نداءات نظام Linux وملفات ELF", duration: "60د", type: "الأكاديمية" },
    { id: 'win-reg-01', title: "سجل ويندوز وترويسات PE", duration: "55د", type: "الأكاديمية" },
    { id: 'bin-math-01', title: "الحساب الثنائي والعمليات المنطقية", duration: "25د", type: "الأكاديمية" },
    { id: 'os-concepts-01', title: "جدولة العمليات وإدارة الذاكرة الافتراضية", duration: "40د", type: "الأكاديمية" },
    { id: 'file-systems-01', title: "هياكل ملفات NTFS و Ext4", duration: "35د", type: "الأكاديمية" },
    { id: 'bash-scripting-01', title: "أتمتة المهام باستخدام Bash", duration: "50د", type: "الأكاديمية" },
    { id: 'python-basic-sec', title: "أساسيات بايثون للمهندسين الأمنيين", duration: "45د", type: "الأكاديمية" },
    { id: 'crypto-basics-00', title: "مقدمة في التشفير المتماثل وغير المتماثل", duration: "40د", type: "الأكاديمية" },
  ],
  1: [
    { id: 'web-sec-01', title: "منطق ثغرات الويب: XSS و SQLi", duration: "50د", type: "هندسة دفاعية" },
    { id: 'crypto-01', title: "أساسيات التشفير: من القيصر إلى RSA", duration: "40د", type: "هندسة دفاعية" },
    { id: 'auth-bypass', title: "تجاوز آليات المصادقة وإدارة الجلسات", duration: "45د", type: "هندسة دفاعية" },
    { id: 'firewall-logic-01', title: "تصميم القواعد الدفاعية وجدران النار", duration: "35د", type: "هندسة دفاعية" },
    { id: 'ids-ips-01', title: "أنظمة كشف ومنع التسلل", duration: "40د", type: "هندسة دفاعية" },
    { id: 'api-security-01', title: "تأمين واجهات البرمجيات REST و GraphQL", duration: "50د", type: "هندسة دفاعية" },
    { id: 'cloud-def-01', title: "أساسيات تأمين الحاويات Docker & K8s", duration: "55د", type: "هندسة دفاعية" },
    { id: 'social-eng-01', title: "سيكولوجية الهندسة الاجتماعية والدفاع عنها", duration: "30د", type: "هندسة دفاعية" },
    { id: 'secure-coding-01', title: "مبادئ كتابة الكود الآمن وتجنب الثغرات", duration: "60د", type: "هندسة دفاعية" },
    { id: 'incident-resp-01', title: "الخطوات الأولى في الاستجابة للحوادث", duration: "45د", type: "هندسة دفاعية" },
  ],
  2: [
    { id: 'rev-eng-01', title: "أساسيات الهندسة العكسية: لغة التجميع", duration: "75د", type: "هندسة عكسية" },
    { id: 'malware-01', title: "تحليل سلوك البرمجيات الخبيثة", duration: "90د", type: "هندسة عكسية" },
    { id: 'binary-exploitation', title: "استغلال الثنائيات وتجاوز حماية الذاكرة", duration: "80د", type: "هندسة عكسية" },
    { id: 'static-analysis-01', title: "التحليل الساكن المتقدم باستخدام Ghidra", duration: "70د", type: "هندسة عكسية" },
    { id: 'dynamic-analysis-01', title: "تقنيات التنقيح (Debugging) المتقدمة", duration: "65د", type: "هندسة عكسية" },
    { id: 'packer-obfuscation-01', title: "كسر تقنيات التمويه والضغط", duration: "85د", type: "هندسة عكسية" },
    { id: 'mobile-rev-01', title: "الهندسة العكسية لتطبيقات أندرويد (APK)", duration: "95د", type: "هندسة عكسية" },
    { id: 'iot-firmware-01', title: "تحليل الأنظمة المدمجة و Firmware", duration: "100د", type: "هندسة عكسية" },
    { id: 'anti-debug-01', title: "كشف وتجاوز آليات مكافحة التنقيح", duration: "60د", type: "هندسة عكسية" },
    { id: 'rootkit-analysis-01', title: "فهم وتحليل برمجيات الروتكيت", duration: "110د", type: "هندسة عكسية" },
  ],
  3: [
    { id: 'zero-day-01', title: "منهجية البحث عن ثغرات Zero-Day", duration: "120د", type: "متخصص Zero-Day" },
    { id: 'fuzzing-01', title: "تقنيات الـ Fuzzing المتقدمة", duration: "100د", type: "متخصص Zero-Day" },
    { id: 'kernel-exploit', title: "استغلال ثغرات مستوى النواة (Kernel)", duration: "150د", type: "متخصص Zero-Day" },
    { id: 'browser-exploit-01', title: "هندسة استغلال ثغرات المتصفحات", duration: "140د", type: "متخصص Zero-Day" },
    { id: 'heap-exploitation-01', title: "تقنيات استغلال الذاكرة (Heap Layout)", duration: "130د", type: "متخصص Zero-Day" },
    { id: 'aslr-dep-bypass-01', title: "تجاوز تقنيات الحماية ASLR, DEP, ROP", duration: "110د", type: "متخصص Zero-Day" },
    { id: 'vm-escape-01', title: "تقنيات الهروب من الآلات الافتراضية", duration: "160د", type: "متخصص Zero-Day" },
    { id: 'crypto-attacks-01', title: "كسر الخوارزميات وهجمات القنوات الجانبية", duration: "120د", type: "متخصص Zero-Day" },
    { id: 'wireless-exploit-01', title: "استغلال ثغرات البروتوكولات اللاسلكية", duration: "90د", type: "متخصص Zero-Day" },
    { id: 'ai-sec-research-01', title: "البحث في ثغرات نماذج الذكاء الاصطناعي", duration: "130د", type: "متخصص Zero-Day" },
  ]
};

export default function AcademyModules() {
  const { level } = useParams();
  const { progress } = useProgress();
  const lvlNum = parseInt(level || '0');
  const modules = MODULES_DATA[lvlNum] || [];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <Link to="/academy" className="inline-flex items-center gap-2 text-cyber-muted hover:text-cyber-accent text-[10px] font-mono uppercase tracking-[0.2em] mb-6 transition-colors">
          <ArrowLeft size={12} className="rotate-180" /> العودة إلى المسارات
        </Link>
        <div className="text-[11px] text-cyber-accent font-mono mb-2 uppercase tracking-[0.4em]">اختيار المستويات الفرعية</div>
        <h1 className="text-3xl font-light text-white uppercase tracking-tighter flex items-center gap-4">
          وحدات التعلم: <span className="font-bold">المستوى 0{lvlNum}</span>
        </h1>
      </header>

      <div className="space-y-4">
        {modules.map((mod, i) => {
          const isCompleted = progress.completedModules.includes(mod.id);
          const isLocked = false;
          
          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`cyber-card flex items-center justify-between group ${isLocked ? 'opacity-50' : 'hover:border-cyber-accent cursor-pointer'}`}
            >
              <div className="flex items-center gap-5">
                 <div className={`w-10 h-10 rounded-sm border flex items-center justify-center transition-colors ${isLocked ? 'border-cyber-line' : 'border-cyber-line group-hover:border-cyber-accent group-hover:bg-cyber-accent/10'}`}>
                   {isLocked ? <Lock size={16} className="text-slate-600" /> : isCompleted ? <ShieldCheck size={16} className="text-cyber-emerald" /> : <Terminal size={16} className="text-cyber-accent" />}
                 </div>
                 <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">{mod.type} // node_{mod.id.slice(0,4)}</div>
                    <h3 className={`text-sm font-bold uppercase tracking-wide group-hover:text-white transition-colors ${isLocked ? 'text-slate-500' : 'text-slate-200'}`}>
                      {mod.title}
                    </h3>
                 </div>
              </div>

              <div className="flex items-center gap-8">
                 <span className="text-[10px] font-mono text-slate-600 uppercase hidden sm:block italic">{mod.duration}</span>
                 {!isLocked ? (
                   <Link to={`/article/${mod.id}`} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest transition-colors ${isCompleted ? 'bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald' : 'bg-cyber-accent/5 border border-cyber-accent/20 text-cyber-accent hover:bg-cyber-accent hover:text-cyber-black'}`}>
                     {isCompleted ? 'مراجعة العقدة' : 'دخول الوحدة'}
                   </Link>
                 ) : (
                   <div className="px-4 py-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest border border-slate-800 flex items-center gap-2">
                     <Lock size={10} /> عقدة مغلقة
                   </div>
                 )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 bg-indigo-600/5 border border-indigo-500/20 p-6 rounded flex items-center gap-4">
        <ShieldCheck className="text-cyber-accent" size={24} />
        <p className="text-[11px] text-slate-400 uppercase tracking-widest leading-loose">
          سياسة الاستكشاف الحر مفعلة. جميع الوحدات الفنية متاحة الآن لتحدي قدراتك الهندسية. النجاح في التقييمات يمنحك شارات التصديق التقنية في سجل نظامك.
        </p>
      </div>
    </div>
  );
}

