# SecureKit deployment guide

## 1. Configure and build (once, and after every change)
Edit `site.config.json` (`siteUrl` such as `https://your-domain.com`, or `https://username.github.io/repository` for GitHub Pages without a custom domain; `basePath` is `/` for a domain or `/repository/` for GitHub project pages; `contactEmail`; `owner`). Put your name in LICENSE.txt. Then run `python3 scripts/build_site.py`, `python3 scripts/audit.py` and `node tests/run_tests.js` (Termux: `pkg install python nodejs`).

## 2. Test locally (Android/desktop)
Do not double-click index.html: JSON data loading needs a server. Use VS Code Live Server, or `python3 -m http.server 8000` in the project folder, then open http://localhost:8000/. Check: password tools, breach check (needs internet), QR, hash, Base64, theme button, `/` search, favorites.

## 3. GitHub Pages
1. Create a repository and upload all files (index.html at the repository root).
2. Settings -> Pages -> Deploy from branch -> `main` / root.
3. Your site is at `https://username.github.io/repository/`. All asset paths are relative, so the subfolder works.
4. Custom domain: Settings -> Pages -> Custom domain; add a CNAME record at your DNS provider pointing to `username.github.io`; enable "Enforce HTTPS".

Note: GitHub Pages cannot set custom HTTP headers from the repository, so `_headers` and `vercel.json` are not active there. Cloudflare Pages and Netlify read `_headers`; Vercel reads `vercel.json`. Use one of those if you want the Content-Security-Policy and other headers. The CSP allows only same-origin scripts/styles and the HIBP endpoint (api.pwnedpasswords.com). Strict-Transport-Security should only be kept when your site is HTTPS-only. When you add AdSense you must extend the CSP for Google's ad domains, or ads will be blocked.

## 4. Other static hosts
Cloudflare Pages / Netlify / Vercel / Hugging Face static: upload the folder as-is, no build command, output directory = project root.

## 5. AdSense
1. Publish the site with real content on your own domain, and apply to AdSense. Approval is decided by Google and is not guaranteed.
2. After approval, paste the AdSense script supplied by Google inside `<head>` of each page, and paste each ad unit into the empty `<div class="ad-slot ...">` containers (marked `<!-- GOOGLE ADSENSE CODE GOES HERE AFTER APPROVAL -->`): `ad-top`/`ad-bottom` in index.html and `ad-content` on each tool page.
3. `ads.txt`: create `/ads.txt` yourself using the exact line AdSense shows for your real publisher ID (format: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`). Do not use a made-up ID.
4. Update privacy.html and cookie-policy.html, add any consent mechanism your audience's laws require, and extend the CSP.
5. Keep ads away from Generate/Copy buttons and results; do not ask people to click ads.

## 6. Offline mode and self-test
`sw.js` caches only same-origin static files; it never touches the HIBP request. Change the `CACHE` name in sw.js whenever you edit files. The service worker only runs on HTTPS or localhost. Add `?test=1` to any tool page URL (for example `tools/password-generator.html?test=1`) to run the developer self-test; it uses only fixed public test vectors.

## 7. Not included yet
PNG icons (create 192/512/maskable PNGs from assets/icons/favicon.svg and add them to site.webmanifest). A print-friendly report view.
