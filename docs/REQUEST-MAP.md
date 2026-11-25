# Where each requested tool lives (23 items, no duplicates)

| # | Requested tool | Covered by (catalog id) | Notes |
|---|---|---|---|
| 1 | EXIF & Metadata Scrubber | `metadata-tool` | Images and PDFs. Video needs a locally vendored, licence-checked library; not promised yet. |
| 2 | Client-Side PDF Manipulator | `pdf-toolkit` | Merge, split, rotate, watermark, page numbers. |
| 3 | Zero-Server File Encryptor | `symmetric-encrypt-decrypt` | AES-256-GCM via Web Crypto. ChaCha20 is not in Web Crypto; it needs a vendored library. |
| 4 | Local Steganography Tool | `steganography-tool` | PNG LSB with password protection. |
| 5 | Browser Webhook Receiver | not buildable as described | A browser cannot accept inbound HTTP calls from a payment gateway. Closest local features: `http-message-parser` (paste a captured payload) and `hmac-generator` (verify signatures). |
| 6 | Offline REST / GraphQL Payload Generator | `mock-data-generator` | Same job as item 16. |
| 7 | cURL to Multi-Language Converter | `http-request-builder` | fetch, axios, Python, Go, Rust, PHP. |
| 8 | Local JWT Auditor & Validator | `jwt-tool` | Keys never leave the device. |
| 9 | Browser Forensic Log Analyzer | `log-analyzer` | Streamed in a Web Worker. WASM is optional; speed claims are tested, not assumed. |
| 10 | CIDR Subnet & IP Calculator | `cidr-calculator` (+ `ip-address-analyzer`) | |
| 11 | Regex Backtracking Security Tester | `redos-checker` | |
| 12 | Client-Side Hash Cracker / Matcher | `hash-wordlist-matcher` (new) | Dictionary match against your own wordlist, unsalted hashes only. No brute-force engine. |
| 13 | JSON / Code Converters | `json-to-types` | TypeScript, Go, Python, SQL table. |
| 14 | Code Formatter & Beautifier | `json-formatter`, `xml-formatter`, `sql-formatter`, `html-formatter`, `css-formatter`, `js-formatter` (+ yaml, toml, graphql) | One tool per language; each language has different parsing logic. |
| 15 | Interactive Diff Checker | `diff-viewer` | |
| 16 | Smart Mock Data Generator | `mock-data-generator` | |
| 17 | Client-Side Image Compressor | `image-tool` | Saving depends on the image; no fixed percentage is promised. |
| 18 | SVG Code Optimizer | `svg-optimizer` | |
| 19 | Favicon & PWA Icon Suite | `image-tool` | Icon pack, maskable icon and manifest as a preset. |
| 20 | WCAG Color Contrast Checker | `color-tool` | |
| 21 | PDF Merger & Splitter | `pdf-toolkit` | Same as item 2. |
| 22 | PDF Watermark & Page Numbering | `pdf-toolkit` | Same as item 2. |
| 23 | Markdown to HTML / PDF Converter | `markdown-previewer` | Export HTML and PDF. |
