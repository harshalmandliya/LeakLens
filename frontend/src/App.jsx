import { useState } from 'react';
import { Shield } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-indigo-100 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-800 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-slate-900 block leading-none mb-1">Aegis Intelligence</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-600 block leading-none">Secure Data Platform</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-[3.5rem] sm:leading-[1.1] font-extrabold tracking-tight text-slate-900 mb-6">
            Detect Data Leaks with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">AI Precision</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
            Upload your logs, texts, and source files. Instantly identify exposed secrets, PII, and security risks with our advanced regex engine and OpenAI insights.
          </p>
        </div>

        {/* Dynamic Content */}
        {!result ? (
          <div className="animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
            <FileUpload
              onAnalysisComplete={setResult}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        ) : (
          <Dashboard result={result} onReset={() => setResult(null)} />
        )}

      </main>
    </div>
  );
}

export default App;
