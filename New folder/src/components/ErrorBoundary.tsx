import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🛡️ Academy Error Boundary caught an exception:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 grayscale">
          <div className="max-w-md w-full bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle size={32} />
              <h2 className="text-2xl font-bold font-mono tracking-tighter">SYSTEM_FAILURE</h2>
            </div>
            
            <p className="text-gray-600 mb-6 font-medium">
              وقع خطأ تقني في عرض المحتوى. قد يكون هذا ناتجاً عن فشل في جلب البيانات أو مشكلة في المعالجة.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-bold hover:bg-gray-800 transition-colors"
                id="retry-button"
              >
                <RefreshCcw size={18} />
                تحديث الصفحة [Reload]
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 border-2 border-black px-6 py-3 font-bold hover:bg-gray-50 transition-colors"
                id="home-button"
              >
                <Home size={18} />
                العودة للرئيسية [Home]
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded text-xs font-mono text-red-700 overflow-auto max-h-32">
                {this.state.error?.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
