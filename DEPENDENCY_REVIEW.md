# Dependency review — October 10, 2026

Updated Next.js to 16.4.0, Clerk to 7.9.14, React/React DOM to 19.3.0,
Firebase to 13.0.0, and the Google GenAI SDK to 2.28.0. Updated compatible
minor/patch releases for the remaining packages. Removed unused Express,
body-parser, and the legacy Google generative-ai package.

Node 24 is required because the latest Firebase packages require Node 24.12+.
`.nvmrc` selects Node 24; the verified local version is 24.21.0.

Next.js now uses `src/proxy.ts`, an ESLint CLI script, and a single configuration
file with an explicit project root. Saved-list protection now runs in its server
page, following Clerk's resource-based auth guidance. The original Clerk application and user IDs
are preserved. Gemini manual activities now use the configured generation model
and return the array expected by the client.

Firebase currently pins an old gRPC dependency. A scoped override selects
`@grpc/grpc-js` 1.14.6 for Firestore to remove the reported certificate-validation
advisory. Verify Firebase operations when connecting the live database.

The runtime audit (`npm audit --omit=dev`) reports zero advisories. The full
audit still reports five high-severity entries in the development-only chain:
eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces.
The underlying braces advisory has no patched release at the time of review.
The suggested automatic fix would downgrade Next.js lint tooling; it was not applied.
Recheck this chain when a patched release is available.

ESLint 9 is pinned because Next.js's React, accessibility, and import lint
plugins do not yet declare ESLint 10 compatibility. Other UI-library major
versions were retained where compatible updates suffice and no security
advisory requires a migration.

Live Gemini generation and cross-account Firebase saving require configured
service credentials and user sessions; build and static checks do not verify them.
