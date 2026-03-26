import { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function FileUpload({ onAnalysisComplete, isLoading, setIsLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError(null);
    if (!file.name.endsWith('.log') && !file.name.endsWith('.txt')) {
      setError("Please upload a valid .log or .txt file.");
      return;
    }
    
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Upload failed.");
      }
      
      const data = await response.json();
      onAnalysisComplete(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-2xl transition-all duration-200 ease-in-out bg-white p-8 overflow-hidden group",
          dragActive ? "border-indigo-500 bg-indigo-50 scale-105" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept=".log,.txt" 
          onChange={handleChange}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-slate-700 animate-pulse">Analyzing file securely...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-indigo-100 rounded-full group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-12 h-12 text-indigo-600" />
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-800">Upload Log File for Analysis</p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">Drag and drop your .log or .txt file here, or click to browse. We will securely scan for exposed secrets and PII.</p>
            </div>
            <button 
              onClick={() => inputRef.current?.click()}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm focus:ring-4 focus:ring-indigo-100"
            >
              Select File
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 flex items-start space-x-3 text-red-800 border border-red-100 shadow-sm animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}
