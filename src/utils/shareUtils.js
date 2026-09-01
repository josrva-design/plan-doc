import LZString from 'lz-string';

const pruneEmpty = (obj) => {
  if (obj === null || obj === undefined) return undefined;
  if (Array.isArray(obj)) {
    const pruned = obj.map(pruneEmpty).filter(v => v !== undefined && v !== '');
    return pruned.length ? pruned : undefined;
  }
  if (typeof obj === 'object') {
    const result = {};
    let hasKeys = false;
    for (const [k, v] of Object.entries(obj)) {
      const pruned = pruneEmpty(v);
      if (pruned !== undefined && pruned !== '') {
        result[k] = pruned;
        hasKeys = true;
      }
    }
    return hasKeys ? result : undefined;
  }
  if (obj === '' || obj === '—') return undefined;
  return obj;
};

const safeStringify = (data) => {
  const pruned = pruneEmpty(data);
  let json;
  try {
    json = JSON.stringify(pruned);
  } catch (e) {
    // Fallback: try structured clone-friendly serialization
    const seen = new WeakSet();
    json = JSON.stringify(pruned, (_key, val) => {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    });
  }
  return json;
};

const buildMetaTags = () => `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="theme-color" content="#0D2640" />
    <meta name="apple:mobile-web-app-capable" content="yes" />
    <meta name="apple:mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple:mobile-web-app-title" content="DocFitness" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DocFitness" />
    <meta property="og:title" content="Tu plan DocFitness" />
    <meta property="og:description" content="Plan nutricional y de entrenamiento personalizado" />
    <meta property="og:image" content="/doc-logo-brand.svg" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta property="og:image:alt" content="DocFitness Logo" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Tu plan DocFitness" />
    <meta name="twitter:description" content="Plan nutricional y de entrenamiento personalizado" />
    <meta name="twitter:image" content="/doc-logo-brand.svg" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/doc-logo-brand.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700;800&display=swap" rel="stylesheet">`;

const getPatientScriptSrc = () => {
  if (typeof window === 'undefined') return '/assets/patient.js';

  // Try to find the script src from the current page's loaded scripts
  const scripts = document.querySelectorAll('script[src]');
  for (const script of scripts) {
    const src = script.src || script.getAttribute('src') || '';
    if (src.includes('patient-') && src.includes('/assets/')) {
      return src;
    }
  }

  // Fallback: determine based on environment
  const origin = window.location.origin;
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

  if (isLocalhost) {
    // In dev mode, Vite serves the source file
    return `${origin}/src/patient.jsx`;
  }

  // In production, Vite outputs a hashed file. Try common patterns.
  return `${origin}/assets/patient.js`;
};

const generateMinimalHTML = (data, name, scriptSrc) => {
  const json = safeStringify(data);
  const safeName = (name || 'Plan').replace(/[^a-zA-Z0-9 _-]/g, '').substring(0, 40) || 'Plan';

  return `<!DOCTYPE html>
<html lang="es">
  <head>${buildMetaTags()}
    <title>${safeName} - Plan DocFitness</title>
    <script>window.__PLAN_DATA__ = ${json};</script>
    <script type="module" src="${scriptSrc}"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
};

export const generateStandaloneHTML = async (data, name = 'Plan') => {
  try {
    const baseUrl = window.location.origin;
    const safeName = name.replace(/[^a-zA-Z0-9 _-]/g, '').substring(0, 40) || 'Plan';

    // Try fetching the server-rendered patient.html (for correct asset paths in production)
    let html = '';
    try {
      const response = await fetch('/patient.html', { cache: 'no-store' });
      if (response.ok) {
        html = await response.text();
      }
    } catch (fetchErr) {
      console.warn('[download-html] fetch failed, using template:', fetchErr.message);
    }

    // If fetch failed or HTML is malformed, use template-based approach
    if (!html || !html.includes('<body>')) {
      console.log('[download-html] using inline template');
      const scriptSrc = getPatientScriptSrc();
      const templateHtml = generateMinimalHTML(data, safeName, scriptSrc);
      return {
        html: templateHtml,
        fileName: safeName.replace(/\s+/g, '-'),
      };
    }

    // We have valid patient.html — enhance it with our data
    const json = safeStringify(data);
    const dataScript = `<\/script>`; // Close any existing inline scripts before body end

    // Replace title
    html = html.replace(
      /<title[^>]*>.*?<\/title>/is,
      `<title>${safeName} - Plan DocFitness</title>`
    );

    // Add base tag if not present
    if (!html.includes('<base ')) {
      html = html.replace(
        /<head>/i,
        `<head><base href="${baseUrl}">`
      );
    }

    // Inject data before </body>
    const injectScript = `<script>window.__PLAN_DATA__=${json}<\/script>`;
    html = html.replace(
      /<\/body>/i,
      injectScript + '</body>'
    );

    return {
      html,
      fileName: safeName.replace(/\s+/g, '-'),
    };
  } catch (e) {
    console.error('[download-html] FATAL ERROR:', e);
    // Last resort: try to generate minimal HTML without any data
    try {
      const scriptSrc = getPatientScriptSrc();
      const safeName = (name || 'Plan').replace(/[^a-zA-Z0-9 _-]/g, '').substring(0, 40) || 'Plan';
      const fallbackHtml = generateMinimalHTML(data, safeName, scriptSrc);
      return {
        html: fallbackHtml,
        fileName: safeName.replace(/\s+/g, '-'),
      };
    } catch (fallbackErr) {
      console.error('[download-html] Fallback also failed:', fallbackErr);
      return null;
    }
  }
};

export const downloadHTML = (html, fileName) => {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const encodePlanToHash = (data) => {
  try {
    const json = safeStringify(data);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return compressed;
  } catch (e) {
    console.error('Error encoding plan:', e);
    return null;
  }
};

export const decodePlanFromHash = (hashStr) => {
  try {
    const json = LZString.decompressFromEncodedURIComponent(hashStr);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Error decoding plan:', e);
    return null;
  }
};

export const generateShareUrl = (data, options = {}) => {
  const baseUrl = options.baseUrl || window.location.origin;
  const name = options.name || '';
  const hash = encodePlanToHash(data);
  if (!hash) {
    console.error('[share] Failed to encode hash');
    return null;
  }

  if (name) {
    const safeName = name.replace(/[^a-zA-Z0-9-]/g, '').substring(0, 30) || 'plan';
    return `${baseUrl}/patient.html#n=${encodeURIComponent(safeName)}&d=${hash}`;
  }
  return `${baseUrl}/patient.html#d=${hash}`;
};

export const parseShareUrl = () => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash || !hash.startsWith('#')) return null;

  const params = new URLSearchParams(hash.substring(1));
  const encoded = params.get('d');
  const name = params.get('n') || '';

  if (!encoded) return null;
  const data = decodePlanFromHash(encoded);
  return data ? { data, name } : null;
};

export const generateShortShareUrl = async (data, options = {}) => {
  const fullUrl = generateShareUrl(data, options);
  if (!fullUrl) return null;

  try {
    const response = await fetch('https://is.gd/create.php?format=simple&url=' + encodeURIComponent(fullUrl));
    if (response.ok) {
      const short = await response.text();
      if (short.startsWith('http')) return short;
    }
  } catch (e) {
    // fall through to return full URL
  }
  return fullUrl;
};

