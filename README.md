# Nova Market — Single-Vendor E-commerce Frontend

A standalone, production-shaped storefront: React + Tailwind + GSAP. Built as
a starting point for you to reskin and wire up to your backend.

## Run it

```bash
npm install
npm run dev
```

## What's included

- **Auth:** Sign up, sign in, forgot password, reset password (`/reset-password/:token`), email verify (`/verify-email/:token`)
- **Store:** Home (animated hero, categories, featured grid, newsletter), product listing with filters, single product page, cart
- **Account:** Profile page with sidebar (profile form, orders placeholder, logout confirm)
- **State:** `AuthContext` (shared login state) and `CartContext` (shared cart state) — same pattern, so any page can read/write either without prop-drilling
- **Motion:** GSAP hero load sequence (staggered headline, floating badge) + a reusable `useScrollReveal` hook for fade-up-on-scroll grids

## Design tokens

| Role | Value |
|---|---|
| `ink` | `#0B1220` — dark sections, primary text |
| `paper` | `#FFFFFF` — base background |
| `mist` | `#F1F5F9` — section fills, input backgrounds |
| `brand-400/500` | `#38BDF8` / `#0EA5E9` — CTAs, links, accents |
| `amber-400` | `#F59E0B` — discount badges |
| Display type | Space Grotesk |
| Body type | Inter |
| Mono (prices, timers) | JetBrains Mono |

## Wiring up your backend

Every page that needs data has a `// TODO` or a commented-out `api.get(...)`
call sitting right where the real fetch should go (`Home.jsx` uses static
`FEATURED` data, `Products.jsx` uses `SAMPLE`, `SingleProduct.jsx` uses
`SAMPLE_PRODUCT`, `Profile.jsx` orders tab is a placeholder). Swap those for
real calls once your API routes are ready — the component structure won't
need to change.

`src/api/axios.js` centralizes the base URL and attaches the JWT from
`localStorage` automatically — update `API_ORIGIN` to point at your backend.

## Customizing

- Swap the palette/fonts in `tailwind.config.js` + `index.html` font link
- Replace the placeholder "Product shot" hero block in `Home.jsx` with a real image
- `ProductCard.jsx`, `AuthLayout.jsx`, and `FormField.jsx` are the shared
  building blocks most pages lean on — tweak those once, it propagates everywhere
