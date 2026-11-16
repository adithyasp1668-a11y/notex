import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { validatePdfMagicBytes, MAX_PDF_SIZE_BYTES } from '../../services/storageService';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  selectedFile?: File | null;
  maxSizeBytes?: number;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  maxSizeBytes = MAX_PDF_SIZE_BYTES,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setValidationError(null);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setValidationError('Only PDF files (.pdf) are accepted.');
      return;
    }

    if (file.size > maxSizeBytes) {
      setValidationError(`File size exceeds ${Math.round(maxSizeBytes / (1024 * 1024))}MB limit.`);
      return;
    }

    setIsValidating(true);
    try {
      const isValid = await validatePdfMagicBytes(file);
      if (!isValid) {
        setValidationError('Invalid PDF file format. Header must contain %PDF- signature.');
        return;
      }
      onFileSelect(file);
    } catch {
      setValidationError('Failed to read and validate the PDF file.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleInputChange}
      />

      {selectedFile ? (
        <div className="flex items-center justify-between p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900 truncate max-w-xs">{selectedFile.name}</p>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Validated PDF</p>
            </div>
          </div>
          {onFileRemove && (
            <button
              type="button"
              onClick={() => {
                onFileRemove();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-400'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-600 mb-3">
            <UploadCloud className="w-6 h-6 text-slate-700" />
          </div>
          <p className="text-sm font-bold text-slate-900 mb-1">
            {isValidating ? 'Validating binary magic header...' : 'Click or drag PDF here to upload'}
          </p>
          <p className="text-xs text-slate-500">
            PDF files only (binary verified `%PDF-`), up to {Math.round(maxSizeBytes / (1024 * 1024))}MB
          </p>
        </div>
      )}

      {validationError && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
