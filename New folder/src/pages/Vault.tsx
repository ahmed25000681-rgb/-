import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, FileText, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DocRow = ({ doc, delay }: any) => (
  <Link to={`/article/${doc.id}`}>
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="group flex flex-col md:flex-row md:items-center gap-6 p-6 border-b border-cyber-line hover:bg-slate-900/40 transition-colors cursor-pointer"
    >
      <div className="w-10 h-10 bg-cyber-deep border border-cyber-line rounded-sm flex items-center justify-center group-hover:border-cyber-accent transition-colors">
        <FileText size={16} className="text-cyber-muted group-hover:text-cyber-accent" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1.5">
           <span className="text-[9px] font-mono text-cyber-accent uppercase tracking-widest px-2 py-0.5 border border-cyber-accent/20 rounded-sm">{doc.category || doc.type}</span>
           <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">
             {doc.createdAt?.seconds ? new Date(doc.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'أرشيف'}
           </span>
        </div>
        <h3 className="text-sm font-bold text-white uppercase group-hover:text-cyber-accent transition-colors tracking-wide">{doc.title}</h3>
        <p className="text-[10px] text-cyber-muted italic mt-1 font-mono tracking-tight line-clamp-1">{doc.abstract || doc.content?.substring(0, 100) + '...'}</p>
      </div>
      
      <div className="flex items-center gap-2 text-cyber-muted">
         <div className="p-2 hover:bg-cyber-accent/10 hover:text-cyber-accent rounded-sm transition-colors border border-transparent hover:border-cyber-accent/20" title="عرض المصدر"><ExternalLink size={14} /></div>
         <div className="p-2 hover:bg-cyber-accent/10 hover:text-cyber-accent rounded-sm transition-colors border border-transparent hover:border-cyber-accent/20" title="دخول الأرشيف"><Download size={14} /></div>
      </div>
    </motion.div>
  </Link>
);

export default function Vault() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const fetched = snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data()
      }));
      setDocs(fetched);
    } catch (e) {
      console.error("Fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = docs.filter(d => 
    d.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-cyber-line">
        <div>
          <div className="text-[10px] text-cyber-accent font-mono mb-2 uppercase tracking-[0.4em]">مستودع الموارد والتقارير</div>
          <h1 className="text-3xl font-light text-white uppercase tracking-tighter flex items-center gap-3">
            الـ <span className="font-bold">مستودع</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchDocs}
            className="p-2 text-cyber-muted hover:text-cyber-accent transition-colors border border-cyber-line rounded-sm bg-cyber-deep"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-muted" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="تصفية المستندات والتقارير..." 
              className="w-full bg-cyber-deep border border-cyber-line rounded-sm py-2 pr-9 pl-4 text-[10px] font-mono uppercase focus:outline-none focus:border-cyber-accent focus:bg-slate-900 transition-all text-white placeholder:text-slate-600"
            />
          </div>
        </div>
      </header>

      <div className="bg-cyber-deep border border-cyber-line rounded shadow-2xl relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="text-cyber-accent font-mono text-[10px] uppercase animate-pulse">Syncing_Records...</div>
          </div>
        ) : filteredDocs.length > 0 ? (
          filteredDocs.map((doc, i) => (
            <DocRow key={doc.id} doc={doc} delay={i * 0.05} />
          ))
        ) : (
          <div className="py-20 text-center text-cyber-muted font-mono uppercase text-xs">
            {searchTerm ? 'No_Matches_In_Local_Index' : 'No_Records_Found_In_Vault'}
          </div>
        )}
      </div>
      
      <footer className="mt-12 text-center border-t border-dashed border-cyber-line pt-8">
        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em] flex items-center justify-center gap-4">
          <span>حجم الفهرس: {docs.length}</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>مستوى الأمان: مصادق_عليه</span>
        </p>
      </footer>
    </div>
  );
}
