import React, { useState, useEffect } from 'react';
import { useSettings } from '../lib/SettingsContext';
import { 
  Save, Globe, Palette, Mail, Image as ImageIcon, AlertCircle, 
  ShieldAlert, FileText, Plus, List, Trash2, Edit3, Settings, 
  Database, Layout, MessageSquare, Scale 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { checkAdmin, auth, db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export default function AdminSettings() {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'users' | 'forum'>('general');

  // Article Management State
  const [articles, setArticles] = useState<any[]>([]);
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    type: 'news',
    level: 0,
    category: 'جديد'
  });

  // Forum Management State
  const [forumPosts, setForumPosts] = useState<any[]>([]);

  useEffect(() => {
    const verify = async () => {
      const res = await checkAdmin();
      setIsAdmin(res);
      if (res) {
        fetchArticles();
        fetchForumPosts();
      }
    };
    verify();
  }, [auth.currentUser]);

  const fetchArticles = async () => {
    try {
      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Fetch failed:", e);
    }
  };

  const fetchForumPosts = async () => {
    try {
      const q = query(collection(db, 'forum_posts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setForumPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Fetch posts failed:", e);
    }
  };

  const handleSubmitSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(formData);
    setIsSaving(false);
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 3000);
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'articles'), {
        ...newArticle,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsAddingArticle(false);
      setNewArticle({ title: '', content: '', type: 'news', level: 0, category: 'جديد' });
      fetchArticles();
    } catch (e) {
      console.error("Add article failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    try {
      await deleteDoc(doc(db, 'articles', id));
      fetchArticles();
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنشور؟")) return;
    try {
      await deleteDoc(doc(db, 'forum_posts', id));
      fetchForumPosts();
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-cyber-accent animate-pulse font-mono uppercase text-xs">Authenticating_Admin_Status...</div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <ShieldAlert size={64} className="text-cyber-accent animate-bounce" />
        <div className="text-center">
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">ACCESS_DENIED</h1>
          <p className="text-cyber-muted text-xs uppercase tracking-widest mt-2">عذراً، هذا القسم مخصص لمديري النظام فقط</p>
        </div>
        <a href="/" className="bg-white text-black px-8 py-2 text-xs font-bold uppercase hover:bg-cyber-accent hover:text-white transition-all">العودة للرئيسية</a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-cyber-line pb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-cyber-accent text-white flex items-center justify-center shadow-[0_0_15px_rgba(230,25,25,0.4)]">
            <Database size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">ROOT_CMD</h1>
              <span className="bg-white text-black px-2 py-0.5 text-[8px] font-bold rounded-sm">ADMIN_V1</span>
            </div>
            <p className="text-cyber-muted text-[10px] uppercase tracking-widest font-mono mt-1 opacity-60">نظام التحكم المركزي - صلاحيات الوصول الكاملة</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1 bg-cyber-deep border border-cyber-line rounded">
          <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={Settings}>الإعدادات</TabButton>
          <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={FileText}>المحتوى</TabButton>
          <TabButton active={activeTab === 'forum'} onClick={() => setActiveTab('forum')} icon={MessageSquare}>المنتدى</TabButton>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'general' && (
          <motion.div 
            key="general"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-8">
              <section className="glass-panel p-6 border border-cyber-line space-y-6">
                <h2 className="text-xs font-bold text-cyber-accent uppercase tracking-widest flex items-center gap-2 border-b border-cyber-line pb-3">
                  <Globe size={14} /> هوية المنصة
                </h2>
                
                <div className="space-y-4">
                  <InputGroup label="اسم الموقع" value={formData.siteName} onChange={(v: string) => setFormData({...formData, siteName: v})} />
                  <InputGroup label="بريد التواصل الرسمي" value={formData.contactEmail} onChange={(v: string) => setFormData({...formData, contactEmail: v})} />
                </div>
              </section>

              <section className="glass-panel p-8 border border-cyber-line bg-cyber-accent/5">
                <div className="flex items-center gap-4">
                  <AlertCircle size={20} className="text-cyber-accent" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white uppercase">بروتوكول الصيانة</h3>
                    <p className="text-[10px] text-cyber-muted uppercase mt-0.5">تفعيل وضع الإغلاق التام للنظام</p>
                  </div>
                  <Toggle active={formData.maintenanceMode} onToggle={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})} />
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="glass-panel p-6 border border-cyber-line space-y-6 h-fit">
                <h2 className="text-xs font-bold text-cyber-accent uppercase tracking-widest flex items-center gap-2 border-b border-cyber-line pb-3">
                  <Palette size={14} /> المظهر والهوية
                </h2>
                
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-cyber-muted uppercase font-mono tracking-widest">اللون المحوري للنظام</label>
                    <div className="flex gap-4">
                      <input 
                        type="color" 
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-16 h-12 bg-transparent border border-cyber-line cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="flex-1 bg-black/50 border border-cyber-line p-3 text-xs text-white outline-none font-mono uppercase"
                      />
                    </div>
                  </div>

                  <InputGroup label="رابط شعار المنصة" value={formData.siteLogo} placeholder="https://..." onChange={(v: string) => setFormData({...formData, siteLogo: v})} />
                </div>

                <div className="pt-4 mt-6 border-t border-cyber-line/30 flex justify-end">
                   <button 
                     onClick={handleSubmitSettings}
                     disabled={isSaving}
                     className="bg-white text-black px-8 py-3 text-xs font-black uppercase tracking-tighter hover:bg-cyber-accent hover:text-white transition-all disabled:opacity-50"
                   >
                     {isSaving ? 'Updating...' : 'تحديث إعدادات النظام'}
                   </button>
                </div>
              </section>
            </div>
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div 
            key="content"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center bg-cyber-deep p-4 border border-cyber-line mb-8">
               <h3 className="text-xs font-bold text-cyber-accent uppercase tracking-widest flex items-center gap-2">
                 <List size={14} /> إدارة التقارير والمقالات
               </h3>
               <button 
                 onClick={() => setIsAddingArticle(!isAddingArticle)}
                 className="bg-cyber-accent text-white px-4 py-2 text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-white hover:text-black transition-all"
               >
                 <Plus size={14} /> {isAddingArticle ? 'إغلاق المحرر' : 'إضافة تقرير جديد'}
               </button>
            </div>

            {isAddingArticle && (
              <motion.form 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                onSubmit={handleAddArticle}
                className="glass-panel p-8 border border-cyber-accent/30 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="عنوان التقرير" value={newArticle.title} onChange={(v: string) => setNewArticle({...newArticle, title: v})} />
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-cyber-muted uppercase font-mono">نوع المحتوى</label>
                    <select 
                      value={newArticle.type}
                      onChange={(e) => setNewArticle({...newArticle, type: e.target.value})}
                      className="bg-black border border-cyber-line p-3 text-xs text-white outline-none"
                    >
                      <option value="news">خبر [NEWS]</option>
                      <option value="research">بحث [RESEARCH]</option>
                      <option value="lesson">درس [LESSON]</option>
                      <option value="legal">قانوني [LEGAL]</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-cyber-muted uppercase font-mono">نص التقرير (Markdown)</label>
                  <textarea 
                    rows={10}
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                    className="bg-black border border-cyber-line p-4 text-xs text-white outline-none font-mono"
                    placeholder="# أدخل المحتوى هنا..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setIsAddingArticle(false)} className="text-cyber-muted text-xs uppercase font-bold px-6 py-2">إلغاء</button>
                  <button 
                    disabled={isSaving}
                    type="submit" 
                    className="bg-cyber-accent text-white px-8 py-2 text-xs font-bold uppercase hover:bg-white hover:text-black transition-all"
                   >
                    {isSaving ? 'جاري النشر...' : 'نشر التقرير الآن'}
                  </button>
                </div>
              </motion.form>
            )}

            <div className="grid grid-cols-1 gap-4">
              {articles.map((article) => (
                <div key={article.id} className="glass-panel p-6 border border-cyber-line flex items-center justify-between group hover:border-cyber-accent/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black border border-cyber-line flex items-center justify-center text-cyber-muted group-hover:text-cyber-accent">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">{article.title}</h4>
                      <p className="text-[9px] text-cyber-muted font-mono uppercase mt-1">
                        TYPE: {article.type} | LEVEL: {article.level} | ID: {article.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteArticle(article.id)} className="p-2 text-cyber-muted hover:text-cyber-accent transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {articles.length === 0 && !isAddingArticle && (
                <div className="text-center py-20 border border-dashed border-cyber-line text-cyber-muted font-mono uppercase text-xs">No_Reports_Found_In_Registry</div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'forum' && (
          <motion.div 
            key="forum"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            <div className="bg-cyber-deep p-4 border border-cyber-line">
               <h3 className="text-xs font-bold text-cyber-accent uppercase tracking-widest flex items-center gap-2">
                 <MessageSquare size={14} /> رقابة المنتدى الأكاديمي
               </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {forumPosts.map((post) => (
                <div key={post.id} className="glass-panel p-6 border border-cyber-line flex items-center justify-between group hover:border-cyber-accent/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black border border-cyber-line flex items-center justify-center text-cyber-muted group-hover:text-cyber-accent">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">{post.title}</h4>
                      <p className="text-[9px] text-cyber-muted font-mono uppercase mt-1">
                        AUTHOR_ID: {post.authorId.slice(0, 8)} | DATE: {post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDeletePost(post.id)} className="p-2 text-cyber-muted hover:text-cyber-accent transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {forumPosts.length === 0 && (
                <div className="text-center py-20 border border-dashed border-cyber-line text-cyber-muted font-mono uppercase text-xs">No_Posts_Found_In_Forum</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
const TabButton = ({ active, onClick, icon: Icon, children }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${active ? 'bg-cyber-accent text-white shadow-lg' : 'text-cyber-muted hover:text-white'}`}
  >
    <Icon size={12} /> {children}
  </button>
);

const InputGroup = ({ label, value, onChange, placeholder = "" }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-cyber-muted uppercase font-mono tracking-widest">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-black/50 border border-cyber-line p-3 text-xs text-white focus:border-cyber-accent outline-none font-mono"
    />
  </div>
);

const Toggle = ({ active, onToggle }: any) => (
  <button 
    onClick={onToggle}
    className={`w-12 h-6 rounded-full p-1 transition-colors ${active ? 'bg-cyber-accent' : 'bg-slate-800'}`}
  >
    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? '-translate-x-6' : 'translate-x-0'}`} />
  </button>
);
