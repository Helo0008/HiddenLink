import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Globe, 
  Check, 
  Copy, 
  RefreshCcw, 
  ArrowRight,
  Sparkles,
  Type,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
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
  const [strength, setStrength] = useState(0.2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ stealthUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Logo Creation State
  const [isCreatingLogo, setIsCreatingLogo] = useState(false);
  const [logoPrompt, setLogoPrompt] = useState('');
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);

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

  const handleGenerateLogo = async () => {
    if (!logoPrompt) {
      setError('Please enter a logo prompt.');
      return;
    }
    setIsGeneratingLogo(true);
    setError(null);
    
    // Simulate DALL-E/Image Gen delay and placeholder
    // In a real app, this would call an image generation API
    setTimeout(() => {
      // Using a placeholder that looks like a clean minimalist logo
      const placeholderLogo = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(logoPrompt)}&backgroundColor=065f46&fontSize=45`;
      setLogoPreview(placeholderLogo);
      
      // Convert SVG/Remote URL to File object (simplified for demo)
      // For a real implementation, we'd fetch the blob and create a File
      fetch(placeholderLogo)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "generated-logo.png", { type: "image/png" });
          setLogoFile(file);
        });

      setIsGeneratingLogo(false);
    }, 2000);
  };

  const handleGenerate = async () => {
    if (!targetUrl) {
      setError('Please enter a target URL.');
      return;
    }
    if (!logoFile) {
      setError('Please upload or generate a logo.');
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
            strength: strength
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#065f46]/10">
      {/* Navigation */}
      <nav className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#065f46] rounded-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">HiddenLink</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide uppercase">
            <a href="#" className="hover:text-[#065f46] transition-colors">Showcase</a>
            <a href="#" className="hover:text-[#065f46] transition-colors">Process</a>
            <a href="#" className="hover:text-[#065f46] transition-colors">Studio</a>
            <button className="bg-[#1A1A1A] text-white px-5 py-2 rounded-full hover:bg-[#065f46] transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        {/* Hero Section */}
        <section className="max-w-3xl mb-24">
          <h1 className="text-5xl lg:text-7xl font-light tracking-tight mb-8 leading-[1.1]">
            Elevate your <span className="font-medium italic">digital identity</span> with invisible intelligence.
          </h1>
          <p className="text-xl text-black/60 font-light leading-relaxed">
            A boutique utility for high-end brands to weave stealth QR capabilities directly into their visual assets. Minimalist, powerful, and human-centric.
          </p>
        </section>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Configuration Column */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Step 1: Destination */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-black/40 bg-black/5 w-6 h-6 rounded-full flex items-center justify-center">01</span>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Define Destination</h2>
              </div>
              <div className="relative group">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 group-focus-within:text-[#065f46] transition-colors" />
                <input
                  type="url"
                  placeholder="Enter target URL (e.g., https://yourstudio.com)"
                  className="w-full bg-white border border-black/10 rounded-none px-12 py-5 text-lg font-light focus:outline-none focus:border-[#065f46] transition-all placeholder:text-black/20 shadow-sm"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Step 2: Visual Asset */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-black/40 bg-black/5 w-6 h-6 rounded-full flex items-center justify-center">02</span>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Visual Asset</h2>
                </div>
                <div className="flex bg-black/5 p-1 rounded-full">
                  <button 
                    onClick={() => setIsCreatingLogo(false)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all",
                      !isCreatingLogo ? "bg-white text-[#1A1A1A] shadow-sm" : "text-black/40 hover:text-black/60"
                    )}
                  >
                    Upload
                  </button>
                  <button 
                    onClick={() => setIsCreatingLogo(true)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all",
                      isCreatingLogo ? "bg-white text-[#1A1A1A] shadow-sm" : "text-black/40 hover:text-black/60"
                    )}
                  >
                    Create
                  </button>
                </div>
              </div>

              {!isCreatingLogo ? (
                /* Upload Mode */
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className={cn(
                    "relative group cursor-pointer border border-dashed rounded-none p-16 transition-all flex flex-col items-center justify-center gap-6 bg-white",
                    logoPreview 
                      ? "border-[#065f46]/30 bg-[#065f46]/[0.02]" 
                      : "border-black/10 hover:border-[#065f46]/50 hover:bg-black/[0.01]"
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
                    <div className="relative group/preview">
                      <img src={logoPreview} alt="Preview" className="h-32 w-auto object-contain transition-transform group-hover/preview:scale-105" />
                      <div className="absolute -top-3 -right-3 bg-[#065f46] text-white rounded-full p-1.5 shadow-lg">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 border border-black/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 bg-white shadow-sm">
                        <Upload className="w-6 h-6 text-black/20 group-hover:text-[#065f46]" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium">Drag brand asset here</p>
                        <p className="text-xs text-black/40">PNG, JPG up to 5MB</p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Create Mode */
                <div className="bg-white border border-black/10 p-8 space-y-6 shadow-sm">
                  <div className="space-y-4">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-black/40">Logo Concept Prompt</label>
                    <textarea
                      placeholder="e.g. A minimalist deep emerald monogram for a high-end architectural firm..."
                      className="w-full bg-[#FAF9F6] border border-black/5 rounded-none px-4 py-4 text-sm font-light focus:outline-none focus:border-[#065f46] transition-all min-h-[100px] resize-none"
                      value={logoPrompt}
                      onChange={(e) => setLogoPrompt(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleGenerateLogo}
                      disabled={isGeneratingLogo || !logoPrompt}
                      className="flex-1 bg-[#1A1A1A] text-white py-4 rounded-none text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#065f46] disabled:bg-black/10 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                    >
                      {isGeneratingLogo ? (
                        <RefreshCcw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Type className="w-4 h-4" />
                          Generate Visual
                        </>
                      )}
                    </button>
                    {logoPreview && (
                      <div className="w-20 h-20 border border-black/5 p-2 bg-white">
                        <img src={logoPreview} alt="Generated" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Intensity */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-black/40 bg-black/5 w-6 h-6 rounded-full flex items-center justify-center">03</span>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Encryption Intensity</h2>
                </div>
                <span className="text-[13px] font-medium text-[#065f46] bg-[#065f46]/5 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {Math.round(strength * 100)}% scannability
                </span>
              </div>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.01"
                  value={strength}
                  onChange={(e) => setStrength(parseFloat(e.target.value))}
                  className="w-full h-[2px] bg-black/5 rounded-lg appearance-none cursor-pointer accent-[#065f46]"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-black/30 font-bold">
                  <span>Stealth (0.05)</span>
                  <span>Clarity (0.50)</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-8">
              {error && (
                <div className="mb-8 p-5 bg-red-50 text-red-900/60 border-l-2 border-red-900/20 text-xs font-medium flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-900/40" />
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="group w-full bg-[#1A1A1A] text-white py-6 rounded-none text-sm font-bold uppercase tracking-[0.3em] hover:bg-[#065f46] disabled:bg-black/10 disabled:text-black/20 disabled:cursor-not-allowed transition-all duration-500 relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-4">
                  {loading ? (
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Synthesize Link</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#065f46] to-[#047857] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>

          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-12">
            
            <div className="space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-black/40">Studio Preview</h2>
              
              <div className="relative group">
                {/* Background Shadow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#065f46]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl" />
                
                <div className="relative bg-white border border-black/5 p-12 lg:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] text-center space-y-10">
                  <div className="flex justify-center">
                    <div className="w-32 h-32 bg-[#FAF9F6] border border-black/5 p-4 flex items-center justify-center relative">
                      {result ? (
                        <img src={result.stealthUrl} alt="Final" className="w-full h-full object-contain animate-in fade-in zoom-in duration-1000" />
                      ) : logoPreview ? (
                        <img src={logoPreview} alt="Pending" className="w-full h-full object-contain opacity-40 grayscale" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-black/5" />
                      )}
                      
                      {result && (
                        <div className="absolute -bottom-2 -right-2 bg-[#065f46] text-white p-1 rounded-full shadow-xl">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-[1px] w-12 bg-black/10 mx-auto" />
                    <h3 className="text-xl font-light tracking-tight italic">
                      {result ? "Synthesis Complete" : "Awaiting Assets"}
                    </h3>
                    <p className="text-xs text-black/40 leading-relaxed max-w-[240px] mx-auto uppercase tracking-wider font-medium">
                      {result 
                        ? "Your stealth asset is ready for deployment across digital channels." 
                        : "Configure your link and visual asset to preview the final branded outcome."}
                    </p>
                  </div>

                  {result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="p-4 bg-[#FAF9F6] border border-black/5 font-mono text-[11px] text-[#065f46] break-all">
                        {result.stealthUrl}
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={copyToClipboard}
                          className="flex-1 bg-white border border-[#1A1A1A] text-[#1A1A1A] py-4 rounded-none text-[11px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy URL
                            </>
                          )}
                        </button>
                        <a
                          href={result.stealthUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-14 bg-[#FAF9F6] border border-black/5 flex items-center justify-center hover:bg-black/5 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-black/60" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Design Principles Note */}
            <div className="bg-black/5 p-8 border-l-2 border-[#065f46]/30">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4">The Methodology</h4>
              <p className="text-[12px] text-black/50 leading-relaxed font-light italic">
                "Good design is obvious. Great design is transparent. We believe the most effective connections are the ones that feel native to the human eye, yet carry digital intent."
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Boutique Footer */}
      <footer className="mt-40 border-t border-black/5 bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#065f46] rounded-sm" />
              <span className="text-lg font-semibold tracking-tight">HiddenLink</span>
            </div>
            <p className="text-sm text-black/40 max-w-xs leading-relaxed">
              Synthesizing brand aesthetics with stealth scannability. Built for the modern creative studio.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest">Global Nodes</h4>
            <ul className="text-sm text-black/60 space-y-3 font-light">
              <li className="flex items-center gap-2 underline underline-offset-4 decoration-black/10">Australia-Southeast1</li>
              <li className="text-black/20">Europe-West4 (Soon)</li>
              <li className="text-black/20">US-East1 (Soon)</li>
            </ul>
          </div>
          <div className="space-y-6 text-right">
            <h4 className="text-xs font-bold uppercase tracking-widest">Connect</h4>
            <div className="flex justify-end gap-4">
              <div className="w-10 h-10 border border-black/5 flex items-center justify-center hover:bg-black/[0.02] cursor-pointer transition-colors">
                <Globe className="w-4 h-4 text-black/40" />
              </div>
            </div>
            <p className="text-[10px] text-black/20 uppercase tracking-tighter">
              © 2026 HiddenLink System. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;