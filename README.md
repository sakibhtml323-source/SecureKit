# SecureKit v40.0.0

Privacy-first password and security toolkit. The deployed site is plain static files (no backend, no database, no server code).

## Develop (Python 3 and Node 18+ needed only on your machine, not on the host)
1. Edit `site.config.json`: `siteUrl`, `basePath`, `contactEmail`, `owner`.
2. `python3 scripts/build_site.py`  regenerates every page, sitemap, robots, search index, service worker, CSP headers.
3. `python3 scripts/audit.py`  release audit (registry, links, SEO, CSP-safety, forbidden APIs, test coverage).
4. `node tests/run_tests.js`  logic and UI-simulation tests.
5. `python3 scripts/package.py`  zip the project.
6. Preview with `python3 -m http.server 8081` and open http://localhost:8081/ (not file://).

## Add a tool
Add an entry to `data/tools.json` (see `data/tools.schema.json`), implement `T.<module>` in `assets/js/` (one module per tool), add test names to `tests/coverage.json`, then run build, audit and tests. Never edit generated pages by hand.

See `DEPLOY.md` for hosting and AdSense, `docs/ARCHITECTURE.md` for the design.
