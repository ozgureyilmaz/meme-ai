# 🎭 MemeAI

AI-powered meme generator that creates hilarious, viral-worthy memes in seconds. Describe what you want, add captions, and download your meme as PNG.

![Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![AI](https://img.shields.io/badge/fal.ai-FLUX-purple)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/meme-ai.git
cd meme-ai
npm install
```

### 2. Set Up Environment

Create a `.env.local` file in the project root:

```env
FAL_KEY=your_fal_ai_api_key_here
```

> Get your API key at [fal.ai/dashboard](https://fal.ai/dashboard)

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Usage

### Generate a Meme

1. **Type a prompt** in the text area describing the meme you want  
2. **Click "⚡ Generate Meme"** or press **Enter**  
3. Wait a few seconds for the AI to create your image  
4. Your meme appears in the preview area below

### Use Quick Prompts

Click any of the preset chips to instantly fill the prompt:

| Chip | Prompt |
|------|--------|
| 🐱 Monday Cat | `cat on monday morning refusing to work` |
| 💻 3AM Debug | `developer fixing bugs at 3am with red eyes` |
| 🎉 It Works! | `when the code finally works celebration` |
| 📚 Exam Life | `student before exam vs after exam` |
| 🤖 AI Takeover | `AI taking over the world funny` |
| ☕ Coffee Life | `person who had too much coffee vibrating` |

### Add Captions

- **Top caption** — text overlaid at the top of the meme (Impact font, uppercase)
- **Bottom caption** — text overlaid at the bottom of the meme

Captions are optional. Leave them empty to use the image without text.

### Download

Click **"Download PNG"** to save the meme (including captions) to your device.

### Regenerate

Not happy with the result? Click **"Regenerate"** to create a new variation with the same prompt.

---

## 📝 Prompt Tips

**For best results:**

```
✅ "cat refusing to work on Monday morning"
✅ "developer celebrating code compilation"
✅ "student sleeping in lecture hall"
```

**Avoid:**

```
❌ "text that says hello world"     → AI struggles with text rendering
❌ Very long, complex descriptions  → Keep it short and visual
```

**Power keywords** that improve meme quality:

```
"meme style", "internet humor", "funny", "viral"
"bold visual", "high contrast", "clear subject"
```

> These keywords are automatically added to every prompt behind the scenes.

---

## 🏗️ Project Structure

```
meme-ai/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts      ← fal.ai API proxy
│   ├── globals.css           ← Design system & animations
│   ├── layout.tsx            ← Root layout with SEO meta
│   └── page.tsx              ← Main UI (input, preview, download)
├── .env.local                ← API key (not committed)
├── next.config.ts            ← Image domain allowlist
└── package.json
```

---

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org) | React framework with App Router |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS |
| [fal.ai](https://fal.ai) | AI image generation API |
| [FLUX (dev)](https://fal.ai/models/fal-ai/flux/dev) | Image generation model |
| [html2canvas](https://html2canvas.hertzen.com) | Client-side PNG export |

---

## 🌐 Deploy to Vercel

```bash
# Push to GitHub
git init && git add . && git commit -m "init: meme-ai"
git remote add origin https://github.com/your-username/meme-ai.git
git push -u origin main
```

1. Go to [vercel.com](https://vercel.com) → **Import Repository**
2. Add environment variable: `FAL_KEY` = your key
3. Click **Deploy**

---

## 📄 License

MIT
