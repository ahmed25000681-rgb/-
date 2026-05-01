import React, { useState } from 'react';
import { ShieldAlert, Send, CheckCircle, RefreshCcw } from 'lucide-react';
import { auth } from '../lib/firebase';
import { sendEmailVerification } from 'firebase/auth';

export const VerificationBanner = () => {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = auth.currentUser;

    if (!user || user.emailVerified) return null;

    const handleResend = async () => {
        setLoading(true);
        try {
            await sendEmailVerification(user);
            setSent(true);
        } catch (error) {
            console.error("🛡️ Verification Email Failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-cyber-accent/20 border-b border-cyber-accent py-3 px-8 flex items-center justify-between animate-in fade-in slide-in-from-top duration-700">
            <div className="flex items-center gap-3 text-cyber-accent">
                <ShieldAlert size={16} className="animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest glitch-text">
                    بروتوكول التحقق: هويتك الرقمية غير مكتملة. الهوية المجهولة قد تؤدي إلى عزل الحساب. [Verify NOW]
                </span>
            </div>
            
            <div className="flex items-center gap-4">
                {sent ? (
                    <div className="flex items-center gap-2 text-cyber-accent text-[10px] font-bold uppercase">
                        <CheckCircle size={14} />
                        تم إرسال مفتاح التوثيق
                    </div>
                ) : (
                    <button 
                        onClick={handleResend}
                        disabled={loading}
                        className="flex items-center gap-2 text-white bg-cyber-accent shadow-[0_0_15px_rgba(230,25,25,0.4)] px-3 py-1.5 rounded-none text-[10px] font-bold uppercase transition-all tracking-tighter disabled:opacity-50"
                        id="verify-email-button"
                    >
                        {loading ? <RefreshCcw size={12} className="animate-spin" /> : <Send size={12} />}
                        إرسال رابط التوثيق [Protocol]
                    </button>
                )}
                
                <button 
                    onClick={() => window.location.reload()}
                    className="text-cyber-muted hover:text-white text-[10px] font-bold uppercase border-l border-cyber-line pr-4"
                >
                    تحديث الحالة
                </button>
            </div>
        </div>
    );
};
