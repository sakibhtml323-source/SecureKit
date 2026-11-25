# SecureKit platform architecture (215 tools, browser-only, SaaS-ready)

## Scope
200 security and developer tools plus 15 social media tools = 215. All free, no login, no backend, no tracking.

## Single source of truth: `data/`
- `categories.json`: category id, name, icon, order, `plannedCount` (planning only; public counts are always computed from live tools).
- `tools.json`: one entry per tool, validated by `data/tools.schema.json` and `scripts/validate_registry.py`.
- Everything else (pages, sitemap, search index, menus, related links, JSON-LD, CSP host list, privacy page table) is generated from these two files. Never hand-edit a generated page.

## Tool entry contract
- `id`: stable kebab-case, never reused (URLs, favorites and a future API depend on it).
- `status`: planned, beta, live, deprecated. Only `live` tools appear in menus and sitemap.
- `runtime`: `type` is always `client`; `network` lists every external host the tool may call (empty for most). The CSP `connect-src` is built from the union of these lists.
- `privacy`: declares local processing, no stored user data, `sensitiveInput`, `analytics: false`. The privacy page table is generated from this.
- `access`: `tier: free`, `auth: none` today. These fields exist so entitlements or accounts could be added later without reshaping the data.
- `contract`: each tool's logic lives in a pure module `run(input, options) -> result` with no DOM access. The UI wraps it. A future API or worker can call the same function.
- `version`: semver; bump on behaviour change. `i18n.defaultLocale` prepares for Bengali and other languages.

## Folder plan for scale
`tools/<id>.html` (generated), `assets/js/core/` (shared helpers), `assets/js/tools/<module>.js` (one module per tool, loaded only on its page), `assets/vendor/` (vendored libraries with licence files), `data/`, `scripts/`, `tests/`.

## Quality gates (run before every release)
1. `python3 scripts/validate_registry.py` passes.
2. Every live tool has a self-test vector, a FAQ, a privacy declaration and 3 to 5 related tools.
3. Link, path, JSON and syntax audit; no `Math.random`, `eval`, `innerHTML`, `console.*`, inline scripts or styles.
4. Mobile layout check at 360 px and 1280 px, keyboard and screen-reader pass.
5. Per-page budget: no tool page loads another tool's code.

## Constraints to respect
- Social media tools must work on text, images and links locally. Anything needing a platform API (posting, profile lookup, analytics) cannot run without a backend and is out of scope.
- Libraries for heavy tools (PDF, images, compression) must be vendored locally with licences, no CDN.
- "Industry level" is a standard we test against with the gates above; it is not something the files can claim about themselves.

## Implemented in this phase
- `templates/` + `content/` + `data/` are the sources; `scripts/build_site.py` generates all pages, sitemap, robots, search index, service worker (content-hash cache name) and CSP headers (`_headers`, `vercel.json`) from the declared network hosts.
- `scripts/audit.py` is the release gate; `tests/coverage.json` maps every live tool to named tests (self-test vectors or UI simulations in `tests/run_tests.js`). A tool without coverage fails the audit.
- Tool logic still lives in `assets/js/app.js` and `qr.js` as one `T.<module>` per tool; splitting into `assets/js/tools/<id>.js` loaded per page is the next refactor once the tool count grows.
