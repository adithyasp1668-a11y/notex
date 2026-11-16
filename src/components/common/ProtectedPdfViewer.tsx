import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  ShieldAlert, 
  Lock, 
  Maximize2,
  FileCheck2,
  DownloadCloud
} from 'lucide-react';
import { NoteItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProtectedPdfViewerProps {
  note: NoteItem;
  onClose: () => void;
}

export const ProtectedPdfViewer: React.FC<ProtectedPdfViewerProps> = ({ note, onClose }) => {
  const { user, isPurchased, purchasedNotes } = useApp();
  const purchased = isPurchased(note.id);
  const purchaseRecord = purchasedNotes.find(p => p.noteId === note.id && p.status === 'COMPLETED');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Available sample pages or full pages
  const totalPages = purchased ? note.pagesCount : Math.min(3, note.samplePreviewPages.length);
  const purchaseId = purchaseRecord ? purchaseRecord.referenceId : 'NTX-PREVIEW-SAMPLE';
  const buyerName = user.name.toUpperCase();
  const maskedEmail = user.email.replace(/(.{2})(.*)(?=@)/, (_gp1, h, rest) => h + '*'.repeat(rest.length));

  // Render canvas with realistic document content + dynamic forensic watermark
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI canvas dimensions
    const width = 800 * (zoomLevel / 100);
    const height = 1130 * (zoomLevel / 100);
    const scale = window.devicePixelRatio || 2;

    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(scale, scale);

    // Background sheet (Clean paper)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Subtle paper header border
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Header info
    ctx.fillStyle = '#1E3A8A';
    ctx.font = `bold ${Math.max(12, 16 * (zoomLevel / 100))}px sans-serif`;
    ctx.fillText(`${note.subject.toUpperCase()} (${note.subjectCode})`, 50, 65);

    ctx.fillStyle = '#64748B';
    ctx.font = `${Math.max(10, 12 * (zoomLevel / 100))}px sans-serif`;
    ctx.fillText(`VTU ${note.semester}th Semester • ${note.branch} | Curated by ${note.creatorName} (${note.creatorCollege})`, 50, 85);

    // Horizontal line
    ctx.strokeStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.moveTo(50, 95);
    ctx.lineTo(width - 50, 95);
    ctx.stroke();

    // Body content simulation for this page
    const currentModule = note.modules[(currentPage - 1) % note.modules.length] || `Chapter ${currentPage}: Academic Principles`;
    
    ctx.fillStyle = '#0F172A';
    ctx.font = `bold ${Math.max(14, 20 * (zoomLevel / 100))}px sans-serif`;
    ctx.fillText(`Page ${currentPage}: ${currentModule}`, 50, 135);

    // Paragraph bullets
    const sampleTopics = [
      '1. Key Theoretical Concept & Definitions (As per Visvesvaraya Technological University Syllabus)',
      '2. Mathematical Formulation & Step-by-step Derivation',
      '3. Solved Numerical Problem from Recent VTU Question Papers',
      '4. Architecture Diagram & Signal Flow Representation',
      '5. Exam High-Yield Points & Common Mistakes to Avoid'
    ];

    ctx.fillStyle = '#334155';
    ctx.font = `${Math.max(11, 14 * (zoomLevel / 100))}px sans-serif`;
    sampleTopics.forEach((topic, idx) => {
      ctx.fillText(topic, 50, 175 + idx * 36);
    });

    // Simulated technical diagram or box
    const boxY = 380 * (zoomLevel / 100);
    const boxHeight = 220 * (zoomLevel / 100);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(50, boxY, width - 100, boxHeight);
    ctx.strokeStyle = '#93C5FD';
    ctx.strokeRect(50, boxY, width - 100, boxHeight);

    ctx.fillStyle = '#1D4ED8';
    ctx.font = `bold ${Math.max(11, 13 * (zoomLevel / 100))}px sans-serif`;
    ctx.fillText('CORE DERIVATION / BLOCK FLOW MODEL', 70, boxY + 30);

    ctx.fillStyle = '#475569';
    ctx.font = `${Math.max(10, 12 * (zoomLevel / 100))}px monospace`;
    ctx.fillText('H(s) = Y(s) / X(s) = Σ [ P_k * Δ_k ] / Δ   [Mason\'s Gain Formula]', 70, boxY + 65);
    ctx.fillText('Condition for bounded stability: All poles must lie in Left Half of s-plane.', 70, boxY + 95);
    ctx.fillText('Verified against 2022, 2023 VTU Winter Exam marking scheme.', 70, boxY + 125);

    // Page footer
    ctx.fillStyle = '#94A3B8';
    ctx.font = `${Math.max(9, 11 * (zoomLevel / 100))}px sans-serif`;
    ctx.fillText(`NoteX Verified Student Edition • Page ${currentPage} of ${totalPages}`, 50, height - 45);

    // -------------------------------------------------------------
    // CRITICAL: DYNAMIC FORENSIC WATERMARK OVERLAY (Master Prompt §10, 11)
    // -------------------------------------------------------------
    ctx.save();
    ctx.rotate(-30 * (Math.PI / 180));
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)'; // Semi-transparent visible red/slate watermark
    ctx.font = `bold ${Math.max(13, 16 * (zoomLevel / 100))}px sans-serif`;

    const watermarkLine1 = `LICENSED TO: ${buyerName}`;
    const watermarkLine2 = `NOTEX ID: ${purchaseId} • ${maskedEmail}`;
    const watermarkLine3 = `CONFIDENTIAL • DO NOT REDISTRIBUTE`;

    // Repeat across entire page coordinate space
    for (let x = -width; x < width * 2; x += 320) {
      for (let y = -height; y < height * 2; y += 220) {
        ctx.fillText(watermarkLine1, x, y);
        ctx.fillText(watermarkLine2, x, y + 22);
        ctx.fillText(watermarkLine3, x, y + 42);
      }
    }
    ctx.restore();

  }, [currentPage, zoomLevel, note, user, purchased, purchaseRecord]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md text-white animate-fade-in">
      
      {/* Top Protection Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>NoteX Secure Canvas Protected</span>
          </div>
          <div className="hidden sm:block text-left">
            <h3 className="text-sm font-bold text-white truncate max-w-md">{note.title}</h3>
            <p className="text-xs text-slate-400">
              {purchased ? `Full Document Access (${note.pagesCount} Pages)` : `Preview Mode (${totalPages} Pages)`}
            </p>
          </div>
        </div>

        {/* Zoom & Page Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-slate-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(140, prev + 10))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 hover:bg-slate-700 rounded-lg disabled:opacity-40 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-slate-300">
              Page <strong className="text-white">{currentPage}</strong> / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 hover:bg-slate-700 rounded-lg disabled:opacity-40 text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors border border-slate-700"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Security notice warning */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Anti-Piracy Notice:</strong> This document is protected with your licensed name ({buyerName}) & ID ({purchaseId}). Unauthorized reproduction or screen sharing is traceable. Direct download & print are restricted.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-slate-400 text-[11px]">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>Encrypted Session Token Active</span>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-900/60">
        <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-700 bg-white">
          <canvas ref={canvasRef} className="block select-none" />
        </div>
      </div>

      {/* Bottom status */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Visvesvaraya Technological University • Verified Courseware</span>
        <span>Watermark: {purchaseId}</span>
      </div>

    </div>
  );
};
