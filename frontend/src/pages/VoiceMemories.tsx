import React, { useState } from 'react';
import { 
  Search, 
  Mic, 
  Trash2, 
  Calendar, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  Download, 
  Radio, 
  FileDown, 
  Check, 
  X,
  Share2
} from 'lucide-react';
import { MemoryItem } from '../types';

interface VoiceMemoriesProps {
  memories: MemoryItem[];
  onDeleteMemory: (memoryId: string) => void;
  onOpenNewMemoryModal: () => void;
}

export const VoiceMemories: React.FC<VoiceMemoriesProps> = ({
  memories,
  onDeleteMemory,
  onOpenNewMemoryModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'omi' | 'voice' | 'manual'>('all');
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [memoryToDelete, setMemoryToDelete] = useState<string | null>(null);
  const [hasExported, setHasExported] = useState(false);

  const filteredMemories = memories.filter((mem) => {
    const matchesSearch = 
      mem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mem.summary && mem.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mem.transcript || mem.raw_transcript || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mem.topics && mem.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesSource = sourceFilter === 'all' || mem.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `voxcortex_vault_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setHasExported(true);
    setTimeout(() => setHasExported(false), 2500);
  };

  const handleExportMarkdownDigest = () => {
    const mdLines = [
      '# VoxCortex AI — Autonomous Cognitive Memory Digest',
      `*Generated on ${new Date().toLocaleString()} | Total Stored Memories: ${memories.length}*`,
      '',
      '---',
      ''
    ];

    memories.forEach((m, idx) => {
      mdLines.push(`## ${idx + 1}. ${m.title}`);
      mdLines.push(`- **Date**: ${new Date(m.timestamp || m.created_at).toLocaleString()}`);
      mdLines.push(`- **Source**: ${m.source.toUpperCase()}`);
      if (m.topics && m.topics.length > 0) {
        mdLines.push(`- **Key Topics**: ${m.topics.join(', ')}`);
      }
      mdLines.push('');
      mdLines.push('### Executive Summary');
      mdLines.push(m.summary || 'No summary recorded.');
      mdLines.push('');
      mdLines.push('### Raw Transcript');
      mdLines.push(`> ${m.transcript || m.raw_transcript || 'No transcript text.'}`);
      mdLines.push('');
      mdLines.push('---');
      mdLines.push('');
    });

    const blob = new Blob([mdLines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `voxcortex_digest_${Date.now()}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
    setHasExported(true);
    setTimeout(() => setHasExported(false), 2500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Filter & Search Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search transcripts, topics, or AI summaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 shadow-2xs"
          />
        </div>

        {/* Source Filter Tabs & Ingest CTA */}
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'omi', 'voice', 'manual'] as const).map((source) => (
            <button
              key={source}
              onClick={() => setSourceFilter(source)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                sourceFilter === source
                  ? 'bg-violet-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {source === 'all' ? 'All Channels' : source === 'omi' ? 'Mobile Sync' : source === 'voice' ? 'Direct Voice' : 'Manual'}
            </button>
          ))}

          {/* Export Dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={handleExportMarkdownDigest}
              title="Download Markdown Executive Digest"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Digest (.md)</span>
            </button>

            <button
              onClick={handleExportJSON}
              title="Download Raw JSON Archive"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>JSON</span>
            </button>

            <button
              onClick={onOpenNewMemoryModal}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-semibold shrink-0 hover:bg-violet-700 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Ingest Voice</span>
            </button>
          </div>
        </div>
      </div>

      {hasExported && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>VoxCortex memory archive successfully exported to your downloads folder.</span>
        </div>
      )}

      {/* Grid of Memory Cards */}
      {filteredMemories.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">No voice memories match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, select 'All Channels', or record a new conversation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-violet-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header & Source */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    mem.source === 'omi' || mem.source === 'mobile'
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' 
                      : mem.source === 'voice'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-violet-50 text-violet-700 border border-violet-200'
                  }`}>
                    {mem.source === 'omi' || mem.source === 'mobile' ? 'Mobile Voice' : mem.source === 'voice' ? 'Direct Mic' : 'Manual'}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(mem.created_at || mem.timestamp || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1">
                  {mem.title}
                </h4>

                {/* Summary */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {mem.summary || mem.transcript}
                </p>

                {/* Topics */}
                {mem.topics && mem.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {mem.topics.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedMemory(mem)}
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 transition-colors"
                >
                  <span>Review Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setMemoryToDelete(mem.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Memory Details Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  selectedMemory.source === 'omi' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-violet-50 text-violet-700 border border-violet-200'
                }`}>
                  {selectedMemory.source}
                </span>
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-md">{selectedMemory.title}</h3>
              </div>
              <button
                onClick={() => setSelectedMemory(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-violet-700">
                  <Sparkles className="w-3.5 h-3.5" /> Executive Summary
                </h4>
                <p className="text-slate-700 bg-violet-50/40 p-3.5 rounded-xl border border-violet-100 leading-relaxed">
                  {selectedMemory.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Full Dialogue Transcript</h4>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {selectedMemory.transcript || selectedMemory.raw_transcript}
                </div>
              </div>

              {selectedMemory.facts && selectedMemory.facts.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5">Extracted Key Facts</h4>
                  <ul className="space-y-1 list-disc pl-4 text-slate-600">
                    {selectedMemory.facts.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  AI Memory Vault: Synced & Active
                </span>
                <span>User: {selectedMemory.user_id}</span>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex justify-end">
              <button
                onClick={() => setSelectedMemory(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {memoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Delete this memory point?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will permanently remove the transcript and its semantic neural memory record. This action cannot be reversed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setMemoryToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteMemory(memoryToDelete);
                  setMemoryToDelete(null);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
