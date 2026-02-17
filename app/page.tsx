"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { fal } from "@fal-ai/client";
import html2canvas from "html2canvas";

/* ───── Quick Prompt Templates ───── */
const QUICK_PROMPTS = [
  { emoji: "🐱", label: "Monday Cat", prompt: "cat on monday morning refusing to work" },
  { emoji: "💻", label: "3AM Debug", prompt: "developer fixing bugs at 3am with red eyes" },
  { emoji: "🎉", label: "It Works!", prompt: "when the code finally works celebration" },
  { emoji: "📚", label: "Exam Life", prompt: "student before exam vs after exam" },
  { emoji: "🤖", label: "AI Takeover", prompt: "AI taking over the world funny" },
  { emoji: "☕", label: "Coffee Life", prompt: "person who had too much coffee vibrating" },
];

/* ───── Main Component ───── */
export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generationCount, setGenerationCount] = useState(0);

  /* ── API Key State ── */
  const [apiKey, setApiKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState("");

  const memeRef = useRef<HTMLDivElement>(null);

  /* ── Load API key from localStorage ── */
  useEffect(() => {
    const stored = localStorage.getItem("fal_api_key");
    if (stored) {
      setApiKey(stored);
      fal.config({ credentials: stored });
    }
  }, []);

  /* ── Save API key ── */
  const saveApiKey = () => {
    const key = keyInput.trim();
    if (!key) return;
    localStorage.setItem("fal_api_key", key);
    setApiKey(key);
    fal.config({ credentials: key });
    setShowKeyModal(false);
    setError("");
  };

  /* ── Generate meme from fal.ai (client-side) ── */
  const generate = useCallback(async () => {
    if (!prompt.trim()) return;

    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }

    setLoading(true);
    setError("");
    setImageUrl("");

    const memePrompt = `meme style, internet humor, funny, viral reddit meme, ${prompt}, white space for caption text at top and bottom, high contrast, bold visual`;

    try {
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: memePrompt,
          image_size: "square_hd",
          num_inference_steps: 28,
          guidance_scale: 3.5,
          num_images: 1,
          enable_safety_checker: true,
        },
      });

      const data = result.data as { images: { url: string }[] };
      setImageUrl(data.images[0].url);
      setGenerationCount((c) => c + 1);
    } catch {
      setError("Generation failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }, [prompt, apiKey]);

  /* ── Download meme as PNG ── */
  const download = useCallback(async () => {
    const el = memeRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#000",
    });
    const link = document.createElement("a");
    link.download = `meme-ai-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  /* ── Handle Enter key ── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  };

  return (
    <>
      {/* ── Background Ambient Blobs ── */}
      <div className="bg-blob" style={{ width: 600, height: 600, top: "-10%", left: "-10%", background: "rgba(168, 85, 247, 0.06)", animation: "blob-move 20s ease-in-out infinite" }} />
      <div className="bg-blob" style={{ width: 500, height: 500, bottom: "-5%", right: "-10%", background: "rgba(236, 72, 153, 0.05)", animation: "blob-move 25s ease-in-out infinite reverse" }} />
      <div className="bg-blob" style={{ width: 400, height: 400, top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(139, 92, 246, 0.04)", animation: "blob-move 30s ease-in-out infinite" }} />

      {/* ── API Key Modal ── */}
      {showKeyModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setShowKeyModal(false)}
        >
          <div
            className="glass animate-scale-in"
            style={{
              width: "100%",
              maxWidth: 440,
              borderRadius: "var(--radius-xl)",
              padding: "2rem",
              margin: "1rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "0.5rem" }}>
              🔑 Enter fal.ai API Key
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem", marginBottom: "1rem", lineHeight: 1.5 }}>
              Get your free API key at{" "}
              <a
                href="https://fal.ai/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-accent-purple)", textDecoration: "underline" }}
              >
                fal.ai/dashboard
              </a>
              . Your key is stored locally in your browser only.
            </p>
            <input
              type="password"
              placeholder="Paste your API key here..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveApiKey(); }}
              className="focus-ring"
              style={{
                width: "100%",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "0.75rem 1rem",
                fontSize: "0.8125rem",
                color: "var(--color-text-primary)",
                outline: "none",
                fontFamily: "inherit",
                marginBottom: "0.75rem",
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setShowKeyModal(false)}
                style={{
                  flex: 1,
                  padding: "0.625rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  color: "var(--color-text-secondary)",
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveApiKey}
                style={{
                  flex: 1,
                  padding: "0.625rem",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "3rem 1rem 2rem" }}>

        {/* ━━━━━━━━━━ HEADER ━━━━━━━━━━ */}
        <header className="animate-fade-in-up" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "2.5rem" }}>🎭</span>
            <h1
              className="gradient-text"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                fontFamily: "'Space Grotesk', sans-serif",
                lineHeight: 1,
              }}
            >
              MemeAI
            </h1>
          </div>

          {/* API Key indicator */}
          <div style={{ marginTop: "0.5rem" }}>
            <button
              onClick={() => setShowKeyModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                background: apiKey ? "rgba(34, 197, 94, 0.08)" : "rgba(239, 68, 68, 0.08)",
                border: `1px solid ${apiKey ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                fontSize: "0.7rem",
                color: apiKey ? "#4ade80" : "#f87171",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: apiKey ? "#4ade80" : "#f87171" }} />
              {apiKey ? "API Key Set" : "Set API Key"}
            </button>
          </div>

          {generationCount > 0 && (
            <div
              className="animate-scale-in"
              style={{
                display: "inline-block",
                marginTop: "0.5rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                background: "rgba(168, 85, 247, 0.1)",
                border: "1px solid rgba(168, 85, 247, 0.2)",
                fontSize: "0.7rem",
                color: "var(--color-accent-purple)",
              }}
            >
              {generationCount} meme{generationCount !== 1 ? "s" : ""} generated ✨
            </div>
          )}
        </header>

        {/* ━━━━━━━━━━ INPUT SECTION ━━━━━━━━━━ */}
        <section
          className="glass animate-fade-in-up"
          style={{
            width: "100%",
            maxWidth: 580,
            borderRadius: "var(--radius-xl)",
            padding: "1.5rem",
            animationDelay: "0.1s",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Prompt Textarea */}
          <div style={{ position: "relative" }}>
            <textarea
              id="prompt-input"
              className="focus-ring"
              rows={3}
              placeholder="Describe your meme... e.g. 'cat refusing to work on Monday'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "0.875rem 1rem",
                fontSize: "0.875rem",
                color: "var(--color-text-primary)",
                resize: "none",
                transition: "var(--transition-normal)",
                outline: "none",
                fontFamily: "inherit",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-border-focus)"; e.currentTarget.style.boxShadow = "var(--shadow-glow-sm)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <span style={{ position: "absolute", bottom: 8, right: 12, fontSize: "0.65rem", color: "var(--color-text-muted)" }}>
              ⏎ Enter to generate
            </span>
          </div>

          {/* Quick Prompts */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.875rem" }}>
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.prompt}
                id={`quick-prompt-${p.label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setPrompt(p.prompt)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  background: prompt === p.prompt ? "rgba(168, 85, 247, 0.15)" : "var(--color-bg-primary)",
                  border: `1px solid ${prompt === p.prompt ? "rgba(168, 85, 247, 0.4)" : "var(--color-border)"}`,
                  borderRadius: "999px",
                  padding: "0.375rem 0.75rem",
                  fontSize: "0.75rem",
                  color: prompt === p.prompt ? "var(--color-accent-purple)" : "var(--color-text-secondary)",
                  cursor: "pointer",
                  transition: "var(--transition-fast)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { if (prompt !== p.prompt) { e.currentTarget.style.background = "var(--color-bg-elevated)"; e.currentTarget.style.color = "var(--color-text-primary)"; } }}
                onMouseLeave={(e) => { if (prompt !== p.prompt) { e.currentTarget.style.background = "var(--color-bg-primary)"; e.currentTarget.style.color = "var(--color-text-secondary)"; } }}
              >
                <span>{p.emoji}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Caption Inputs */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.875rem" }}>
            <input
              id="top-text-input"
              type="text"
              placeholder="Top caption"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="focus-ring"
              style={{
                flex: 1,
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "0.625rem 0.875rem",
                fontSize: "0.8125rem",
                color: "var(--color-text-primary)",
                outline: "none",
                transition: "var(--transition-normal)",
                fontFamily: "inherit",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-border-focus)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
            />
            <input
              id="bottom-text-input"
              type="text"
              placeholder="Bottom caption"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="focus-ring"
              style={{
                flex: 1,
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "0.625rem 0.875rem",
                fontSize: "0.8125rem",
                color: "var(--color-text-primary)",
                outline: "none",
                transition: "var(--transition-normal)",
                fontFamily: "inherit",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-border-focus)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
            />
          </div>

          {/* Generate Button */}
          <button
            id="generate-button"
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="animate-gradient"
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: "0.875rem",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: loading || !prompt.trim()
                ? "var(--color-bg-elevated)"
                : "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #d946ef 100%)",
              backgroundSize: loading || !prompt.trim() ? "auto" : "200% 200%",
              color: loading || !prompt.trim() ? "var(--color-text-muted)" : "white",
              fontSize: "0.875rem",
              fontWeight: 700,
              cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
              transition: "var(--transition-normal)",
              position: "relative",
              overflow: "hidden",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              if (!loading && prompt.trim()) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "var(--shadow-glow-md)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {loading ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin-slow 1s linear infinite" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
                </svg>
                Generating...
              </span>
            ) : (
              "⚡ Generate Meme"
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div
              className="animate-scale-in"
              style={{
                marginTop: "0.75rem",
                padding: "0.625rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#f87171",
                fontSize: "0.8125rem",
                textAlign: "center",
              }}
            >
              ⚠️ {error}
            </div>
          )}
        </section>

        {/* ━━━━━━━━━━ PREVIEW SECTION ━━━━━━━━━━ */}
        {(imageUrl || loading) && (
          <section
            className="animate-fade-in-up"
            style={{
              width: "100%",
              maxWidth: 580,
              marginTop: "2rem",
              animationDelay: "0.2s",
            }}
          >
            {/* Canvas */}
            <div
              ref={memeRef}
              id="meme-preview"
              style={{
                position: "relative",
                background: "#000",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                minHeight: loading ? 400 : "auto",
                boxShadow: imageUrl ? "var(--shadow-glow-lg)" : "var(--shadow-card)",
                transition: "var(--transition-slow)",
              }}
            >
              {/* Loading spinner */}
              {loading && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  background: "rgba(9, 9, 11, 0.9)",
                  zIndex: 10,
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "3px solid var(--color-bg-elevated)",
                    borderTopColor: "var(--color-accent-purple)",
                    animation: "spin-slow 0.8s linear infinite",
                  }} />
                  <span style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem" }}>
                    AI is creating your meme...
                  </span>
                  <div className="animate-shimmer" style={{ width: "60%", height: 4, borderRadius: 2, background: "rgba(168, 85, 247, 0.1)" }} />
                </div>
              )}

              {/* Generated Image */}
              {imageUrl && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Generated meme"
                    style={{ width: "100%", display: "block" }}
                    crossOrigin="anonymous"
                  />

                  {/* Top Text */}
                  {topText && (
                    <div
                      className="meme-text"
                      style={{
                        position: "absolute",
                        top: 16,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        padding: "0 16px",
                        color: "white",
                        fontSize: "clamp(1.25rem, 4vw, 2rem)",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        lineHeight: 1.2,
                        wordBreak: "break-word",
                      }}
                    >
                      {topText}
                    </div>
                  )}

                  {/* Bottom Text */}
                  {bottomText && (
                    <div
                      className="meme-text"
                      style={{
                        position: "absolute",
                        bottom: 16,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        padding: "0 16px",
                        color: "white",
                        fontSize: "clamp(1.25rem, 4vw, 2rem)",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        lineHeight: 1.2,
                        wordBreak: "break-word",
                      }}
                    >
                      {bottomText}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action Buttons */}
            {imageUrl && (
              <div
                className="animate-scale-in"
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  id="download-button"
                  onClick={download}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text-primary)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "var(--transition-fast)",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-elevated)"; e.currentTarget.style.borderColor = "var(--color-accent-purple)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary)"; e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download PNG
                </button>
                <button
                  id="regenerate-button"
                  onClick={generate}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text-primary)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "var(--transition-fast)",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-elevated)"; e.currentTarget.style.borderColor = "var(--color-accent-pink)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary)"; e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Regenerate
                </button>
              </div>
            )}
          </section>
        )}

      </main>
    </>
  );
}
