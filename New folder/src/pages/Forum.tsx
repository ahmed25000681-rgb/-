import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Users, TrendingUp, AlertTriangle, ShieldCheck, MailWarning } from 'lucide-react';
import { auth } from '../lib/firebase';

const TOPICS = [
  {
    author: "0xNeo",
    title: "فهم تسريب المحاكاة الافتراضية في عتاد Intel VT-x",
    replies: 24,
    views: 1422,
    time: "منذ ساعتين",
    tag: "العتاد"
  },
  {
    author: "ShieldMaiden",
    title: "بدائل مفتوحة المصدر لـ IDA Pro لملفات ARM الثنائية",
    replies: 15,
    views: 890,
    time: "منذ 5 ساعات",
    tag: "الهندسة العكسية"
  },
  {
    author: "RootAdmin",
    title: "[سياسة] تذكير: لا تقم بمشاركة الأدوات التشغيلية",
    replies: 0,
    views: 4500,
    time: "منذ يوم",
    tag: "السياسات"
  }
];

export default function Forum() {
  const user = auth.currentUser;
  const isVerified = user?.emailVerified;

  return (
    <div className="max-w-6xl mx-auto pb-12">
       <div className="flex justify-between items-end border-b border-cyber-line pb-4 mb-8">
        <div>
          <div className="text-[10px] text-cyber-accent font-mono mb-2 uppercase tracking-[0.4em]">التبادل الأكاديمي</div>
          <h1 className="text-3xl font-light text-white uppercase tracking-tighter flex items-center gap-3">
            الـ <span className="font-bold">منتدى</span>
          </h1>
        </div>
        <div className="relative group">
          <button 
            disabled={!isVerified}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${isVerified ? 'bg-cyber-accent text-cyber-black hover:bg-white' : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'}`}
          >
            إنشاء موضوع
          </button>
          {!isVerified && (
            <div className="absolute bottom-full mb-2 left-1/2 -track-x-1/2 hidden group-hover:block w-48 bg-black border border-cyber-line p-2 text-[9px] text-cyber-accent text-center shadow-2xl z-50">
              تنبيه: يتطلب إنشاء المواضيع توثيق البريد الإلكتروني أولاً.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <header className="mb-6 bg-amber-500/5 border border-amber-500/20 p-5 rounded-sm flex items-start gap-4">
             <div className="p-2 bg-amber-500/10 rounded-sm">
                <AlertTriangle size={18} className="text-amber-500" />
             </div>
             <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500 mb-1">وحدة حوكمة الأقران</h2>
                <p className="text-[10px] text-slate-400 lowercase italic tracking-tight">تطبيق السياسات النظامية نشط. تداول الأدوات التشغيلية أو أكواد الاستغلال غير التعليمية يؤدي للفصل الفوري. المعرفة هي العملة الوحيدة هنا.</p>
             </div>
          </header>

          <div className="cyber-card p-0 shadow-2xl">
            <div className="bg-cyber-deep px-6 py-4 border-b border-cyber-line flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em]">
               <span>مركز المناقشات</span>
               <div className="flex gap-16">
                 <span>التفاعل</span>
                 <span>توقيت النشاط</span>
               </div>
            </div>
            
            {TOPICS.map((topic, i) => (
              <div key={i} className="px-6 py-5 border-b border-cyber-line hover:bg-slate-900/40 transition-colors cursor-pointer flex items-center justify-between group">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[8px] border border-cyber-line px-2 py-0.5 rounded-sm text-slate-500 bg-black/20 uppercase tracking-widest">{topic.tag}</span>
                    <span className="text-[9px] text-cyber-accent font-mono uppercase tracking-widest">{topic.author}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyber-accent transition-colors tracking-wide uppercase">{topic.title}</h3>
                </div>
                
                <div className="flex items-center gap-12 text-[10px] font-mono text-slate-400 text-left">
                  <div className="hidden sm:grid grid-cols-2 gap-4">
                     <div className="flex flex-col items-end">
                       <span className="text-white">{topic.replies}</span>
                       <span className="text-[8px] uppercase">رسم</span>
                     </div>
                     <div className="flex flex-col items-end">
                       <span className="text-white">{topic.views}</span>
                       <span className="text-[8px] uppercase">مشاهدة</span>
                     </div>
                  </div>
                  <div className="w-16 text-[9px] uppercase tracking-tighter">{topic.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="cyber-card border-t-2 border-t-cyber-accent">
            <h3 className="text-[10px] font-bold uppercase text-cyber-accent mb-4 tracking-[0.2em] border-b border-cyber-line pb-2">الأبحاث النشطة</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                 <TrendingUp size={14} className="text-cyber-accent group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors">تحليل CVE-2026</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                 <Users size={14} className="text-cyber-accent group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors uppercase tracking-tight">مجموعة دراسة L2 (4 أعضاء)</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 p-5 rounded-sm">
            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
              القياس الحي
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed italic">"تم رصد ازدحام في العقدة 0xF1. قد يزداد زمن استجابة البحث بمقدار 200 مللي ثانية."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
