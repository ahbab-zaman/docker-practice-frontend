# Frontend AGENTS.md

Stack: **React + TypeScript + Tailwind CSS** (Vite)
Package manager: **npm**
Repo: standalone (`/frontend`), talks to the backend over HTTP with credentialed
(cookie-based) requests.

This document is the source of truth for how this frontend should be structured and built.
Follow it phase by phase — each phase should be working and committed before the next.

---

## 1. Guiding principles

- **Feature-oriented, reusable-first.** Generic UI pieces live in `components/ui`; anything
  page-specific stays close to its page.
- **No hardcoded colors.** Every color used in Tailwind classes must resolve to a CSS
  variable defined in `index.css`, never a raw hex/rgb value in JSX.
- **Typed everything.** No `any`. API responses, form data, and context values are all
  explicitly typed, and validated at runtime with zod where the data comes from outside
  the app (API responses, form input).
- **The backend owns the session.** The frontend never reads or stores the auth token —
  it's an httpOnly cookie the browser manages automatically. The frontend only tracks
  "am I authenticated" as UI state, sourced from calling the backend.
- **Small, boring state management.** React Context + hooks is enough for this app's
  scope (just auth state). Don't reach for Redux/Zustand unless the app outgrows this.

---

## 2. Folder structure

```
frontend/
├── src/
│   ├── assets/                    # images, icons, fonts
│   │
│   ├── components/
│   │   ├── ui/                    # generic, reusable, no business logic
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Alert.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageLayout.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── RegisterForm.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── routes/
│   │   ├── AppRouter.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx        # user, isAuthenticated, isLoading, login/logout fns
│   │
│   ├── hooks/
│   │   └── useAuth.ts             # convenience hook to consume AuthContext
│   │
│   ├── services/                  # all HTTP calls live here, nowhere else
│   │   ├── api.ts                 # axios instance: baseURL, withCredentials: true
│   │   └── auth.service.ts        # login(), register(), logout(), getMe()
│   │
│   ├── types/
│   │   ├── auth.types.ts          # User, LoginPayload, RegisterPayload
│   │   └── api.types.ts           # ApiResponse<T> generic wrapper matching backend shape
│   │
│   ├── lib/
│   │   ├── utils.ts                # cn() class-merge helper, small pure helpers
│   │   └── validators.ts           # zod schemas for login/register forms
│   │
│   ├── constants/
│   │   └── routes.ts               # route path constants, avoid magic strings
│   │
│   ├── styles/
│   │   └── index.css               # tailwind directives + CSS custom properties
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── .env                             # gitignored
├── .gitignore
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 3. Color system (no hardcoded hex, ever)

Define the palette once, as CSS variables in `src/styles/index.css`, then map them in
`tailwind.config.ts`. Use HSL channel values (no `hsl()` wrapper) so Tailwind's opacity
modifiers (`bg-primary/80`) work.

**`index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-background: 210 20% 98%; /* soft off-white, not pure white */
  --color-surface: 0 0% 100%;
  --color-foreground: 222 20% 14%; /* soft near-black, not pure black */
  --color-muted: 215 15% 45%;

  --color-primary: 221 70% 52%; /* indigo/blue */
  --color-primary-foreground: 0 0% 100%;

  --color-accent: 172 66% 40%; /* teal accent */
  --color-accent-foreground: 0 0% 100%;

  --color-border: 214 20% 88%;

  --color-success: 142 60% 40%;
  --color-danger: 0 70% 50%;
}

.dark {
  --color-background: 222 25% 8%;
  --color-surface: 222 20% 12%;
  --color-foreground: 210 20% 96%;
  --color-muted: 215 12% 65%;
  --color-border: 217 15% 22%;
  /* primary/accent/success/danger can stay or shift slightly for dark mode */
}
```

**`tailwind.config.ts`**

```ts
colors: {
  background: 'hsl(var(--color-background) / <alpha-value>)',
  surface: 'hsl(var(--color-surface) / <alpha-value>)',
  foreground: 'hsl(var(--color-foreground) / <alpha-value>)',
  muted: 'hsl(var(--color-muted) / <alpha-value>)',
  primary: {
    DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
    foreground: 'hsl(var(--color-primary-foreground) / <alpha-value>)',
  },
  accent: {
    DEFAULT: 'hsl(var(--color-accent) / <alpha-value>)',
    foreground: 'hsl(var(--color-accent-foreground) / <alpha-value>)',
  },
  border: 'hsl(var(--color-border) / <alpha-value>)',
  success: 'hsl(var(--color-success) / <alpha-value>)',
  danger: 'hsl(var(--color-danger) / <alpha-value>)',
}
```

Then use `bg-background`, `text-foreground`, `bg-primary text-primary-foreground`,
`border-border`, `text-danger`, etc. — never `bg-[#3b82f6]` or `text-black`.

This gives a **minimal but real palette** (off-white/near-black neutrals + one primary +
one accent + semantic success/danger) instead of literal black-and-white, and dark mode
is a free upgrade later since everything is a variable.

---

## 4. Conventions

### TypeScript

- `strict: true`, no `any`.
- Component props: `type Props = { ... }` (prefer `type` for props, `interface` for
  extendable/public shapes like `User`).
- API responses typed with a shared generic:
  ```ts
  type ApiResponse<T> =
    | { success: true; data: T; message?: string }
    | { success: false; message: string; errors?: unknown };
  ```
- Runtime validation with **zod** at the two boundaries where untyped data enters the app:
  form input and API responses. `lib/validators.ts` holds the schemas; infer types from
  them with `z.infer<typeof schema>` instead of hand-duplicating types.

### Components

- `components/ui/*` — no business logic, no API calls, fully reusable (Button, Input,
  Card...). Styled only via the CSS variables above.
- `components/auth/*` — feature components (forms) that _use_ `ui/*` and call `services/`.
- Pages compose layout + feature components; pages themselves stay thin.

### Services layer

- All `fetch`/`axios` calls go through `services/*.ts`. Components and pages never call
  `axios` directly — this keeps the API surface swappable and testable.
- `services/api.ts`: single axios instance, `baseURL: import.meta.env.VITE_API_URL`,
  `withCredentials: true` (required for the httpOnly auth cookie to be sent/received).

### Environment variables

`.env.example`:

```
VITE_API_URL=http://localhost:4000/api
```

Vite only exposes vars prefixed `VITE_` to client code — never put secrets here, since
anything in `import.meta.env` ships to the browser. This is purely for config like API
base URL, not for actual secrets (the frontend shouldn't hold any).

---

## 5. Authentication flow (frontend side)

- The backend sets/clears an **httpOnly cookie** — JS on the frontend never sees or
  stores the token directly. `AuthContext` only tracks derived UI state: `user`,
  `isAuthenticated`, `isLoading`.
- **On app load**: `AuthContext` calls `authService.getMe()` once. If it succeeds, set
  `user`; if 401, `user = null`. This is how the app "remembers" a logged-in user across
  refreshes without touching localStorage.
- **Login/Register**: call the service, on success set `user` from the response and
  redirect to home.
- **Logout**: call `authService.logout()` (clears the cookie server-side), then set
  `user = null` and redirect — "automatically removed" happens on the backend, the
  frontend just reflects it.
- **ProtectedRoute**: reads `isAuthenticated`/`isLoading` from `useAuth()`; while loading,
  render a spinner (don't flash a redirect before the `/me` check resolves); if not
  authenticated, redirect to `/login`.

---

## 6. Build phases

### Phase 0 — Project bootstrap

**Initialization commands** (run in order, from the parent folder where you want `frontend/`):

```bash
# 1. Scaffold Vite + React + TypeScript
npm create vite@latest .
npm install

# 2. App dependencies
npm install react-router-dom axios zod

# 3. Tailwind CSS (v3 config-file workflow, matches tailwind.config.ts used in this doc)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Path alias support + dev tooling
npm install -D @types/node eslint prettier eslint-config-prettier \
  eslint-plugin-react-hooks eslint-plugin-react-refresh

# 5. Scaffold the folder structure
mkdir -p src/assets src/components/ui src/components/layout src/components/auth \
  src/pages src/routes src/context src/hooks src/services src/types src/lib \
  src/constants src/styles

# 6. Env files
touch .env .env.example
echo "VITE_API_URL=http://localhost:4000/api" > .env.example
```

**`tailwind.config.ts`** — set the `content` globs so Tailwind scans your files, then add
the color mapping from section 3:

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* paste the colors object from section 3 */
      },
    },
  },
  plugins: [],
} satisfies Config;
```

> `tailwindcss init -p` generates `.js` config files by default — rename
> `tailwind.config.js` → `tailwind.config.ts` and `postcss.config.js` stays as-is (Vite
> only needs the Tailwind config in TS for editor type-checking, not strictly required,
> `.js` works too if you'd rather skip the rename).

**Path alias `@/*` → `src/*`** — add to `tsconfig.json` (`compilerOptions`):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

and to `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- `npm run dev` should now boot a blank Vite + Tailwind app before moving to Phase 1.

### Phase 1 — Design system

- Write `index.css` with the CSS variable palette above.
- Wire `tailwind.config.ts` to those variables.
- Build `components/ui`: `Button`, `Input`, `Card`, `Spinner`, `Alert` — using only
  semantic color classes, with variants (e.g. `Button` primary/secondary/danger) done via
  props, not hardcoded colors.

### Phase 2 — Layout & routing skeleton

- `AppRouter.tsx` with routes for `/`, `/login`, `/register`.
- `Navbar`/`Footer`/`PageLayout`.
- `HomePage` as a static placeholder for now.

### Phase 3 — Types & services layer

- `types/api.types.ts`, `types/auth.types.ts`.
- `services/api.ts` (axios instance, `withCredentials: true`).
- `services/auth.service.ts`: `register()`, `login()`, `logout()`, `getMe()` — typed
  request/response, no UI logic.

### Phase 4 — Auth context & hook

- `AuthContext.tsx`: state (`user`, `isLoading`, `isAuthenticated`), calls `getMe()` on
  mount, exposes `login`, `register`, `logout` methods that call the service then update
  state.
- `useAuth.ts` hook, `AuthProvider` wraps `App.tsx`.

### Phase 5 — Register page

- `lib/validators.ts`: zod schema for register form (email format, password min length,
  confirm-password match).
- `RegisterForm.tsx` using `ui/Input`, `ui/Button`; inline validation errors; calls
  `useAuth().register()`; shows `Alert` on failure.

### Phase 6 — Login page

- Same pattern as register, simpler schema. On success, redirect to home (or the page the
  user was trying to reach).

### Phase 7 — Protected areas & logout

- `ProtectedRoute.tsx` guarding any page that requires auth.
- `Navbar` shows Login/Register when logged out, user info + Logout button when logged in.
- Logout button calls `useAuth().logout()`.

### Phase 8 — Polish

- Loading spinners during async auth actions (don't let forms double-submit).
- Consistent error display (reuse `Alert`).
- Responsive layout check (mobile nav, form widths).
- Empty/loading state for the initial `getMe()` check on app boot.

### Phase 9 — Docker readiness (do NOT do until told)

- Confirm `VITE_API_URL` is the only backend-facing config, fully env-driven.
- Production build (`npm run build`) output in `dist/` is what gets served (e.g. by
  nginx) in the eventual container — no code changes needed since it's already
  build-time env driven via Vite.

---

## 7. Definition of done (for this whole build, pre-Docker)

- [ ] Home page renders, nav reflects logged-out state by default.
- [ ] Can register, get redirected and logged in.
- [ ] Can log in with existing credentials.
- [ ] Refreshing the page keeps the user logged in (via `getMe()` cookie check).
- [ ] Can log out, nav reflects logged-out state, protected routes redirect to `/login`.
- [ ] No hardcoded hex colors anywhere in the codebase (`grep -r "#" src` should turn up
      nothing but the CSS variable definitions).
- [ ] `npm run build` succeeds with zero TS errors.
