# FashionHero Sponsored Listings

Klikalny prototyp panelu sprzedawcy do testowania płatnego podbijania widoczności produktów w wynikach wyszukiwania.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/fashionhero-sponsored-listings/` — główna aplikacja React/Vite i przepływ promocji
- `FASHIONHERO_SPONSORED_LISTINGS_PROJECT_CONFIG.md` — pełna konfiguracja produktu i granice domenowe

## Architecture decisions

- Prototyp używa mockowanego sprzedawcy i przykładowych produktów, bez logowania.
- Pozycje przed/po są symulowane; aplikacja nie implementuje realnego rankingu wyszukiwania.
- Zakup jest wyłącznie demonstracyjny; nie dodajemy Stripe, PayU ani innej integracji płatności.
- Zdarzenia promocji zapisują się lokalnie jako `PromotionEvent`, aby testować ukończenie flow także po odświeżeniu.

## Product

Sprzedawca widzi produkty z aktualną pozycją, otwiera promocję, wybiera pakiet 3/7/14 dni, ogląda symulację `#X → #Y`, a następnie zapisuje demonstracyjne zdarzenie zakupu i otrzymuje potwierdzenie aktywacji.

## User preferences

- Interfejs ma być jasnym panelem B2B w palecie biel/granat/żółty akcent.
- Waluta to PLN; pakiety i ceny wymagają pytania przed zmianą.

## Gotchas

- Przy każdym zakupie musi być widoczny komunikat: „symulacja — żadna płatność nie została pobrana”.
- Nie dodawać rejestracji/logowania, panelu admina ani prawdziwej integracji płatności.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
