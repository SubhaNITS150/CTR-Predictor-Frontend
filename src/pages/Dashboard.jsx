import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { predictTextCTR, predictImageCTR } from '../services/api';

const MAX_CHARS = 300;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);
  const { setPrediction, loading, setLoading } = useApp();
  const navigate = useNavigate();

  // ----------------------------
  // IMAGE HANDLER
  // ----------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ----------------------------
  // REAL API PREDICT HANDLER
  // ----------------------------
  const handlePredict = async (type) => {
    try {
      if (type === 'text' && !text.trim()) {
        alert('Text input is empty');
        return;
      }

      if (type === 'image' && !image) {
        alert('No image uploaded');
        return;
      }

      setLoading(true);

      let response;
      let prediction;

      // -------- TEXT AD --------
      if (type === 'text') {
        response = await predictTextCTR(text);

        prediction = {
          ctr: response.data.predicted_ctr,          // ✅ FIX
          label: response.data.ctr_label,             // ✅ FIX
          features: response.data.features,           // ✅ FIX
          type: 'text'
        };
      }

      // -------- IMAGE AD --------
      if (type === 'image') {
        const formData = new FormData();
        formData.append('file', image);

        response = await predictImageCTR(formData);

        prediction = {
          ctr: response.data.predicted_ctr,          
          label: response.data.ctr_label,             
          features: response.data.features,           
          ocrText: response.data.ocr_text,
          type: 'image'
        };
      }

      console.log("✅ Prediction saved to context:", prediction);

      setPrediction(prediction);
      navigate('/results', { state: { prediction } });

    } catch (error) {
      console.error(error);
      alert('Prediction failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col min-h-screen">
      {/* Header Section - shrink so cards get remaining space */}
      <header className="text-center mb-6 md:mb-8 shrink-0 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          CTR Predictor <span className="text-violet-400">&</span> Ad Analyzer
        </h1>
        <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
          Analyze your text and image ads to predict Click-Through Rate (CTR).
          Select the type of ad you want to analyze below.
        </p>
      </header>

      {/* Main Glass Panel - fills remaining viewport height; on mobile one card fills it */}
      <div className="glass-panel flex-1 min-h-0 flex flex-col w-full rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-2xl">
        {/* Tab Navigation - shrink so content area gets height */}
        <nav className="flex shrink-0 border-b border-white/5 bg-white/5 backdrop-blur-md">
          {['text', 'image'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-0 py-3.5 text-xs md:text-sm font-semibold tracking-[0.12em] transition-all duration-500 ${activeTab === tab
                ? 'text-violet-400 border-b-2 border-violet-500 bg-violet-500/10'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
            >
              {tab.toUpperCase()} AD ANALYSIS
            </button>
          ))}
        </nav>

        {/* Analysis Section Grid - flex-1 so cards cover viewport height (laptop: both cards; mobile: one card full height) */}
        <div className="flex-1 min-h-0 flex flex-col p-4 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-10 items-stretch h-full min-h-0">
            {/* Left Side: Text Input Card - min-h-full so it fills viewport height; on mobile hidden when image tab active */}
            <section
              className={`analysis-card p-6 md:p-10 rounded-[2rem] border transition-all duration-700 flex flex-col justify-between min-h-full ${activeTab !== 'text' ? 'hidden lg:flex' : ''} ${activeTab === 'text'
                ? 'border-violet-500/40 bg-violet-500/5 shadow-[0_0_50px_-15px_rgba(139,92,246,0.3)] scale-[1.03] z-20'
                : 'border-white/5 bg-black/40 opacity-40 grayscale-[0.8] scale-[0.98]'
                }`}
            >
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-4">
                  <span className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_15px_#8b5cf6]"></span>
                  Text Ad Analysis
                </h3>
                <div className="relative group">
                  <textarea
                    className="w-full h-56 bg-black/60 border border-white/10 rounded-2xl p-6 text-zinc-200 focus:border-violet-500/50 outline-none transition-all resize-none placeholder:text-zinc-800 text-lg leading-relaxed shadow-inner"
                    placeholder="It takes time for the first time! Please hold on"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <div className="absolute bottom-5 right-5 text-[11px] font-mono text-zinc-600 tracking-widest bg-black/40 px-2 py-1 rounded">
                    {text.length} / 300
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={() => handlePredict('text')}
                className="mt-10 w-full py-5 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white font-black text-lg rounded-2xl transition-all shadow-[0_15px_30px_-10px_rgba(139,92,246,0.5)] active:scale-[0.98] flex justify-center items-center gap-4 group"
              >
                {loading && activeTab === 'text' ? <LoadingSpinner /> : (
                  <>
                    <span>PREDICT CTR</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </>
                )}
              </button>
            </section>

            {/* Right Side: Image Upload Card - min-h-full so it fills viewport height; on mobile hidden when text tab active */}
            <section
              className={`analysis-card p-6 md:p-10 rounded-[2rem] border transition-all duration-700 flex flex-col justify-between min-h-full ${activeTab !== 'image' ? 'hidden lg:flex' : ''} ${activeTab === 'image'
                ? 'border-violet-500/40 bg-violet-500/5 shadow-[0_0_50px_-15px_rgba(139,92,246,0.3)] scale-[1.03] z-20'
                : 'border-white/5 bg-black/40 opacity-40 grayscale-[0.8] scale-[0.98]'
                }`}
            >
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-4">
                  <span className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_15px_#8b5cf6]"></span>
                  Image Ad Analysis
                </h3>
                <div className="relative border-2 border-dashed border-white/10 rounded-[2rem] p-12 group hover:border-violet-500/30 transition-all cursor-pointer flex flex-col items-center justify-center bg-black/40 min-h-[250px] shadow-inner">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-30"
                    onChange={handleImageChange}
                  />

                  {preview ? (
                    <div className="relative w-full h-48 animate-in zoom-in-95 duration-500">
                      <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
                      <div className="absolute -top-3 -right-3 bg-violet-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg animate-bounce">
                        IMAGE READY
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-violet-500/20 group-hover:rotate-6 transition-all duration-500">
                        <svg className="w-10 h-10 text-zinc-600 group-hover:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-200 text-lg font-bold">Drag & drop ad asset</p>
                        <p className="text-zinc-600 text-xs mt-2 uppercase tracking-[0.2em]">High-res PNG or JPG preferred</p>
                      </div>
                      <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black rounded-xl border border-white/10 transition-all uppercase tracking-widest">
                        Select File
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                disabled={loading || !image}
                onClick={() => handlePredict('image')}
                className="mt-10 w-full py-5 bg-zinc-900 border border-white/10 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl transition-all active:scale-[0.98] flex justify-center items-center gap-4 group"
              >
                {loading && activeTab === 'image' ? <LoadingSpinner /> : (
                  <>
                    <span>PREDICT CTR</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </>
                )}
              </button>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
