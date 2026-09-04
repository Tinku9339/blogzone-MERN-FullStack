
import { useMemo, useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
  Type,
  Clock,
  FileText,
} from "lucide-react";

// Quill instance for custom format registrations
const Quill = ReactQuill.Quill;

export const FONT_FAMILIES = [
  { id: "inter", label: "Inter (Modern Sans)" },
  { id: "fraunces", label: "Fraunces (Editorial Serif)" },
  { id: "playfair", label: "Playfair Display (Elegant)" },
  { id: "lora", label: "Lora (Literary)" },
  { id: "merriweather", label: "Merriweather (Newsprint)" },
  { id: "jetbrains", label: "JetBrains Mono (Code)" },
  { id: "caveat", label: "Caveat (Handwritten)" },
  { id: "serif", label: "Georgia (Classic Serif)" },
  { id: "monospace", label: "System Monospace" },
];

const FONT_WHITELIST = FONT_FAMILIES.map((f) => f.id);
const SIZE_WHITELIST = ["small", false, "large", "huge"];

const COLOR_PALETTE = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#d1d5db",
  "#ffffff",
  "#C99A4A", // Brass Gold
  "#D05A3F", // Rust
  "#6F9E76", // Sage Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Rose Pink
  "#EAB308", // Amber
  "#14B8A6", // Teal
  "#F97316", // Vibrant Orange
  "#10B981", // Emerald
];

if (Quill) {
  const Font = Quill.import("formats/font");
  Font.whitelist = FONT_WHITELIST;
  Quill.register(Font, true);

  const Size = Quill.import("formats/size");
  Size.whitelist = SIZE_WHITELIST;
  Quill.register(Size, true);
}

const RichTextEditor = ({ value, onChange, placeholder = "Write your blog content with rich formatting, custom fonts, quotes, code, and images..." }) => {
  const quillRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close Zen Fullscreen with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const handleUndo = () => {
    const editor = quillRef.current?.getEditor();
    if (editor?.history) {
      editor.history.undo();
    }
  };

  const handleRedo = () => {
    const editor = quillRef.current?.getEditor();
    if (editor?.history) {
      editor.history.redo();
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ font: FONT_WHITELIST }],
        [{ size: SIZE_WHITELIST }],
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: COLOR_PALETTE }, { background: COLOR_PALETTE }],
        [{ script: "sub" }, { script: "super" }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    }),
    []
  );

  const formats = [
    "font",
    "size",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "align",
    "list",
    "bullet",
    "check",
    "indent",
    "blockquote",
    "code-block",
    "link",
    "image",
    "clean",
  ];

  // Dynamic statistics
  const stats = useMemo(() => {
    const text = (value || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const characters = text.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, characters, readingTime };
  }, [value]);

  return (
    <div
      className={`blogzone-editor-container flex flex-col transition-all duration-200 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-canvas p-4 sm:p-8 overflow-hidden"
          : "relative rounded-sm border border-paper-line/25 bg-canvas-panel"
      }`}
    >
      {/* Top Utility Bar */}
      <div className="flex items-center justify-between border-b border-paper-line/15 bg-canvas-raised px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-brass" />
          <span className="eyebrow text-[10px] text-paper m-0">Editorial Writing Studio</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndo}
            title="Undo (Ctrl+Z)"
            className="flex h-7 w-7 items-center justify-center rounded-sm text-muted hover:text-paper hover:bg-canvas-panel transition-colors"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            title="Redo (Ctrl+Y)"
            className="flex h-7 w-7 items-center justify-center rounded-sm text-muted hover:text-paper hover:bg-canvas-panel transition-colors"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
          <div className="h-3.5 w-px bg-paper-line/20 mx-1" />
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Zen Fullscreen (Esc)" : "Zen Fullscreen Mode"}
            className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-mono transition-colors ${
              isFullscreen
                ? "bg-brass text-canvas font-semibold shadow-sm"
                : "border border-paper-line/30 text-muted hover:border-brass hover:text-brass"
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-wider">Exit Zen</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-wider">Zen Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quill Component */}
      <div className={`blogzone-quill-wrapper flex-1 overflow-y-auto ${isFullscreen ? "min-h-0" : ""}`}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className={isFullscreen ? "fullscreen-quill" : "inline-quill"}
        />
      </div>

      {/* Live Metrics Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper-line/15 px-4 py-2.5 bg-canvas-raised/50 text-xs text-muted font-mono">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-brass" />
            <strong className="text-paper">{stats.words}</strong> words
          </span>
          <span className="text-paper-line/30">·</span>
          <span>
            <strong className="text-paper">{stats.characters}</strong> characters
          </span>
          <span className="text-paper-line/30">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-sage" />
            ~<strong className="text-paper">{stats.readingTime}</strong> min read
          </span>
        </div>
        <span className="hidden md:inline text-[11px] text-muted/70">
          Tip: Highlight text to select custom typography &amp; styles
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;