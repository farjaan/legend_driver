# Legend Driver — Documentation

| Document | Description |
|----------|-------------|
| [USER_APP_OVERVIEW.md](./USER_APP_OVERVIEW.md) | Legend Car Rental **customer app** — what exists today (`legend-car-rental`) |
| [DRIVER_APP_SPEC.md](./DRIVER_APP_SPEC.md) | **Driver app** build spec — screens, mocks, phases, API alignment |
| [DRIVER_UI_PARITY.md](./DRIVER_UI_PARITY.md) | UI/UX parity checklist vs user app (brand, tabs, maps, profile) |

**Build order:** Read user overview first → implement driver spec with dummy data → integrate Driver API when ready.

## Scaffold status

The repo includes a working **network API scaffold**:

- `src/api/services/` — Axios services (`jobService`, `authService`, …)
- `src/api/local/` — local fallback router until `/Driver/Api` is live
- `src/assets/placeholders/` — bundled images for handover UI
- `src/features/` — screens wired to services
- `src/navigation/` — tabs + root stack

Run the app: see root [README.md](../README.md).
