"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Sparkles, Check, Image as ImageIcon, Loader2 } from "lucide-react";
import { CURATED_MEDIA_ASSETS, type CuratedAsset } from "@/lib/club-presets";
import { cn } from "@/lib/utils";

interface MediaDropzonePickerProps {
  value: string;
  onChange: (url: string) => void;
  defaultFilter?: "all" | "player" | "match" | "crest" | "kit";
  label?: string;
  allowCutoutToggle?: boolean;
}

export function MediaDropzonePicker({
  value,
  onChange,
  defaultFilter = "all",
  label = "Media / Photo",
  allowCutoutToggle = false,
}: MediaDropzonePickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [removeBg, setRemoveBg] = useState(allowCutoutToggle);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [filter, setFilter] = useState<"all" | "player" | "match" | "crest" | "kit" | "uploaded">(
    defaultFilter
  );
  const [uploadedAssets, setUploadedAssets] = useState<
    { url: string; label: string; category: "uploaded" }[]
  >([]);

  useEffect(() => {
    if (!showLibrary) return;
    let active = true;
    fetch("/api/upload")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json?.uploaded) {
          setUploadedAssets(json.uploaded);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [showLibrary]);

  async function uploadFile(file: File) {
    setUploadError(null);
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("removeBg", String(removeBg));
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setUploadError(json.error || "Upload failed");
        return;
      }
      onChange(json.url);
      setUploadedAssets((prev) => [
        { url: json.url, label: file.name, category: "uploaded" },
        ...prev,
      ]);
    } catch {
      setUploadError("Network error while uploading image.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) {
      void uploadFile(file);
    }
  }

  const allLibrary: Array<CuratedAsset | { url: string; label: string; category: "uploaded" }> = [
    ...uploadedAssets,
    ...CURATED_MEDIA_ASSETS,
  ];
  const visibleAssets = allLibrary.filter((item) => filter === "all" || item.category === filter);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/75">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setShowLibrary((prev) => !prev)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#66A3FF] hover:text-white cursor-pointer"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span>{showLibrary ? "Hide Library" : "Browse Club Library"}</span>
        </button>
      </div>

      {/* Dropzone + Current Preview */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex items-center gap-3 rounded-xl border border-dashed p-3 transition-colors",
          isDragging
            ? "border-[#D5A84B] bg-[#D5A84B]/10"
            : "border-white/20 bg-[#071426]/80 hover:border-[#2678FF]/60"
        )}
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-[#0A2240]">
          {value ? (
            <Image
              src={value}
              alt="Selected media"
              fill
              unoptimized={value.startsWith("/uploads/") || value.startsWith("http")}
              className="object-contain p-1"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/30">
              <ImageIcon className="h-6 w-6" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2678FF] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1d63db] disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              <span>{isUploading ? "Uploading..." : "Drop or Upload Image"}</span>
            </button>

            {allowCutoutToggle && (
              <label className="inline-flex items-center gap-1.5 text-[11px] text-white/75 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeBg}
                  onChange={(e) => setRemoveBg(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-white/20"
                />
                <Sparkles className="h-3 w-3 text-[#D5A84B]" />
                <span>Auto Cutout</span>
              </label>
            )}
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/assets/... or /uploads/..."
            className="w-full rounded border border-white/10 bg-[#050D1A] px-2 py-1 text-[11px] text-white/80 font-mono"
          />
          {uploadError && <p className="text-[11px] text-red-400">{uploadError}</p>}
        </div>
      </div>

      {/* Asset Picker Drawer */}
      {showLibrary && (
        <div className="rounded-xl border border-white/15 bg-[#050D1A] p-3 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {(["all", "uploaded", "player", "match", "crest", "kit"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-bold capitalize cursor-pointer",
                  filter === tab
                    ? "bg-[#D5A84B] text-[#071426]"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-5">
            {visibleAssets.map((asset) => {
              const selected = value === asset.url;
              return (
                <button
                  key={`${asset.category}-${asset.url}`}
                  type="button"
                  onClick={() => {
                    onChange(asset.url);
                    setShowLibrary(false);
                  }}
                  title={asset.label}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-lg border bg-[#0A2240] p-1 transition-all cursor-pointer",
                    selected
                      ? "border-[#D5A84B] ring-2 ring-[#D5A84B]/50"
                      : "border-white/10 hover:border-[#2678FF]"
                  )}
                >
                  <Image
                    src={asset.url}
                    alt={asset.label}
                    fill
                    unoptimized={asset.url.startsWith("/uploads/") || asset.url.startsWith("http")}
                    className="object-contain p-1"
                  />
                  {selected && (
                    <span className="absolute end-1 top-1 rounded-full bg-[#D5A84B] p-0.5 text-[#071426]">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
