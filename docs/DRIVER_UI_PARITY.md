# Driver app UI parity (vs Legend user app)

> **User app:** `/Users/farjaanpatel/legend-car-rental`  
> **Driver app:** `/Users/farjaanpatel/LegendDriver`  
> **Last updated:** May 2026

## Brand alignment

| Token | Value |
|-------|--------|
| Primary purple | `#2C1B47` |
| Accent orange | `#F08900` |
| Screen background | Light `#F4F2F7` · Dark `#121018` (theme tokens) |
| Theme | **Light / Dark / System** — Settings → Appearance, persisted |
| Font | Inria Serif (`src/assets/fonts`) |
| Icons | FontAwesome5 (linked in iOS/Android) |

## Navigation

| User app | Driver app |
|----------|------------|
| Custom tab bar + center Book FAB (Demo) | **Flat 4-tab bar** — Home · Jobs · Chat · Profile |
| Profile → Edit Profile, Settings, menu sections | **Same pattern** — Account / Work / Support / App |
| Stack screens hide default header | `ScreenScaffold` + back button |

## Maps

| Platform | Requirement |
|----------|-------------|
| **iOS** | Apple Maps via `react-native-maps` (no Google key required) |
| **Android** | Set `MAPS_API_KEY` in `android/gradle.properties` (same Google Cloud key as user app) |

Job Map screen shows **live MapView** with customer + branch markers and “Open in Google Maps”.

## Screen status

| Screen | Status |
|--------|--------|
| Splash | Branded |
| Login + OTP modal | Aligned with user login |
| Home dashboard | Modern cards, tight spacing |
| Job inbox + JobCard | Modern |
| Job detail + related flows | Modern hero, timeline, actions |
| Map | **react-native-maps** |
| Handover verify / checkout / check-in | Modern forms |
| Chauffeur trip | Timer + stops |
| Chat | Bubbles + composer |
| Profile | Menu sections like user app |
| Edit profile | **New** |
| Settings | Theme + language + notifications |
| My vehicles | **New** |
| Breakdown / notifications / ratings / penalties | Modern list cards |

## Functionality (local fallback)

| Flow | Test |
|------|------|
| Login OTP | `123456` |
| Handover OTP | `123456` |
| Handover QR | prefix `LGC-HANDOVER-` |
| Edit profile | Saves to local profile state |
| Jobs | Accept / reject / advance status |

Set `USE_LOCAL_API_FALLBACK = false` in `src/config/env.ts` when Driver API is live.
