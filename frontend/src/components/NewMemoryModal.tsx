import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Sparkles, ArrowRight, Loader2, AlertCircle, Radio, Volume2 } from 'lucide-react';
import { api } from '../services/api';
import { WorkflowExecution } from '../types';

interface NewMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (execution: WorkflowExecution) => void;
}

const PRESET_TRANSCRIPTS = [
  {
    title: 'Sprint Planning: Latency & Quantization Sync',
    source: 'manual',
    text: "During the sprint planning, David and Elena committed to reducing vector retrieval latency to sub-300ms using semantic memory indexing. I must submit the updated Lyzr prompt template by Friday morning, and David needs to review the webhook signature middleware."
  },
  {
    title: 'Enterprise Architecture & Tenant Privacy Review',
    source: 'manual',
    text: "Had a 30-minute sync with Marcus from FinCorp. He emphasized that all audio transcripts must remain strictly isolated per tenant. No external training on customer transcripts. Follow-up action: draft the SOC-2 compliance checklist for memory vector storage by October 20th."
  },
  {
    title: 'Mobile Voice Test: Speech Clarity & Action Items',
    source: 'omi',
    text: "Field test log for mobile voice recording. Microphones captured conversation across a noisy cafe clearly. Multi-agent pipeline parsed action items and successfully saved memory vectors."
  }
];

export const NewMemoryModal: React.FC<NewMemoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState<'manual' | 'omi' | 'voice'>('voice');
  const [transcript, setTranscript] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live Microphone Speech Recognition
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  if (!isOpen) return null;

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsRecording(false);
    } else {
      try {
        setError(null);
        setSource('voice');
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e: any) {
        console.warn('Could not start recognition:', e);
        setIsRecording(false);
      }
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_TRANSCRIPTS[0]) => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    setTitle(preset.title);
    setSource(preset.source as any);
    setTranscript(preset.text);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const execution = await api.ingestTranscript({
        title: title.trim() || undefined,
        source,
        transcript: transcript.trim()
      });

      onSuccess(execution);
      onClose();
      // Reset
      setTitle('');
      setTranscript('');
    } catch (err: any) {
      console.error('Ingestion failed:', err);
      setError(err?.message || 'Failed to process transcript with VoxCortex multi-agent pipeline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Ingest Voice Memory into VoxCortex</h2>
              <p className="text-xs text-slate-500">Record in real-time or paste dialogue for Lyzr Multi-Agent ingestion</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isRecording && recognitionRef.current) recognitionRef.current.stop();
              onClose();
            }}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" /> Presets:
          </span>
          {PRESET_TRANSCRIPTS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleApplyPreset(p)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-violet-300 transition-all shrink-0 whitespace-nowrap shadow-2xs"
            >
              {p.title.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Conversation Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Product Strategy Sync with Team"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Source Channel
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="voice">Direct Voice Recording</option>
                <option value="omi">Mobile Voice Sync</option>
                <option value="manual">Manual Entry</option>
              </select>
            </div>
          </div>

          {/* Voice Recording Control Banner */}
          {speechSupported && (
            <div className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
              isRecording 
                ? 'bg-rose-50/80 border-rose-200 text-rose-900 shadow-sm' 
                : 'bg-violet-50/60 border-violet-100 text-slate-700'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isSubmitting}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isRecording 
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30 animate-pulse' 
                      : 'bg-violet-600 hover:bg-violet-700 text-white shadow-xs'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Start Live Speech-to-Text'}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <div>
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    {isRecording ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-rose-700">Listening to your voice...</span>
                      </>
                    ) : (
                      <span className="text-slate-800">Browser Voice Dictation</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isRecording ? 'Speak clearly. Live transcript streams below.' : 'Click mic to record directly through your microphone.'}
                  </p>
                </div>
              </div>

              {isRecording && (
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce" />
                </div>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Spoken Dialogue Transcript <span className="text-violet-600">*</span>
              </label>
              <span className="text-[10px] text-slate-400">
                Word count: {transcript.trim() ? transcript.trim().split(/\s+/).length : 0}
              </span>
            </div>
            <textarea
              required
              rows={5}
              placeholder="Speak via microphone above, or paste raw transcript here (minimum 5 words)..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Processing progress display */}
          {isSubmitting && (
            <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-200 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-violet-600 animate-spin shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-violet-900">Coordinating VoxCortex Multi-Agent Pipeline</div>
                <div className="text-violet-700">Manager routing, Summarizer, Task Extractor, and Memory Vault indexing...</div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                if (isRecording && recognitionRef.current) recognitionRef.current.stop();
                onClose();
              }}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !transcript.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <span>Process with VoxCortex Agents</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
