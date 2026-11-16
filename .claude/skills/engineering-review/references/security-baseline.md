# Security baseline

Non-negotiable defaults for any product with users, data, or payments. Apply
them while building, not only in review. A violation is at least a High finding.

The core rule: **the browser is public.** Anything sent to it (JavaScript,
API responses, cookies, local storage, source maps, network traffic) can be
read and changed by anyone with DevTools. Security lives on the server.

## Secrets

- No secret keys in frontend code or public environment variables
  (`NEXT_PUBLIC_*`, `VITE_*`, `REACT_APP_*`, `EXPO_PUBLIC_*`, and similar).
  Only publishable keys designed for browsers may go there.
- Secrets live in the hosting provider's secret settings or a secret manager,
  never in the repository, chat, screenshots, tickets, or logs. `.env` files
  stay git-ignored; commit only `.env.example` with placeholder values.
- Never use a privileged/admin key (for example a Supabase `service_role` key
  or Firebase admin credentials) in the client.
- Separate keys for test and production. If a secret is ever exposed, the
  owner rotates it immediately; deleting the commit is not enough.

## Passwords and sign-in

- Use a proven authentication provider or framework library; never invent
  password storage, sessions, or tokens.
- Passwords are only ever stored as slow salted hashes (bcrypt, scrypt, or
  Argon2), never plain, encrypted, or reversible, and never logged or returned
  by any API.
- Sessions use `HttpOnly`, `Secure`, `SameSite` cookies; do not keep long-lived
  tokens in `localStorage`.
- Rate-limit sign-in, sign-up, password reset, and verification codes. Reset
  links are single-use and expire. Errors do not reveal whether an account
  exists. Offer or require MFA for admin and owner accounts.

## Authorization and data access

- Every request is checked on the server: who is asking, and may they act on
  this specific record? Hiding a button is not a permission.
- Multi-tenant products scope every query by tenant (and by team, workspace,
  or location where relevant) on the server. Test that one customer cannot read or change
  another's data by changing an ID in the URL or request.
- With client-accessible databases (Supabase, Firebase), row-level security or
  security rules are enabled and tested for every table/collection, deny by
  default.
- APIs return only the fields the screen needs: never password hashes, internal
  notes, other users' personal data, or whole database rows.
- Prices, totals, discounts, roles, and plan limits are computed or verified on
  the server, never trusted from the client.
- Admin and internal endpoints require admin authorization; no hidden or debug
  routes in production.

## Input, output, and web defaults

- Validate all input on the server. Use parameterized queries or an ORM; never
  build SQL or shell commands from strings.
- Escape output; avoid raw HTML injection (`dangerouslySetInnerHTML`, `v-html`,
  `innerHTML`) unless sanitized.
- HTTPS everywhere. Restrictive CORS (no `*` with credentials). Sensible
  security headers (CSP, frame protection) from the framework or host.
- Production errors show users a generic message; details go to server-side
  logs without secrets or personal data. No stack traces or debug mode in
  production.
- Uploads are limited by type and size, stored outside the app's executable
  path, and served with access checks.
- Payment webhooks (for example Stripe) verify signatures; checkout uses the
  provider's hosted page.

## Supply chain and operations

- Use maintained, widely used dependencies; check for known vulnerabilities
  (`npm audit` or the ecosystem equivalent) before release.
- Least privilege for every account, key, and database user. Remove access for
  people and keys no longer needed.
- Backups are protected like production data.
- AI features: treat model output and user-provided content as untrusted; never
  let them trigger privileged actions or reach secrets without server checks.

## Evidence

For each release, state how the baseline was verified: tests for permission
and tenant isolation, a scan of the client bundle and network responses for
secrets and sensitive fields, dependency audit results, and anything not
checked.
