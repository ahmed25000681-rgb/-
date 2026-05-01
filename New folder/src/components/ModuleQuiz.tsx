import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ArrowRight, ShieldAlert, Award } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

interface QuizProps {
  moduleId: string;
  onComplete: () => void;
  onClose: () => void;
}

const QUIZZES: Record<string, Question[]> = {
  'cpu-arch-01': [
    {
      id: 1,
      text: "أي جزء في المعالج مسؤول عن تحديد الخطوة التالية في التنفيذ؟",
      options: ["RAM", "RIP / Instruction Pointer", "ALU", "Cache"],
      correctIndex: 1
    },
    {
      id: 2,
      text: "أي من أنواع الذاكرة التالية هو الأسرع على الإطلاق؟",
      options: ["القرص الصلب", "RAM", "المسجلات (Registers)", "الكاش (Cache)"],
      correctIndex: 2
    },
    {
      id: 3,
      text: "ماذا يحدث عند حدوث 'تجاوز السعة' (Buffer Overflow) في الذاكرة؟",
      options: ["يتحسن أداء المعالج", "تتم حماية البيانات تلقائياً", "تفيض البيانات لتخريب عناوين العودة وتعطيل المسار", "تفرغ الذاكرة فوراً"],
      correctIndex: 2
    }
  ],
  'networking-101': [
    {
      id: 1,
      text: "في 'المصافحة الثلاثية'، ما هي الخطوة التي يرسلها السيرفر للرد على طلب الاتصال؟",
      options: ["SYN", "ACK", "SYN-ACK", "FIN"],
      correctIndex: 2
    },
    {
      id: 2,
      text: "اختصار DNS يرمز لنظام يقوم بـ:",
      options: ["تشفير الملفات", "تحويل أسماء المواقع إلى أرقام IP", "إرسال البريد الإلكتروني", "تسجيل كلمات المرور"],
      correctIndex: 1
    }
  ],
  'web-sec-01': [
    {
      id: 1,
      text: "أي من التالي هو مثال على ثغرة XSS؟",
      options: ["حقن استعلام SQL في صفحة الدخول", "حقن كود JavaScript في حقل التعليق", "تخمين كلمة مرور المدير", "سرقة ملفات النظام"],
      correctIndex: 1
    },
    {
      id: 2,
      text: "كيف يمكن منع ثغرات SQL Injection بشكل فعال؟",
      options: ["استخدام كلمات مرور قوية", "مسح الكوكيز دورياً", "استخدام الاستعلامات المحضرة (Prepared Statements)", "إيقاف تشغيل JavaScript"],
      correctIndex: 2
    }
  ],
  'rev-eng-01': [
    {
      id: 1,
      text: "أي من المسجلات التالية يشير إلى التعليمة التالية في التنفيذ (Instruction Pointer)؟",
      options: ["RAX", "RSP", "RIP", "RBX"],
      correctIndex: 2
    },
    {
      id: 2,
      text: "ماذا تفعل تعليمة MOV في لغة التجميع؟",
      options: ["جمع رقمين", "نقل البيانات من مكان لآخر", "القفز لعنوان جديد", "مقارنة قيمتين"],
      correctIndex: 1
    }
  ],
  'zero-day-01': [
    {
      id: 1,
      text: "ما هو التعريف الدقيق لثغرة الـ Zero-Day؟",
      options: ["ثغرة تحدث في اليوم الأول من العام", "ثغرة غير مكتشفة من قبل المطورين ولا يوجد لها حل حالياً", "ثغرة يمكن استغلالها في أقل من ثانية", "ثغرة تصيب متصفح Chrome فقط"],
      correctIndex: 1
    }
  ],
  'bin-math-01': [
    {
      id: 1,
      text: "عملية XOR تعطي القيمة 1 عندما تكون المدخلات:",
      options: ["متشابهة (0,0 أو 1,1)", "مختلفة (0,1 أو 1,0)", "كلاهما 1 فقط", "كلاهما 0 فقط"],
      correctIndex: 1
    }
  ],
  'firewall-logic-01': [
    {
      id: 1,
      text: "ماذا تعني قاعدة 'الرفض الضمني' (Implicit Deny) في جدران النار؟",
      options: ["السماح بكل شيء وتصفية الضار", "منع كل حركة مرور لا توجد لها قاعدة سماح صريحة", "إبطاء سرعة الإنترنت للمهاجمين", "إرسال تنبيه للمدير عند كل دخول"],
      correctIndex: 1
    }
  ],
  'linux-kernel-01': [
    {
      id: 1,
      text: "أي من التالي يعتبر System Call في نظام Linux؟",
      options: ["printf()", "read()", "malloc()", "scanf()"],
      correctIndex: 1
    }
  ],
  'win-reg-01': [
    {
      id: 1,
      text: "ما هو التنسيق القياسي للملفات التنفيذية في نظام ويندوز؟",
      options: ["ELF", "PE", "DMG", "APK"],
      correctIndex: 1
    }
  ],
  'crypto-01': [
    {
      id: 1,
      text: "في التشفير غير المتماثل (Asymmetric)، كم مفتاحاً يمتلك المستخدم؟",
      options: ["مفتاح واحد فقط", "مفتاحان (عام وخاص)", "3 مفاتيح", "لا يحتاج مفاتيح"],
      correctIndex: 1
    }
  ],
  'binary-exploitation': [
    {
      id: 1,
      text: "ما هي تقنية ASLR الأمنية؟",
      options: ["تشفير الأقراص الصلبة", "تغيير عناوين الذاكرة عشوائياً", "منع تنفيذ الكود في البيانات", "ضغط الملفات"],
      correctIndex: 1
    }
  ]
};

export default function ModuleQuiz({ moduleId, onComplete, onClose }: QuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = QUIZZES[moduleId] || [];
  const currentQuestion = questions[currentStep];

  const handleSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    if (index === currentQuestion.correctIndex) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const isPassed = score / questions.length >= 0.7;

  if (isFinished) {
    return (
      <div className="p-8 text-center" dir="rtl">
        {isPassed ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Award size={64} className="text-cyber-accent mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">تم التصديق على الوحدة!</h2>
            <p className="text-cyber-muted text-sm mb-8">لقد اجتزت التقييم بنسبة {Math.round((score/questions.length)*100)}%. تم تسجيل بياناتك في السجل المحلي.</p>
            <button 
              onClick={() => { onComplete(); onClose(); }}
              className="bg-cyber-accent text-cyber-black px-8 py-3 font-bold uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              العودة وإكمال المسار
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <ShieldAlert size={64} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">فشل في التحقق</h2>
            <p className="text-cyber-muted text-sm mb-8">النتيجة {Math.round((score/questions.length)*100)}% غير كافية للتصديق. يرجى مراجعة المحتوى التقني والمحاولة مرة أخرى.</p>
            <button 
              onClick={onClose}
              className="border border-cyber-line px-8 py-3 font-bold uppercase text-xs tracking-widest text-cyber-muted hover:text-white transition-all"
            >
              إغلاق ومراجعة الدرس
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <div className="text-[10px] text-cyber-accent font-mono uppercase tracking-[0.3em]">التقييم الفني // السؤال {currentStep + 1} من {questions.length}</div>
        <div className="text-[10px] text-slate-600 font-mono">ID: {moduleId}</div>
      </div>

      <h3 className="text-lg font-bold text-white mb-8 border-r-2 border-cyber-accent pr-4">{currentQuestion.text}</h3>

      <div className="space-y-3 mb-10">
        {currentQuestion.options.map((option, i) => {
          let stateClass = "border-cyber-line text-cyber-muted hover:border-cyber-accent hover:text-white";
          if (showExplanation) {
            if (i === currentQuestion.correctIndex) stateClass = "border-cyber-emerald bg-cyber-emerald/10 text-cyber-emerald";
            else if (i === selectedOption) stateClass = "border-red-500 bg-red-500/10 text-red-500";
            else stateClass = "border-cyber-line text-slate-700 opacity-50";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full p-4 text-right rounded border transition-all flex justify-between items-center group ${stateClass}`}
            >
              <span className="text-sm font-medium">{option}</span>
              {showExplanation && i === currentQuestion.correctIndex && <Check size={16} />}
              {showExplanation && i === selectedOption && i !== currentQuestion.correctIndex && <X size={16} />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <button 
              onClick={handleNext}
              className="bg-cyber-accent text-cyber-black px-6 py-2 rounded-sm font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white transition-colors"
            >
              {currentStep < questions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
              <ArrowRight size={14} className="rotate-180" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
