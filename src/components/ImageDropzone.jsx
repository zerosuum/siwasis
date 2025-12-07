"use client";

import { useRef, useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";

export default function ImageDropzone({
  initialUrl,
  onChange,
  onError,
  accept = "image/*",
  labelIdle = "Klik atau drag file ke sini",
  className = "",
  aspect = "16/9",
  maxSize,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(initialUrl || null);
  const [drag, setDrag] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!preview && initialUrl) {
      setPreview(initialUrl);
    }
  }, [initialUrl]);

  const handlePick = (file) => {
    if (!file) return;

    if (maxSize && file.size > maxSize) {
      const mb = maxSize / (1024 * 1024);
      const msg = `Ukuran file terlalu besar. Maksimal ${mb}MB.`;

      setErrorMsg(msg);
      if (typeof onError === "function") {
        onError(msg, file);
      }
      return;
    }

    setErrorMsg(null);

    const url = URL.createObjectURL(file);
    setPreview(url);

    if (typeof onChange === "function") {
      onChange(file, url);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handlePick(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handlePick(file);
  };

  return (
    <div
      className={`
        relative w-full overflow-hidden cursor-pointer
        border-2 border-dashed rounded-xl
        ${
          drag
            ? "border-wasis-pr60 bg-wasis-pr00/60"
            : "border-gray-300 bg-gray-50"
        }
        flex items-center justify-center
        ${className}
      `}
      style={{ aspectRatio: aspect }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
    >
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 p-4 text-gray-500 text-sm">
          <UploadCloud className="w-8 h-8 text-gray-400" />
          <span>{labelIdle}</span>
          {maxSize && (
            <span className="text-xs text-gray-400">
              Maksimal {(maxSize / (1024 * 1024)).toFixed(1)}MB
            </span>
          )}
          {errorMsg && (
            <span className="mt-1 text-xs text-red-500 text-center">
              {errorMsg}
            </span>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
