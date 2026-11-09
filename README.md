# CINE AI

A zero-cost, browser-based film production workspace. V1 helps you organise a film project; it does not generate AI video by itself.

## V1 features
- Project title and description
- Screenplay upload (TXT / Markdown) and scene breakdown
- Character reference library
- Editable cinematic prompts with copy action
- Local generated-clip library
- Export project data as JSON

## Run locally
Open `index.html` in a modern browser. No build step or package installation is required.

## Publish with GitHub Pages
1. Open the repository **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then Save.
4. Wait for GitHub Pages to publish. The site URL will appear on the Pages settings screen.

## Privacy and storage
V1 stores project data in the browser's local storage. It is not uploaded to a server. Use **Export project** to make a backup. Browser storage is limited; keep reference images and clips small. Clearing browser site data can erase local projects.

## Important: video generation
GitHub Pages hosts the interface; it does not run a video-generation model. A later version can integrate an external video-generation API or a model hosted elsewhere. Free tiers, credits, usage limits, and commercial rights vary by provider. Never put private API keys in frontend JavaScript or a public repository.

## Roadmap
- V1: production workspace (current)
- V2: connect video generation
- V3: voice, dialogue and sound design
- V4: timeline and final movie export
