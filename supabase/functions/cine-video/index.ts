// CINE AI V3 secure video proxy.
// Deploy with: supabase functions deploy cine-video --no-verify-jwt
// Store MAGIC_HOUR_API_KEY and CINE_ACCESS_TOKEN as Supabase Function secrets.
const allowedOrigin = "https://manansingh17082005-bot.github.io";
const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cine-access-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const origin = req.headers.get("origin") || "";
  if (origin !== allowedOrigin) return json({ error: "Origin not allowed" }, 403);

  const expected = Deno.env.get("CINE_ACCESS_TOKEN") || "";
  const supplied = req.headers.get("x-cine-access-token") || "";
  if (!expected || !safeEqual(expected, supplied)) return json({ error: "Access denied. Check your private CINE access token." }, 401);

  const apiKey = Deno.env.get("MAGIC_HOUR_API_KEY") || "";
  if (!apiKey) return json({ error: "Server setup incomplete: MAGIC_HOUR_API_KEY secret is missing." }, 503);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON request." }, 400); }
  const action = body.action;

  if (action === "test") return json({ ok: true, provider: "Magic Hour", mode: "free-tier-only", model: "ltx-2.5" });

  if (action === "create") {
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (prompt.length < 8 || prompt.length > 3500) return json({ error: "Prompt must be between 8 and 3500 characters." }, 400);
    // Hard-coded free-tier model and low-cost settings. No client can override model or resolution.
    const aspect = ["16:9", "9:16", "1:1"].includes(String(body.aspectRatio)) ? String(body.aspectRatio) : "16:9";
    const name = typeof body.name === "string" ? body.name.slice(0, 100) : "CINE AI clip";
    const response = await fetch("https://api.magichour.ai/v1/text-to-video", {
      method: "POST",
      headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        end_seconds: 5,
        aspect_ratio: aspect,
        model: "ltx-2.5",
        resolution: "480p",
        audio: false,
        name,
        style: { prompt },
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.message || data?.error?.message || "Video provider rejected the request.";
      return json({ error: response.status === 402 ? "No available free credits. CINE AI stopped without switching to a paid model. " + message : message, provider_status: response.status }, response.status === 402 ? 402 : 502);
    }
    return json({ id: data.id, credits_charged: data.credits_charged, status: "queued" });
  }

  if (action === "status") {
    const id = typeof body.id === "string" ? body.id : "";
    if (!/^[a-zA-Z0-9_-]{5,100}$/.test(id)) return json({ error: "Invalid video job ID." }, 400);
    const response = await fetch("https://api.magichour.ai/v1/video-projects/" + encodeURIComponent(id), {
      headers: { "Authorization": "Bearer " + apiKey, "Accept": "application/json" },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return json({ error: data?.message || "Could not check video status.", provider_status: response.status }, 502);
    return json({ id: data.id, status: data.status, error: data.error, downloads: data.downloads || [], credits_charged: data.credits_charged });
  }

  return json({ error: "Unknown action." }, 400);
});
