# SecureKit tool catalog (215 tools)

215 unique tools, all free, no login, all running in the browser. 40 are live; 175 are planned.

## Rules

1. One job, one tool. If an existing tool can do a job, it gets a mode or option, never a second tool.
2. A different input language or file format with genuinely different logic is a different job (for example JSON formatter and XML formatter).
3. Only features that work locally. Nothing needing a platform API, a login, a database or a server.
4. Social media tools work on text, images and links; no posting or analytics.
5. This list is checked by `scripts/build_catalog.py`: unique ids, unique job text, count 215, no absorbed name used as a tool.

## Totals

| Category | Total | Live | Planned |
|---|---|---|---|
| authentication | 19 | 19 | 0 |
| encryption | 20 | 16 | 4 |
| web-security | 25 | 0 | 25 |
| network-security | 20 | 0 | 20 |
| code-analysis | 12 | 0 | 12 |
| data-security | 13 | 0 | 13 |
| api-security | 13 | 0 | 13 |
| forensics | 14 | 1 | 13 |
| developer-utilities | 64 | 4 | 60 |
| social-media | 15 | 0 | 15 |
| **All** | **215** | **40** | **175** |

## Authentication (19)

| # | Tool | What it does | Status |
|---|---|---|---|
| 1 | Password Strength (`password-strength`) | Score a password with entropy, patterns, repeats and common-password checks | live |
| 2 | Password Breach Check (`password-breach-check`) | Check a password against HIBP using a 5-character hash prefix | live |
| 3 | Entropy Calculator (`entropy-calculator`) | Show character-pool and effective entropy in bits | live |
| 4 | Crack Time (`crack-time`) | Estimate online, fast-hash and slow-hash crack times | live |
| 5 | Pattern Detection (`pattern-detection`) | Find sequences, keyboard walks, year suffixes, substitutions | live |
| 6 | Repeat Detection (`repeat-detection`) | Find repeated characters and repeated blocks | live |
| 7 | Common Passwords (`common-passwords`) | Match against a local list of very common passwords | live |
| 8 | Password Generator (`password-generator`) | Generate random passwords with selectable character sets | live |
| 9 | Passphrase Generator (`passphrase-generator`) | Generate multi-word passphrases with entropy breakdown | live |
| 10 | PIN Generator (`pin-generator`) | Generate PINs that avoid repeats and predictable runs | live |
| 11 | TOTP Generator (`totp-generator`) | Generate and verify TOTP and HOTP codes from a base32 secret | live |
| 12 | OTPAuth Uri Builder (`otpauth-uri-builder`) | Build otpauth:// links for authenticator apps, ready for QR | live |
| 13 | Password Policy Checker (`password-policy-checker`) | Test passwords against a custom length and character policy | live |
| 14 | Backup Code Generator (`backup-code-generator`) | Create printable one-time recovery code sets | live |
| 15 | Password Reuse Checker (`password-reuse-checker`) | Compare several passwords locally for reuse and similarity | live |
| 16 | Login Lockout Calculator (`login-lockout-calculator`) | Calculate brute-force exposure for a lockout and rate-limit policy | live |
| 17 | Email Alias Generator (`email-alias-generator`) | Generate plus-address and dot-variant aliases for sign-ups | live |
| 18 | Password CSV Auditor (`password-csv-auditor`) | Audit an exported password CSV for weak, reused and old entries | live |
| 19 | MFA Method Advisor (`mfa-method-advisor`) | Recommend a multi-factor method from a short questionnaire | live |

## Encryption (20)

| # | Tool | What it does | Status |
|---|---|---|---|
| 20 | Hash Generator (`hash-generator`) | Hash text with MD5 and the SHA family | live |
| 21 | HMAC Generator (`hmac-generator`) | Compute and verify HMAC signatures, including webhook signatures | live |
| 22 | Symmetric Encrypt Decrypt (`symmetric-encrypt-decrypt`) | Encrypt and decrypt text or files with AES-256-GCM and a password, fully offline | live |
| 23 | Key Pair Generator (`key-pair-generator`) | Generate RSA, EC, Ed25519 and X25519 key pairs as PEM or JWK | live |
| 24 | RSA OAEP Tool (`rsa-oaep-tool`) | Encrypt and decrypt data with RSA-OAEP keys | live |
| 25 | Digital Signature Tool (`digital-signature-tool`) | Sign and verify data with RSA-PSS, ECDSA or Ed25519 | live |
| 26 | ECDH Key Exchange (`ecdh-key-exchange`) | Derive a shared secret from two EC keys | live |
| 27 | JWK PEM Converter (`jwk-pem-converter`) | Convert keys between JWK and PEM | live |
| 28 | Key Derivation Tool (`key-derivation-tool`) | Derive keys with PBKDF2 or HKDF and time the cost | live |
| 29 | Hash Identifier (`hash-identifier`) | Identify the likely hash type of a string | live |
| 30 | bcrypt Tool (`bcrypt-tool`) | Create and verify bcrypt hashes | planned |
| 31 | Argon2 Tool (`argon2-tool`) | Create and verify Argon2 hashes | planned |
| 32 | CRC Checksum Calculator (`crc-checksum-calculator`) | Compute CRC32, CRC16 and Adler-32 checksums | live |
| 33 | Classical Cipher Tool (`classical-cipher-tool`) | Apply Caesar, ROT13, Vigenere and Atbash ciphers | live |
| 34 | XOR Cipher Tool (`xor-cipher-tool`) | XOR text or bytes with a key and brute-force single-byte keys | live |
| 35 | OpenPGP Tool (`openpgp-tool`) | Generate PGP keys, encrypt, decrypt, sign and verify | planned |
| 36 | SSH Key Fingerprint (`ssh-key-fingerprint`) | Compute SHA-256 and MD5 fingerprints of SSH public keys | live |
| 37 | Merkle Tree Builder (`merkle-tree-builder`) | Build a Merkle tree and root hash from a list | live |
| 38 | Randomness Tester (`randomness-tester`) | Run basic statistical randomness tests on bytes | live |
| 39 | Mnemonic Validator (`mnemonic-validator`) | Validate a BIP-39 phrase checksum locally | planned |

## Web Security (25)

| # | Tool | What it does | Status |
|---|---|---|---|
| 40 | Security Headers Analyzer (`security-headers-analyzer`) | Grade pasted HTTP response headers for security gaps | planned |
| 41 | CSP Analyzer (`csp-analyzer`) | Parse a Content-Security-Policy and flag weaknesses | planned |
| 42 | CSP Builder (`csp-builder`) | Build a Content-Security-Policy from selected sources | planned |
| 43 | Cookie Attribute Analyzer (`cookie-attribute-analyzer`) | Analyze Set-Cookie attributes for Secure, HttpOnly, SameSite | planned |
| 44 | CORS Policy Tester (`cors-policy-tester`) | Simulate a CORS check for an origin, method and headers | planned |
| 45 | Permissions Policy Builder (`permissions-policy-builder`) | Build a Permissions-Policy header | planned |
| 46 | SRI CSP Hash Generator (`sri-csp-hash-generator`) | Create SRI integrity values and CSP script hashes | planned |
| 47 | HTML Sanitizer (`html-sanitizer`) | Sanitize untrusted HTML and preview the result | planned |
| 48 | Output Encoding Tool (`output-encoding-tool`) | Escape strings for HTML, attribute, JS, URL, CSS and SQL contexts | planned |
| 49 | URL Inspector (`url-inspector`) | Break a URL into parts and flag suspicious traits and look-alike domains | planned |
| 50 | Security TXT Generator (`security-txt-generator`) | Generate a security.txt file | planned |
| 51 | X.509 Decoder (`x509-decoder`) | Decode certificates and CSRs and compute pin hashes | planned |
| 52 | TLS Cipher Suite Lookup (`tls-cipher-suite-lookup`) | Look up TLS cipher suites and their strength | planned |
| 53 | CSP Report Parser (`csp-report-parser`) | Parse CSP violation reports into readable rows | planned |
| 54 | HTML Security Linter (`html-security-linter`) | Scan HTML for mixed content, unsafe links, inline handlers, missing SRI | planned |
| 55 | Iframe Sandbox Builder (`iframe-sandbox-builder`) | Build an iframe sandbox attribute with explanations | planned |
| 56 | Web Server Config Generator (`web-server-config-generator`) | Generate nginx, Apache and Netlify config for headers, TLS and redirects | planned |
| 57 | HTTP Message Parser (`http-message-parser`) | Parse raw HTTP requests, responses and captured webhook payloads into tables | planned |
| 58 | Browser Security Checker (`browser-security-checker`) | Test this browser for secure context, WebCrypto, passkeys and permissions | planned |
| 59 | Cache Control Tool (`cache-control-tool`) | Explain and build Cache-Control headers | planned |
| 60 | Web Security Checklist (`web-security-checklist`) | Track a web app security checklist and export progress | planned |
| 61 | STRIDE Threat Modeler (`stride-threat-modeler`) | Build a STRIDE threat model and export it | planned |
| 62 | CVSS Calculator (`cvss-calculator`) | Calculate CVSS v3.1 and v4.0 scores | planned |
| 63 | OWASP Reference (`owasp-reference`) | Search OWASP web, API and LLM risk lists | planned |
| 64 | Same Origin Checker (`same-origin-checker`) | Tell whether two URLs are same-origin or same-site | planned |

## Network Security (20)

| # | Tool | What it does | Status |
|---|---|---|---|
| 65 | IP Address Analyzer (`ip-address-analyzer`) | Parse IPv4 and IPv6, convert bases, classify private and reserved ranges | planned |
| 66 | CIDR Calculator (`cidr-calculator`) | Calculate subnets, masks, ranges and split networks | planned |
| 67 | IP Range To CIDR (`ip-range-to-cidr`) | Convert IP ranges to minimal CIDR lists and back | planned |
| 68 | MAC Address Tool (`mac-address-tool`) | Parse, format and identify MAC addresses | planned |
| 69 | Port Service Reference (`port-service-reference`) | Look up common ports, services and risks | planned |
| 70 | Firewall Rule Generator (`firewall-rule-generator`) | Generate iptables, nftables, ufw and Windows rules | planned |
| 71 | Firewall Rule Explainer (`firewall-rule-explainer`) | Explain firewall rules in plain English | planned |
| 72 | DNS Record Parser (`dns-record-parser`) | Parse zone files and dig output into rows | planned |
| 73 | Email Auth Record Tool (`email-auth-record-tool`) | Parse and build SPF, DKIM and DMARC records | planned |
| 74 | Reverse DNS Name Generator (`reverse-dns-name-generator`) | Create in-addr.arpa and ip6.arpa names from IPs | planned |
| 75 | HAR File Analyzer (`har-file-analyzer`) | Analyze HAR files for secrets, third parties and insecure requests | planned |
| 76 | WireGuard Config Builder (`wireguard-config-builder`) | Generate WireGuard keys and config files | planned |
| 77 | SSH Config Builder (`ssh-config-builder`) | Build an ssh_config file | planned |
| 78 | Packet Header Decoder (`packet-header-decoder`) | Decode IPv4, TCP and UDP header hex | planned |
| 79 | Nmap Command Builder (`nmap-command-builder`) | Build Nmap commands from options with explanations | planned |
| 80 | CIDR Membership Checker (`cidr-membership-checker`) | Match many IPs against a CIDR blocklist | planned |
| 81 | Detection Rule Builder (`detection-rule-builder`) | Build Snort, Suricata and Sigma rule templates | planned |
| 82 | Network Output Parser (`network-output-parser`) | Parse ping, traceroute, netstat and nslookup output | planned |
| 83 | Transfer Time Calculator (`transfer-time-calculator`) | Calculate transfer time from size and bandwidth | planned |
| 84 | WebSocket Tester (`websocket-tester`) | Connect to a WebSocket URL and send test messages from the browser | planned |

## Code Analysis (12)

| # | Tool | What it does | Status |
|---|---|---|---|
| 85 | Regex Tester (`regex-tester`) | Test and replace with regular expressions and explain matches | planned |
| 86 | Redos Checker (`redos-checker`) | Detect regex patterns prone to catastrophic backtracking | planned |
| 87 | Secret Scanner (`secret-scanner`) | Find API keys, tokens and weak values in pasted text and .env files | planned |
| 88 | Insecure Code Pattern Scanner (`insecure-code-pattern-scanner`) | Flag dangerous patterns in JS, Python, PHP and SQL snippets | planned |
| 89 | Manifest Risk Scanner (`manifest-risk-scanner`) | Check package manifests for unpinned versions and risky scripts | planned |
| 90 | License Detector (`license-detector`) | Identify open-source licenses from text | planned |
| 91 | SBOM Generator (`sbom-generator`) | Create a CycloneDX SBOM from a dependency list | planned |
| 92 | Code Metrics (`code-metrics`) | Count lines and estimate complexity | planned |
| 93 | IaC Security Linter (`iac-security-linter`) | Lint Dockerfile, Kubernetes, GitHub Actions and Terraform security | planned |
| 94 | Shell Command Explainer (`shell-command-explainer`) | Explain a shell command and flag dangerous flags | planned |
| 95 | Typosquat Package Checker (`typosquat-package-checker`) | Compare package names with popular names for look-alikes | planned |
| 96 | Commit Message Linter (`commit-message-linter`) | Check commit messages against Conventional Commits | planned |

## Data Security (13)

| # | Tool | What it does | Status |
|---|---|---|---|
| 97 | PII Redactor (`pii-redactor`) | Detect and mask personal data in text and JSON | planned |
| 98 | Shamir Secret Sharing (`shamir-secret-sharing`) | Split and recombine a secret into shares | planned |
| 99 | Data Classifier (`data-classifier`) | Suggest sensitivity labels for field names and samples | planned |
| 100 | CSV Anonymizer (`csv-anonymizer`) | Mask, hash or generalize CSV columns | planned |
| 101 | K Anonymity Checker (`k-anonymity-checker`) | Compute k-anonymity for chosen CSV columns | planned |
| 102 | Mock Data Generator (`mock-data-generator`) | Generate mock JSON, REST and GraphQL payloads and fake records from a custom schema | planned |
| 103 | Identifier Validator (`identifier-validator`) | Validate card, IBAN, ISBN and VIN check digits | planned |
| 104 | Retention Schedule Builder (`retention-schedule-builder`) | Build a data retention schedule table | planned |
| 105 | Data Inventory Builder (`data-inventory-builder`) | Build a data inventory and processing map | planned |
| 106 | Text Watermarker (`text-watermarker`) | Embed and read invisible zero-width text watermarks | planned |
| 107 | Differential Privacy Calculator (`differential-privacy-calculator`) | Calculate Laplace noise for a chosen epsilon | planned |
| 108 | URL Tracking Cleaner (`url-tracking-cleaner`) | Strip tracking parameters from links | planned |
| 109 | Risk Register Builder (`risk-register-builder`) | Build a risk register with a likelihood-impact matrix | planned |

## Api Security (13)

| # | Tool | What it does | Status |
|---|---|---|---|
| 110 | JWT Tool (`jwt-tool`) | Decode, verify, sign and audit JWTs locally; secret keys never leave the device | planned |
| 111 | OAuth Request Builder (`oauth-request-builder`) | Build OAuth and OIDC authorization requests with PKCE | planned |
| 112 | Openapi Security Analyzer (`openapi-security-analyzer`) | Review an OpenAPI file for security gaps | planned |
| 113 | HTTP Request Builder (`http-request-builder`) | Build requests and convert curl to fetch, axios, Python, Go, Rust and PHP | planned |
| 114 | JSON Schema Validator (`json-schema-validator`) | Validate JSON against a JSON Schema | planned |
| 115 | Rate Limit Calculator (`rate-limit-calculator`) | Plan token-bucket and leaky-bucket limits | planned |
| 116 | GraphQL Query Analyzer (`graphql-query-analyzer`) | Measure GraphQL depth and complexity and flag risks | planned |
| 117 | SAML Assertion Decoder (`saml-assertion-decoder`) | Decode SAML requests and responses | planned |
| 118 | HTTP Status Reference (`http-status-reference`) | Look up HTTP status codes | planned |
| 119 | Auth Header Builder (`auth-header-builder`) | Build and decode Basic and Bearer authorization headers | planned |
| 120 | AWS SigV4 Signer (`aws-sigv4-signer`) | Sign requests with AWS Signature V4 locally | planned |
| 121 | Problem Details Builder (`problem-details-builder`) | Build RFC 9457 problem-details responses | planned |
| 122 | Binary Serialization Decoder (`binary-serialization-decoder`) | Decode raw Protobuf, MessagePack and CBOR | planned |

## Forensics (14)

| # | Tool | What it does | Status |
|---|---|---|---|
| 123 | File Signature Identifier (`file-signature-identifier`) | Identify file types from magic bytes | planned |
| 124 | Hex Viewer Strings (`hex-viewer-strings`) | View a hex dump and extract strings from a file | planned |
| 125 | Metadata Tool (`metadata-tool`) | View and remove metadata (GPS, camera, dates) from images and PDFs | planned |
| 126 | Timestamp Converter (`timestamp-converter`) | Convert Unix, Windows FILETIME and WebKit timestamps | planned |
| 127 | Log Analyzer (`log-analyzer`) | Stream, filter and summarize large nginx, Apache and auth logs and flag anomalies | planned |
| 128 | Email Header Analyzer (`email-header-analyzer`) | Trace routes and SPF, DKIM and DMARC results in headers | planned |
| 129 | YARA Lite Matcher (`yara-lite-matcher`) | Test YARA-style string rules on text and files | planned |
| 130 | Hash Wordlist Matcher (`hash-wordlist-matcher`) | Match unsalted hashes against your own wordlist to audit weak passwords and solve CTF tasks | live |
| 131 | IOC Extractor (`ioc-extractor`) | Extract IPs, domains, URLs and hashes from text | planned |
| 132 | Security Report Builder (`security-report-builder`) | Build incident and vulnerability reports | planned |
| 133 | Steganography Tool (`steganography-tool`) | Hide and reveal password-protected text inside PNG images | planned |
| 134 | PDF Risk Inspector (`pdf-risk-inspector`) | Scan a PDF for scripts and embedded files | planned |
| 135 | Archive Inspector (`archive-inspector`) | List archive contents and flag zip-bomb traits | planned |
| 136 | QR Decoder (`qr-decoder`) | Decode QR images and flag risky payloads | planned |

## Developer Utilities (64)

| # | Tool | What it does | Status |
|---|---|---|---|
| 137 | UUID Generator (`uuid-generator`) | Generate UUID v4 values in bulk | live |
| 138 | Random String (`random-string`) | Generate random strings and tokens | live |
| 139 | Base64 (`base64`) | Encode and decode Base64 with Unicode | live |
| 140 | QR Generator (`qr-generator`) | Generate QR codes for text, URLs, Wi-Fi, email and phone | live |
| 141 | JSON Formatter (`json-formatter`) | Format, minify, sort and validate JSON | planned |
| 142 | XML Formatter (`xml-formatter`) | Format and validate XML | planned |
| 143 | YAML Formatter (`yaml-formatter`) | Format and validate YAML | planned |
| 144 | TOML Formatter (`toml-formatter`) | Format and validate TOML | planned |
| 145 | SQL Formatter (`sql-formatter`) | Format SQL | planned |
| 146 | HTML Formatter (`html-formatter`) | Format and minify HTML | planned |
| 147 | CSS Formatter (`css-formatter`) | Format and minify CSS | planned |
| 148 | JS Formatter (`js-formatter`) | Format and minify JavaScript | planned |
| 149 | GraphQL Formatter (`graphql-formatter`) | Format GraphQL | planned |
| 150 | Data Format Converter (`data-format-converter`) | Convert between JSON, YAML, TOML, XML and CSV | planned |
| 151 | CSV Spreadsheet Viewer (`csv-spreadsheet-viewer`) | View, sort, filter and export CSV and XLSX | planned |
| 152 | Query Tester (`query-tester`) | Run JSONPath, XPath and CSS selectors on pasted data | planned |
| 153 | Diff Viewer (`diff-viewer`) | Compare two texts or JSON files side by side | planned |
| 154 | Markdown Previewer (`markdown-previewer`) | Preview Markdown live and export HTML or PDF | planned |
| 155 | HTML Markdown Converter (`html-markdown-converter`) | Convert HTML to Markdown and back | planned |
| 156 | Markdown Table Generator (`markdown-table-generator`) | Edit tables visually and export Markdown or HTML | planned |
| 157 | HTML Table Extractor (`html-table-extractor`) | Extract tables from pasted HTML into CSV | planned |
| 158 | JSON To Types (`json-to-types`) | Generate TypeScript, Go, Python types and SQL tables from JSON | planned |
| 159 | JSON Schema Generator (`json-schema-generator`) | Infer a JSON Schema from sample JSON | planned |
| 160 | Text Case Converter (`text-case-converter`) | Convert case styles and make URL slugs | planned |
| 161 | Lorem Ipsum Generator (`lorem-ipsum-generator`) | Generate placeholder text | planned |
| 162 | Line Processor (`line-processor`) | Sort, dedupe, reverse, trim and number lines | planned |
| 163 | URL Encoder Query Builder (`url-encoder-query-builder`) | Percent-encode text and parse or build query strings | planned |
| 164 | Unicode Inspector (`unicode-inspector`) | Inspect code points and normalization, find or strip invisible characters | planned |
| 165 | Text Encoding Converter (`text-encoding-converter`) | Convert text to binary, hex, octal, Morse and NATO | planned |
| 166 | Base N Encoder (`base-n-encoder`) | Encode and decode Base32, Base58, Base85 and Hex | planned |
| 167 | Number Format Converter (`number-format-converter`) | Convert Roman numerals, number words and Bengali digits | planned |
| 168 | Number Base Converter (`number-base-converter`) | Convert and compute across binary, octal, decimal and hex | planned |
| 169 | Bijoy Unicode Converter (`bijoy-unicode-converter`) | Convert Bijoy legacy Bangla text to Unicode and back | planned |
| 170 | Unit Converter (`unit-converter`) | Convert length, mass, temperature, data size and CSS units | planned |
| 171 | Date Time Calculator (`date-time-calculator`) | Add, subtract and convert dates and time zones | planned |
| 172 | Cron Expression Tool (`cron-expression-tool`) | Explain, build and preview cron schedules | planned |
| 173 | BigInt Calculator (`bigint-calculator`) | Calculate with arbitrarily large integers | planned |
| 174 | IEEE 754 Inspector (`ieee754-inspector`) | Show float and double bit layouts | planned |
| 175 | chmod Calculator (`chmod-calculator`) | Convert permissions between numeric and symbolic with umask | planned |
| 176 | Color Tool (`color-tool`) | Convert colors, check WCAG contrast and build palettes | planned |
| 177 | CSS Visual Generator (`css-visual-generator`) | Generate gradients, shadows, radius and flexbox or grid CSS | planned |
| 178 | MIME Type Reference (`mime-type-reference`) | Look up MIME types by extension | planned |
| 179 | HTTP Header Reference (`http-header-reference`) | Look up HTTP headers and their meaning | planned |
| 180 | Linux Command Reference (`linux-command-reference`) | Search common Linux commands with examples | planned |
| 181 | User Agent Parser (`user-agent-parser`) | Parse user-agent strings | planned |
| 182 | Semver Calculator (`semver-calculator`) | Compare versions and test semver ranges | planned |
| 183 | Glob Pattern Tester (`glob-pattern-tester`) | Test glob patterns against paths | planned |
| 184 | .gitignore Generator (`gitignore-generator`) | Generate .gitignore files from templates | planned |
| 185 | Git Command Builder (`git-command-builder`) | Build Git commands from a guided form | planned |
| 186 | Dockerfile Generator (`dockerfile-generator`) | Generate Dockerfiles from options | planned |
| 187 | Systemd Unit Generator (`systemd-unit-generator`) | Generate systemd unit files | planned |
| 188 | Kubernetes Manifest Generator (`kubernetes-manifest-generator`) | Generate Kubernetes manifests | planned |
| 189 | CI Pipeline Generator (`ci-pipeline-generator`) | Generate GitHub Actions and GitLab CI pipelines | planned |
| 190 | License Generator (`license-generator`) | Generate a license file with your name and year | planned |
| 191 | Readme Generator (`readme-generator`) | Generate a README from a template | planned |
| 192 | Robots Sitemap Generator (`robots-sitemap-generator`) | Generate robots.txt and sitemap.xml | planned |
| 193 | .env File Tool (`env-file-tool`) | Parse, convert and compare .env files | planned |
| 194 | Bookmarklet Generator (`bookmarklet-generator`) | Turn JavaScript into a bookmarklet | planned |
| 195 | SVG Optimizer (`svg-optimizer`) | Clean and minify SVG | planned |
| 196 | Image Tool (`image-tool`) | Resize, crop, compress, convert, watermark and build favicon and PWA icon packs with manifest | planned |
| 197 | PDF Toolkit (`pdf-toolkit`) | Merge, split, reorder, rotate, watermark and number PDF pages | planned |
| 198 | Diagram Editor (`diagram-editor`) | Render Mermaid diagrams to SVG and PNG | planned |
| 199 | SQLite Viewer (`sqlite-viewer`) | Open and query a SQLite file locally | planned |
| 200 | Random Picker (`random-picker`) | Pick random numbers, dice, coin flips and list items | planned |

## Social Media (15)

| # | Tool | What it does | Status |
|---|---|---|---|
| 201 | Post Counter Preview (`post-counter-preview`) | Count characters and words against platform limits with a preview | planned |
| 202 | Hashtag Formatter (`hashtag-formatter`) | Turn phrases into clean hashtags and dedupe them | planned |
| 203 | Post Text Formatter (`post-text-formatter`) | Style text with Unicode fonts and keep line breaks | planned |
| 204 | Emoji Search (`emoji-search`) | Search and copy emoji by name | planned |
| 205 | Thread Splitter (`thread-splitter`) | Split long text into numbered posts under a limit | planned |
| 206 | UTM Link Builder (`utm-link-builder`) | Build links with UTM parameters | planned |
| 207 | Social Card Preview (`social-card-preview`) | Build and preview Open Graph and Twitter card tags | planned |
| 208 | Content Calendar Planner (`content-calendar-planner`) | Plan posts and export CSV or ICS | planned |
| 209 | Engagement Rate Calculator (`engagement-rate-calculator`) | Calculate engagement rate from counts | planned |
| 210 | Ad Cost Calculator (`ad-cost-calculator`) | Calculate CPM, CPC, CTR and ROAS | planned |
| 211 | Link In Bio Generator (`link-in-bio-generator`) | Generate a static link-in-bio page | planned |
| 212 | Social Privacy Checklist (`social-privacy-checklist`) | Walk through platform privacy settings and export progress | planned |
| 213 | Quote Card Maker (`quote-card-maker`) | Create quote images on canvas | planned |
| 214 | Profile Audit Scorecard (`profile-audit-scorecard`) | Score a profile against a checklist | planned |
| 215 | Palette Extractor (`palette-extractor`) | Extract dominant colors from an image | planned |

## Merged into modes (never built as separate tools)

| Not a tool | Lives inside |
|---|---|
| api-key-generator | random-string |
| base64-file-encoder | base64 |
| character-counter | post-counter-preview |
| cidr-subnet-calculator | cidr-calculator |
| cidr-subnet-splitter | cidr-calculator |
| code-converters | json-to-types |
| color-converter | color-tool |
| contrast-checker | color-tool |
| cors-config-generator | web-server-config-generator |
| csp-hash-generator | sri-csp-hash-generator |
| curl-converter | http-request-builder |
| diceware-generator | passphrase-generator |
| diff-checker | diff-viewer |
| dockerfile-linter | iac-security-linter |
| env-auditor | secret-scanner |
| epoch-converter | timestamp-converter |
| exif-metadata-scrubber | metadata-tool |
| exif-remover | metadata-tool |
| exif-viewer | metadata-tool |
| fake-data-generator | mock-data-generator |
| favicon-pwa-icon-suite | image-tool |
| file-encryptor | symmetric-encrypt-decrypt |
| file-hash-calculator | hash-generator |
| forensic-log-analyzer | log-analyzer |
| github-actions-generator | ci-pipeline-generator |
| gitlab-ci-generator | ci-pipeline-generator |
| graphql-payload-generator | mock-data-generator |
| hash-verifier | hash-generator |
| headers-config-generator | web-server-config-generator |
| hex-dump | hex-viewer-strings |
| homograph-detector | url-inspector |
| hotp-generator | totp-generator |
| htaccess-generator | web-server-config-generator |
| html-entity-encoder | output-encoding-tool |
| image-compressor | image-tool |
| incident-report-builder | security-report-builder |
| invisible-character-detector | unicode-inspector |
| ipv6-compressor | ip-address-analyzer |
| json-schema-sample-generator | mock-data-generator |
| json-validator | json-formatter |
| jwt-auditor | jwt-tool |
| jwt-decoder | jwt-tool |
| jwt-signer | jwt-tool |
| k8s-linter | iac-security-linter |
| local-steganography | steganography-tool |
| markdown-to-html-converter | markdown-previewer |
| markdown-to-pdf-converter | markdown-previewer |
| md5-generator | hash-generator |
| metadata-scrubber | metadata-tool |
| mixed-content-checker | html-security-linter |
| nanoid-generator | uuid-generator |
| nginx-config-generator | web-server-config-generator |
| palette-generator | color-tool |
| passkey-checker | browser-security-checker |
| password-checker | password-strength |
| password-leak-check | password-breach-check |
| password-score | password-strength |
| pdf-merger-splitter | pdf-toolkit |
| pdf-page-numbering | pdf-toolkit |
| pdf-watermark | pdf-toolkit |
| pkce-generator | oauth-request-builder |
| px-to-rem | unit-converter |
| qr-url-generator | qr-generator |
| qr-vcard-generator | qr-generator |
| qr-wifi-generator | qr-generator |
| random-bytes-generator | random-string |
| random-password | password-generator |
| regex-replacer | regex-tester |
| regex-security-tester | redos-checker |
| rest-payload-generator | mock-data-generator |
| sha256-generator | hash-generator |
| sigma-rule-builder | detection-rule-builder |
| slug-generator | text-case-converter |
| smart-mock-data-generator | mock-data-generator |
| snort-rule-builder | detection-rule-builder |
| sri-generator | sri-csp-hash-generator |
| ssh-key-generator | key-pair-generator |
| string-escaper | output-encoding-tool |
| svg-code-optimizer | svg-optimizer |
| text-statistics | post-counter-preview |
| tls-config-generator | web-server-config-generator |
| token-generator | random-string |
| ulid-generator | uuid-generator |
| unix-timestamp | timestamp-converter |
| uuid-v7-generator | uuid-generator |
| vlsm-calculator | cidr-calculator |
| vulnerability-report-builder | security-report-builder |
| wcag-contrast-checker | color-tool |
| webhook-payload-inspector | http-message-parser |
| webhook-signature-verifier | hmac-generator |
| word-counter | post-counter-preview |
| xss-encoder | output-encoding-tool |
| yaml-validator | yaml-formatter |
