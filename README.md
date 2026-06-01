# Legend Driver

Field-operations app for Legend Rent-a-Car drivers. Built against the customer app contract documented in `legend-car-rental`.

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/USER_APP_OVERVIEW.md](./docs/USER_APP_OVERVIEW.md) | Customer app reference |
| [docs/DRIVER_APP_SPEC.md](./docs/DRIVER_APP_SPEC.md) | Full driver build spec |
| [docs/README.md](./docs/README.md) | Doc index |
| [docs/DRIVER_UI_PARITY.md](./docs/DRIVER_UI_PARITY.md) | UI parity vs user app |

## Brand (colors & fonts)

Aligned with **legend-car-rental** (user app) — see `src/constants/colors.ts`, `src/constants/appFonts.ts`, `src/theme/`.

```sh
npm run link:fonts
cd ios && pod install && cd ..
```

### Maps (Job map screen)

- **iOS:** Works after `pod install` (Apple Maps).
- **Android:** Add your Google Maps key to `android/gradle.properties`:

```properties
MAPS_API_KEY=your_google_maps_key
```

Use the same key as **legend-car-rental** if you already have one.

## Quick start

```sh
npm install
npm run link:fonts
npm start
npm run ios          # or npm run android
```

## API / network layer

Same pattern as the user app: **Axios** + `/Driver/Api/*` endpoints.

| Item | Location |
|------|----------|
| HTTP client | `src/api/restClient.ts` |
| Endpoints | `src/api/urls/endpoints.ts` |
| Services | `src/api/services/*` |
| Local fallback | `src/api/local/localApiRouter.ts` |

Until the Driver backend is deployed, `USE_LOCAL_API_FALLBACK=true` in `src/config/env.ts` routes requests through the local router (network-shaped responses + delay). Set it to **`false`** to call the real server only.

```ts
// src/config/env.ts
export const USE_LOCAL_API_FALLBACK = true;  // → false for production API
export const API_BASE_URL_DEFAULT = 'https://admin-portal-stg.legendrentacar.com';
```

## Project structure

```
src/
├── api/
│   ├── services/       # authService, jobService, handoverService, …
│   ├── local/          # temporary router until backend live
│   ├── seed/           # response payloads for local fallback only
│   ├── mappers/
│   └── urls/
├── assets/placeholders/
├── features/
├── store/
└── …
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run generate:assets` | Regenerate placeholder PNGs |
| `npm run link:fonts` | Link Inria Serif |

## Go live checklist

1. Deploy Driver API on staging/production base URL  
2. Set `USE_LOCAL_API_FALLBACK = false`  
3. Wire auth token in `src/api/interceptors/requestInterceptor.ts`  
4. Remove or archive `src/api/seed/` + `src/api/local/` when no longer needed
