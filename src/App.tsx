import React, { useState, useCallback } from 'react';
import { Upload, Link as LinkIcon, Globe, Zap, Check, Copy, RefreshCcw, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_ENDPOINT = 'https://australia-southeast1-hiddenlink.cloudfunctions.net/generate-stealth-link';

const App: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ stealthUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      handleFile(file);
    } else {
      setError('Please upload a PNG or JPG file.');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!targetUrl) {
      setError('Please enter a target URL.');
      return;
    }
    if (!logoFile) {
      setError('Please upload a logo.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Base64 the logo
      const reader = new FileReader();
      reader.readAsDataURL(logoFile);
      reader.onloadend = async () => {
        const base64Logo = (reader.result as string).split(',')[1];
        
        try {
          const response = await axios.post(API_ENDPOINT, {
            url: targetUrl,
            logo: base64Logo,
          });
          setResult(response.data);
        } catch (err: any) {
          setError(err.response?.data?.error || 'Failed to generate stealth link.');
        } finally {
          setLoading(false);
        }
      };
    } catch (err) {
      setError('An error occurred during processing.');
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.stealthUrl) {
      navigator.clipboard.writeText(result.stealthUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              HiddenLink
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-400">
            <span className="hover:text-indigo-400 transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-indigo-400 transition-colors cursor-pointer">API</span>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-indigo-400">Mission Control</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Configuration Section */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Generate Stealth Link</h2>
              <p className="text-slate-400">Mask your URLs behind custom branded metadata for elite presence.</p>
            </div>

            <div className="space-y-6 bg-slate-900/40 p-8 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
              {/* URL Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-indigo-400" />
                  Target URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-confidential-link.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                />
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  Branded Logo (PNG/JPG)
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className={cn(
                    "relative group cursor-pointer border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-4",
                    logoPreview 
                      ? "border-indigo-500/50 bg-indigo-500/5" 
                      : "border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50"
                  )}
                >
                  <input
                    id="logo-upload"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                  />
                  {logoPreview ? (
                    <div className="relative">
                      <img src={logoPreview} alt="Preview" className="h-20 w-auto rounded shadow-lg" />
                      <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full p-1 border-2 border-slate-900">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-slate-800 p-3 rounded-full group-hover:bg-indigo-600/20 group-hover:scale-110 transition-all duration-300">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                      </div>
                      <p className="text-sm text-slate-400 text-center">
                        <span className="text-indigo-400 font-semibold">Click to upload</span> or drag and drop<br />
                        PNG or JPG (max 2MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={cn(
                  "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg",
                  loading 
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-[0.98]"
                )}
              >
                {loading ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    Generate Stealth Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Live Preview</h2>
              <p className="text-slate-400">Comparison between standard and stealth appearance.</p>
            </div>

            <div className="space-y-6">
              {/* Original Preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <Globe className="w-3 h-3" />
                  Original View
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 opacity-60">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center">
                      <Globe className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-800 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-600 font-mono truncate">
                    {targetUrl || 'https://raw-unmasked-link.com/path/to/resource'}
                  </div>
                </div>
              </div>

              {/* Stealth Preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  Stealth Link (Branded)
                </div>
                <div className="bg-slate-900 border-2 border-indigo-500/30 rounded-xl p-6 shadow-2xl shadow-indigo-500/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2">
                    <div className="text-[10px] bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded font-bold border border-indigo-500/20">ACTIVE</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-700">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <ShieldCheck className="w-6 h-6 text-indigo-500" />
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-700/50 rounded w-5/6" />
                      <div className="h-3 bg-slate-700/30 rounded w-2/3" />
                    </div>
                  </div>
                  
                  {result ? (
                    <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="text-xs text-indigo-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> DEPLOYED SUCCESSFULLY
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 truncate">
                          {result.stealthUrl}
                        </div>
                        <button
                          onClick={copyToClipboard}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 pt-6 border-t border-slate-800 opacity-20">
                      <div className="h-10 bg-slate-800 rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 grayscale opacity-50">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">HIDDENLINK SYSTEM</span>
          </div>
          <p className="text-slate-500 text-xs">
            © 2026 HiddenLink Infrastructure. Australia-Southeast1 Node Active.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;