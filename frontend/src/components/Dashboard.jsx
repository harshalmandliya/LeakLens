import { ShieldAlert, ShieldCheck, FileText, Bot, AlertTriangle, Fingerprint } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

export function Dashboard({ result, onReset }) {
  const [maskData, setMaskData] = useState(true);
  
  const { summary, findings, risk_score, risk_level, insights } = result;

  const getRiskColors = (level) => {
    switch(level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRiskIcon = (level) => {
    if (level === 'critical' || level === 'high') return <ShieldAlert className="w-8 h-8 text-red-600" />;
    if (level === 'medium') return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
    return <ShieldCheck className="w-8 h-8 text-green-600" />;
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 px-2 lg:px-4">Analysis Results</h2>
        <button 
          onClick={onReset}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
        >
          Upload New File
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score Card */}
        <div className="col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 shadow-inner">
            {getRiskIcon(risk_level)}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Risk Score</p>
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-6xl font-black text-slate-900 tracking-tighter">{risk_score}</span>
              <span className="text-xl font-bold text-slate-300">/ 100</span>
            </div>
          </div>
          <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border", getRiskColors(risk_level))}>
            {risk_level} Risk
          </span>
        </div>

        {/* AI Insights Card */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-2xl shadow-lg border border-indigo-900/50 text-white flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
          
          <div className="flex items-center space-x-3 mb-6 relative z-10">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/5">
              <Bot className="w-6 h-6 text-indigo-300" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-indigo-50">AI Security Insights</h3>
          </div>
          
          <div className="space-y-6 relative z-10 flex-1">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <p className="text-indigo-100/90 text-[15px] leading-relaxed font-medium">
                {summary}
              </p>
            </div>
            {insights && insights.length > 0 && (
              <div className="pl-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400/80 mb-3">Key Recommendations</h4>
                <ul className="space-y-3">
                  {insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-[15px] text-indigo-50/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                      <span className="leading-snug">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Findings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
              <Fingerprint className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">Sensitive Data Map</h3>
              <p className="text-sm font-medium text-slate-500 mt-0.5">{findings.length} threat vectors detected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
             <span className="text-sm font-bold text-slate-600">Mask Values</span>
             <button 
               onClick={() => setMaskData(!maskData)}
               className={cn("w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-1", maskData ? "bg-indigo-600" : "bg-slate-200")}
             >
               <span className={cn("absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm", maskData ? "translate-x-6" : "translate-x-0" )}></span>
             </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider w-24">Line</th>
                <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider w-32">Type</th>
                <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Value Exposed</th>
                <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider w-32">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 bg-slate-50/20">
              {findings.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <ShieldCheck className="w-12 h-12 text-green-400" />
                      <p className="text-slate-500 font-medium text-lg">Clean log file. No sensitive data points identified.</p>
                    </div>
                  </td>
                </tr>
              )}
              {findings.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-slate-400 font-medium group-hover:text-indigo-600 transition-colors">#{f.line_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm uppercase tracking-wide">
                      {f.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md font-mono text-[13px] bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/60 overflow-hidden text-ellipsis text-slate-600 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                      {maskData ? f.value.replace(/./g, '•') : f.value}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={cn("w-2 h-2 rounded-full", f.risk_level === 'critical' ? 'bg-red-500 animate-pulse' : f.risk_level === 'high' ? 'bg-orange-500' : f.risk_level === 'medium' ? 'bg-yellow-500' : 'bg-green-500')}></div>
                      <span className={cn("font-bold capitalize text-xs tracking-wide", f.risk_level === 'critical' ? 'text-red-700' : f.risk_level === 'high' ? 'text-orange-700' : f.risk_level === 'medium' ? 'text-yellow-700' : 'text-green-700')}>
                        {f.risk_level}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
