"use client";

import { useState, useRef } from "react";
import { GripVertical, X } from "lucide-react";

interface DragDropListProps {
  items: { id: number; label: string; sublabel?: string }[];
  onReorder: (newOrder: number[]) => void;
  onRemove?: (id: number) => void;
}

export default function DragDropList({
  items,
  onReorder,
  onRemove,
}: DragDropListProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setOverIdx(idx);
  };

  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }

    const newItems = [...items];
    const [moved] = newItems.splice(dragIdx, 1);
    newItems.splice(idx, 0, moved);
    onReorder(newItems.map((item) => item.id));
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {items.map((item, idx) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={() => handleDrop(idx)}
          onDragEnd={() => {
            setDragIdx(null);
            setOverIdx(null);
          }}
          className={`flex items-center gap-3 bg-bolt-surface border rounded-xl px-4 py-3 transition-all cursor-grab active:cursor-grabbing ${
            overIdx === idx && dragIdx !== null && dragIdx !== idx
              ? "border-bolt-accent bg-bolt-accent/5"
              : "border-bolt-border"
          } ${dragIdx === idx ? "opacity-50 scale-95" : ""}`}
        >
          <GripVertical className="w-4 h-4 text-bolt-muted flex-shrink-0" />
          <span className="text-xs font-body text-bolt-accent bg-bolt-accent/10 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
            {idx + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-sans font-medium truncate">
              {item.label}
            </p>
            {item.sublabel && (
              <p className="text-xs font-body text-bolt-muted">
                {item.sublabel}
              </p>
            )}
          </div>
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              className="p-1 text-bolt-muted hover:text-bolt-danger transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
