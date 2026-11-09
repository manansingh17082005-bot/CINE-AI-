# CINE AI

**One prompt → a complete animated-movie storyboard.**

CINE AI V1 is a GitHub Pages-ready prompt-to-storyboard studio. It accepts one movie idea, selected animation style, duration (1–3 minutes), aspect ratio and dialogue language. It produces a scene-by-scene plan with visual prompts, camera guidance, audio notes and transitions.

## V1 features
- One-prompt movie planning
- Multiple visual styles: 3D, 2D, anime, realistic, stop motion and storybook
- 1–3 minute short-film plans
- Optional local AI expansion through Ollama (default model: llama3.2)
- Built-in fallback storyboard planner if Ollama is unavailable
- Editable scene prompts, copy actions and JSON export
- Browser-local save

## Run / publish
No build tools or package installation are required.
- Local: open `index.html` in a modern browser.
- GitHub Pages: Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.

## Optional local AI with Ollama
1. Install and start Ollama on your computer.
2. Download a model, for example: `ollama pull llama3.2`.
3. Keep the Ollama server running.
4. Open CINE AI and use **Test local AI connection**.
5. If the browser blocks the connection, configure Ollama's allowed origins to include your exact GitHub Pages origin, then restart Ollama. Do not expose the Ollama port publicly.

The browser talks to Ollama at `http://localhost:11434`. This is optional; the built-in planner works without it.

## Important: what V1 does and does not do
V1 generates the **storyboard and video-generation prompts**, not rendered animated MP4 files. Actual video synthesis requires a video model. GitHub Pages is static hosting and cannot run a large video model or securely hold a private API key.

## Next development milestone: render actual video
The next milestone is a local generation bridge that connects the storyboard to a ComfyUI workflow / compatible local video model, then returns generated clips for assembly. Online providers can be added through a server-side proxy; never put secret API keys in public frontend code. Free model availability, VRAM requirements, queue limits and usage rights vary.

## Privacy
The storyboard save uses this browser's local storage. Export JSON for backup. Do not enter confidential material into a public or shared computer.
