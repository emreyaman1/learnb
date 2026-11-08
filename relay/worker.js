// Learnb aracı sunucusu – Cloudflare Worker
// İstemciden gelen Gemini API isteklerini Google'a iletir, anahtarı gizli tutar.

const GOOGLE = "https://generativelanguage.googleapis.com";

// İzinli kaynak kontrolü
function originAllowed(origin) {
  if (!origin) return false;
  if (origin === "https://emreyaman1.github.io") return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

// İzinli model kontrolü
const MODEL_RE = /^gemini-[0-9][\w.-]*flash[\w.-]*$/;
const MODEL_DENY = /image|tts|live|audio|embed|vision|robotic|computer|native/i;
function modelAllowed(name) {
  return MODEL_RE.test(name) && !MODEL_DENY.test(name);
}

// JSON hata yanıtı
function jsonError(code, message, corsOrigin) {
  const headers = { "Content-Type": "application/json" };
  if (corsOrigin) {
    headers["Access-Control-Allow-Origin"] = corsOrigin;
    headers["Vary"] = "Origin";
  }
  return new Response(JSON.stringify({ error: { code, message } }), { status: code, headers });
}

// CORS başlıklarını yanıta ekle
function addCors(headers, origin) {
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Vary", "Origin");
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");
    const allowed = originAllowed(origin);

    // CORS ön isteği
    if (request.method === "OPTIONS") {
      if (!allowed) return jsonError(403, "origin_not_allowed", null);
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin",
        },
      });
    }

    // Kaynak kontrolü
    if (!allowed) return jsonError(403, "origin_not_allowed", null);

    // Anahtar kontrolü
    if (!env.GEMINI_KEY) return jsonError(500, "relay_not_configured", origin);

    // Hız sınırı
    if (env.LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "yok";
      const { success } = await env.LIMITER.limit({ key: ip });
      if (!success) return jsonError(429, "relay_rate_limited", origin);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // ── GET /v1beta/models ──
    if (request.method === "GET" && path === "/v1beta/models") {
      const gUrl = `${GOOGLE}/v1beta/models?pageSize=200`;
      let res;
      try {
        res = await fetch(gUrl, {
          headers: { "x-goog-api-key": env.GEMINI_KEY },
          signal: request.signal,
        });
      } catch { return jsonError(502, "upstream_unreachable", origin); }

      if (!res.ok) {
        const h = new Headers({ "Content-Type": res.headers.get("Content-Type") || "application/json" });
        addCors(h, origin);
        return new Response(res.body, { status: res.status, headers: h });
      }

      const data = await res.json();
      if (data.models) data.models = data.models.filter(m => modelAllowed((m.name || "").replace("models/", "")));
      const h = new Headers({ "Content-Type": "application/json" });
      addCors(h, origin);
      return new Response(JSON.stringify(data), { status: 200, headers: h });
    }

    // ── POST /v1beta/models/{model}:generateContent|streamGenerateContent ──
    const postMatch = path.match(/^\/v1beta\/models\/([\w.-]+):(generateContent|streamGenerateContent)$/);
    if (request.method === "POST" && postMatch) {
      const model = postMatch[1];
      if (!modelAllowed(model)) return jsonError(400, "model_not_allowed", origin);

      // Boyut sınırı
      const cl = parseInt(request.headers.get("Content-Length") || "0", 10);
      if (cl > 120000) return jsonError(413, "too_large", origin);

      let raw;
      try { raw = await request.text(); } catch { return jsonError(400, "bad_json", origin); }
      if (raw.length > 120000) return jsonError(413, "too_large", origin);

      let body;
      try { body = JSON.parse(raw); } catch { return jsonError(400, "bad_json", origin); }

      // Yalnızca izinli alanları bırak
      const clean = {};
      for (const k of ["contents", "generationConfig", "systemInstruction", "safetySettings"]) {
        if (body[k] !== undefined) clean[k] = body[k];
      }

      // maxOutputTokens sınırı
      if (!clean.generationConfig) clean.generationConfig = {};
      if (!clean.generationConfig.maxOutputTokens || clean.generationConfig.maxOutputTokens > 16000) {
        clean.generationConfig.maxOutputTokens = 16000;
      }

      // Google'a iletilecek URL (sorgu dizesinden key parametresini çıkar)
      const gParams = new URLSearchParams(url.search);
      gParams.delete("key");
      const qs = gParams.toString();
      const gUrl = `${GOOGLE}${path}${qs ? "?" + qs : ""}`;

      let res;
      try {
        res = await fetch(gUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_KEY,
          },
          body: JSON.stringify(clean),
          signal: request.signal,
        });
      } catch { return jsonError(502, "upstream_unreachable", origin); }

      // Yanıtı akıtarak döndür
      const h = new Headers();
      const ct = res.headers.get("Content-Type");
      if (ct) h.set("Content-Type", ct);
      addCors(h, origin);
      return new Response(res.body, { status: res.status, headers: h });
    }

    // Tanınmayan yol
    return jsonError(404, "not_found", allowed ? origin : null);
  },
};
