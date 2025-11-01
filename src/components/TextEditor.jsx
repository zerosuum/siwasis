"use client";

import React, { useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Image as ImageIcon, 
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const Toolbar = ({ editor, onFotoClick }) => {
  if (!editor) return null;
  const btn = (active) =>
    `p-2 rounded-md ${
      active
        ? "bg-wasis-pr60 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-white rounded-t-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btn(editor.isActive("underline"))}
      >
        <UnderlineIcon size={18} />
      </button>

      <button onClick={onFotoClick} className={btn(false)}>
        <ImageIcon size={18} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-2" />

      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={btn(editor.isActive({ textAlign: "left" }))}
      >
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={btn(editor.isActive({ textAlign: "center" }))}
      >
        <AlignCenter size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={btn(editor.isActive({ textAlign: "right" }))}
      >
        <AlignRight size={18} />
      </button>
    </div>
  );
};

export default function TextEditor({ value = "", onChange, onOpenFotoModal }) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({ strike: false }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    []
  );

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: { attributes: { class: "prosemirror-editor" } },
    immediatelyRender: false,
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Toolbar editor={editor} onFotoClick={onOpenFotoModal} />
      {editor && <EditorContent editor={editor} />}
    </div>
  );
}
