export interface Article {
  title: string;
  author: string;
  date: string;
  readTime: string;
  level: number;
  content?: string; // Optional now, fetched from public/articles/{id}.md
}

// Metadata registry only (Content moved to /public/articles/{id}.md)
export const LIBRARY: Record<string, Article> = {
  'cpu-arch-01': {
    title: "معمارية المعالج والذاكرة: كيف يفكر العقل الرقمي؟ 💻🧠",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "45 دقيقة",
    level: 0
  },
  'networking-101': {
    title: "تحليل بروتوكول TCP/IP: رحلة الحزمة المغلفة 🌐✉️",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "30 دقيقة",
    level: 0
  },
  'linux-kernel-01': {
    title: "نداءات نظام Linux ومفهوم النواة: قلب النظام 🐧🐚",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "60 دقيقة",
    level: 0
  },
  'win-reg-01': {
    title: "سجل ويندوز وترويسات PE: خريطة طريق النظام 🪟🗺️",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "55 دقيقة",
    level: 0
  },
  'bin-math-01': {
    title: "الحساب الثنائي والعمليات المنطقية: لغة الصفر والواحد 0️⃣1️⃣",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "25 دقيقة",
    level: 0
  },
  'os-concepts-01': {
    title: "إدارة الذاكرة والعمليات: قائد الأوركسترا الرقمي ⚙️🎻",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "40 دقيقة",
    level: 0
  },
  'file-systems-01': {
    title: "هياكل الملفات NTFS و Ext4: تشريح الذاكرة الدائمة 📁💾",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "35 دقيقة",
    level: 0
  },
  'bash-scripting-01': {
    title: "أتمتة المهام مع Bash: قوة السطر الواحد 🐚⚡",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "50 دقيقة",
    level: 0
  },
  'python-basic-sec': {
    title: "بايثون للمهندسين: السكين السويسري البرمجي 🐍⚡",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "45 دقيقة",
    level: 0
  },
  'crypto-basics-00': {
    title: "مقدمة في التشفير: حماية الأسرار عبر العصور 🔐📜",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "40 دقيقة",
    level: 0
  },
  'web-sec-01': {
    title: "ثغرات الويب: عندما يصبح المتصفح سلاحاً 🌐💉",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "45 دقيقة",
    level: 1
  },
  'crypto-intro-01': {
    title: "علم التشفير: حماية الأسرار عبر العصور 🔐📜",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.05.25",
    readTime: "40 دقيقة",
    level: 1
  },
  'rev-eng-01': {
    title: "أساسيات الهندسة العكسية: فك شفرة الآلة 🛠️🔍",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "75 دقيقة",
    level: 2
  },
  'malware-01': {
    title: "تحليل البرمجيات الخبيثة: المشرط الرقمي 🦠🔬",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "90 دقيقة",
    level: 2
  },
  'zero-day-01': {
    title: "منهجية البحث عن Zero-Day: الصيد في الظلام 🌑🏹",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "120 دقيقة",
    level: 3
  },
  'digital-forensics-03': {
    title: "التحقيق الجنائي الرقمي: كيف يتعقب المحققون أشباح السايبر؟ 🔍💻",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "85 دقيقة",
    level: 3
  },
  'incident-response-03': {
    title: "الاستجابة للحوادث: دورة حياة المعركة ضد الهجمات النشطة ⚡🛡️",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "90 دقيقة",
    level: 3
  },
  'zero-day-03': {
    title: "ثغرات اليوم الصفر: سلاح الدمار الشامل في الفضاء السيبراني 🌑💥",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "95 دقيقة",
    level: 3
  },
  'future-cyber-03': {
    title: "مستقبل السايبر: صراع العقول الاصطناعية والتشفير الكمي 🤖🌌",
    author: "كبير مهندسي محتوى السايبر",
    date: "2026.04.28",
    readTime: "100 دقيقة",
    level: 3
  }
};
