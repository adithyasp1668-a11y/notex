import React from 'react';

export const NoteCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-[16/10] bg-slate-200" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-4/5" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-200" />
            <div className="h-3 bg-slate-200 rounded w-16" />
          </div>
          <div className="h-5 bg-slate-200 rounded w-10" />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-8 bg-slate-200 rounded-xl" />
          <div className="h-8 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="animate-pulse">
      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-3/4" /></td>
      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-1/2" /></td>
      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-12" /></td>
      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
      <td className="p-4"><div className="h-5 bg-slate-200 rounded-full w-20" /></td>
      <td className="p-4 text-right"><div className="h-7 bg-slate-200 rounded-lg w-16 ml-auto" /></td>
    </tr>
  );
};
